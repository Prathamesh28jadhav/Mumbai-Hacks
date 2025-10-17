import { NextRequest, NextResponse } from "next/server";

// Basic mapping from country codes/names to lat/lng
const countryCoords: Record<string, { lat: number; lng: number }> = {
  India: { lat: 20.5937, lng: 78.9629 },
  USA: { lat: 37.0902, lng: -95.7129 },
  UK: { lat: 55.3781, lng: -3.436 },
  Germany: { lat: 51.1657, lng: 10.4515 },
  Canada: { lat: 56.1304, lng: -106.3468 },
  Australia: { lat: -25.2744, lng: 133.7751 },
  // Add more as needed
};

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&language=en`);
    const data = await response.json();

    // Aggregate articles by country
    const hotspots: any[] = [];
    data.results.forEach((article: any) => {
      const country = article.country || "Unknown";
      if (countryCoords[country]) {
        const existing = hotspots.find((h) => h.country === country);
        if (existing) existing.count += 1;
        else hotspots.push({
          country,
          lat: countryCoords[country].lat,
          lng: countryCoords[country].lng,
          topic: article.topic || "General",
          status: "unverified",
          count: 1,
        });
      }
    });

    return NextResponse.json(hotspots);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
