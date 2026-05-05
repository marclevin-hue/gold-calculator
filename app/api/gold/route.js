export async function GET() {
  try {
    const res = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/GC=F", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const pricePerGram = Math.round((meta.regularMarketPrice / 31.1035) * 100) / 100;
    return Response.json({ price_gram_24k: pricePerGram, timestamp: meta.regularMarketTime });
  } catch {
    return Response.json({ error: "Failed to fetch price" }, { status: 500 });
  }
}
