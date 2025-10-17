import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not set" });

  try {
    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&language=en`);
    const data = await response.json();

    // Extract useful info
    const articles = data.results.map((a: any) => ({
      title: a.title,
      country: a.country || a.source?.country || "Unknown",
      category: a.category?.[0] || "General",
      publishedAt: a.pubDate,
    }));

    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news data" });
  }
}
