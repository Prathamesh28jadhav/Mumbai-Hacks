import { NextResponse } from "next/server";

interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  // add more fields if needed
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
  // maybe `error` field
}

export async function GET() {
  try {
    const NEWS_API_KEY = process.env.NEWSAPI_KEY!;
    const url = `https://newsapi.org/v2/everything?q=misinformation&apiKey=${NEWS_API_KEY}&pageSize=12`;
    const resp = await fetch(url);
    const js = (await resp.json()) as NewsApiResponse;

    // if error in response
    if (js.status !== "ok") {
      console.error("News API error:", js);
      return NextResponse.json({ articles: [] }, { status: 500 });
    }

    // shape the data
    const articles = js.articles.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source.name,
      publishedAt: a.publishedAt,
    }));

    return NextResponse.json({ articles });
  } catch (err) {
    console.error("Error in /api/news/fetch:", err);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
