import { PRICE_CHART } from "@/config/chart";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const vsCurrency = searchParams.get("vs_currency") || "usd"; // Default to 'usd'
    const from = searchParams.get("from") ?? "1731629930";
    const to = searchParams.get("to") ?? "1731729930";

    if (!from || !to) {
      return Response.json(
        {
          error:
            "Missing or invalid `from` or `to` parameter. Both are required.",
        },
        { status: 400 },
      );
    }

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=${vsCurrency}&from=${from}&to=${to}`;

    console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "x-cg-api-key": process.env.COINGECKO_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    console.log(data);
    const prices = data.prices;

    if (prices.length === 0) {
      return Response.json(PRICE_CHART.prices);
    }

    return Response.json(prices);
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(PRICE_CHART.prices);
  }
}
