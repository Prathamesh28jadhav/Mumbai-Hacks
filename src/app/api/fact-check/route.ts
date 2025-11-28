import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { claim, articleUrl, articleContent } = await req.json();

    const factKey = process.env.GOOGLE_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!geminiKey) throw new Error("Missing GEMINI_API_KEY");

    // -----------------------------
    // 1️⃣ Fetch Article Content
    // -----------------------------
    let fullArticleText = articleContent || "";

    if (articleUrl && !fullArticleText) {
      try {
        const articleRes = await fetch(articleUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });

        if (articleRes.ok) {
          const html = await articleRes.text();
          fullArticleText = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 5000);
        }
      } catch (err) {
        console.warn("⚠️ Article fetch failed:", err);
      }
    }

    // -----------------------------
    // 2️⃣ Fetch Fact-Check Data
    // -----------------------------
    let factSummary = "No fact-check information found.";
    let factRating = "unverified";

    if (factKey) {
      try {
        const factRes = await fetch(
          `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
            claim
          )}&key=${factKey}`
        );
        const factData = await factRes.json();

        if (factData.claims?.length) {
          const review = factData.claims[0].claimReview?.[0];
          if (review) {
            factSummary =
              review.title ||
              review.text ||
              review.url ||
              "Fact-check data available but summary missing.";
            factRating = review.textualRating?.toLowerCase() || "unverified";
          }
        }
      } catch (err) {
        console.warn("⚠️ Fact Check API error:", err);
      }
    }

    // -----------------------------
    // 3️⃣ News Context (Backup)
    // -----------------------------
    let newsContext = "";
    if (newsApiKey && !fullArticleText) {
      try {
        const newsRes = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            claim
          )}&sortBy=relevancy&pageSize=3&apiKey=${newsApiKey}`
        );
        const newsData = await newsRes.json();

        if (newsData.articles?.length) {
          newsContext = newsData.articles
            .map(
              (a: any) =>
                `${a.title}: ${a.description || a.content || ""}`.trim()
            )
            .join("\n\n")
            .substring(0, 5000);
        }
      } catch (err) {
        console.warn("⚠️ NewsAPI error:", err);
      }
    }

    // -----------------------------
   // -----------------------------
// 4️⃣ AI Verification (Gemini)
// -----------------------------
const contextToAnalyze = [
  fullArticleText && `ARTICLE CONTENT:\n${fullArticleText}`,
  newsContext && `RELATED NEWS:\n${newsContext}`,
  factSummary !== "No fact-check information found." &&
    `FACT-CHECK DATA:\n${factSummary} (Rating: ${factRating})`,
  `CLAIM:\n${claim}`,
]
  .filter(Boolean)
  .join("\n\n");

const geminiModel = "gemini-2.5-flash";

const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${geminiKey}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are an AI misinformation analyst.

Analyze the provided claim and context.

${contextToAnalyze}

Follow these rules strictly:
1. Assess credibility using:
   - Fact-check data (if any)
   - Related news context
   - Logical consistency of the content
2. Classify as:
   ✅ VERIFIED — confirmed, factual, or trustworthy
   ⚠️ PARTIAL — mixed evidence, opinion, or unclear
   ❌ UNVERIFIED — lacks evidence, false, or suspicious
3. Write your response in this EXACT format:

SUMMARY: The above news is [VERIFIED/PARTIAL/UNVERIFIED] for article: "${claim}"
CLASSIFICATION: [VERIFIED / PARTIAL / UNVERIFIED]
REASONING: [1-2 sentences explaining why this classification was chosen based on the evidence]

Remember: The SUMMARY must start with "The above news is" followed by the classification status.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
        topP: 0.8,
        topK: 40,
      },
    }),
  }
);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API failed: ${errText}`);
    }

    const geminiJson = await geminiRes.json();

    const aiRaw =
      geminiJson?.candidates
        ?.flatMap((c: any) => c?.content?.parts?.map((p: any) => p.text))
        ?.filter(Boolean)
        ?.join("\n")
        ?.trim() || "AI could not generate a summary.";

    // -----------------------------
    // 5️⃣ Parse and Normalize Output (Improved)
    // -----------------------------
    let summaryMatch = aiRaw.match(/SUMMARY:\s*([\s\S]+?)(?=\nCLASSIFICATION:|$)/i);
    let classificationMatch = aiRaw.match(/CLASSIFICATION:\s*(VERIFIED|PARTIAL|UNVERIFIED)/i);
    let reasoningMatch = aiRaw.match(/REASONING:\s*([\s\S]+)/i);

    let summary =
      summaryMatch?.[1]?.trim() ||
      aiRaw.split("\n")[0].slice(0, 250) ||
      "AI could not generate a summary.";

    // Normalize classification
    let classification = (classificationMatch?.[1] || "").toUpperCase();
    if (!["VERIFIED", "PARTIAL", "UNVERIFIED"].includes(classification)) {
      // Infer from fact-check rating
      const fact = factRating.toLowerCase();
      if (/(true|accurate|correct|supported)/.test(fact)) classification = "VERIFIED";
      else if (/(false|incorrect|fake|unsupported)/.test(fact)) classification = "UNVERIFIED";
      else classification = "PARTIAL";
    }

    let reasoning =
      reasoningMatch?.[1]?.trim() ||
      `Based on available data (${factRating}), the claim’s credibility is assessed as ${classification.toLowerCase()}.`;

    // -----------------------------
    // ✅ Final Normalized Response
    // -----------------------------
    return NextResponse.json({
      status: classification.toLowerCase(),
      summary,
      reasoning,
      factCheckData: {
        rating: factRating,
        summary: factSummary,
      },
      hasArticleContent: !!fullArticleText,
      hasNewsContext: !!newsContext,
      aiRaw,
    });
  } catch (err) {
    console.error("❌ Fact-check route error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Fact-check failed",
        summary:
          "Unable to analyze content. Please try again later or check your API keys.",
      },
      { status: 500 }
    );
  }
}
