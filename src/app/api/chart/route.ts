import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json([
    [1704067241331, 42261.0406175669],
    [1704070847420, 42493.2764087546],
    [1704074443652, 426540731066594],
  ]);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const vsCurrency = searchParams.get("vs_currency") || "usd"; // Default to 'usd'
    const from = searchParams.get("from");
    const to = searchParams.get("to");

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
    const prices = data.prices;

    return Response.json(prices);
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { error: "Failed to fetch data from CoinGecko" },
      { status: 500 },
    );
  }
}
