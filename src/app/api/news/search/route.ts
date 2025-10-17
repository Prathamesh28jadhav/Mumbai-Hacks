import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.NEWSAPI_KEY;

    if (!apiKey) throw new Error("Missing NEWS_API_KEY");

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevance&pageSize=10&apiKey=${apiKey}`
    );

    const data = await response.json();

    if (data.status === "error") {
      console.error("News API error:", data);
      return NextResponse.json({ error: data.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Failed to search news" }, { status: 500 });
  }
}
