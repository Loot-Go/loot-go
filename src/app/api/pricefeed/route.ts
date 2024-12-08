export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.getAll("ids[]");
    const mode = searchParams.getAll("mode") ?? "latest";

    if (!ids || ids.length === 0) {
      return Response.json(
        {
          error:
            "Missing or invalid `ids` parameter. Pass at least one ID as an array.",
        },
        { status: 400 },
      );
    }

    const queryString = ids.map((id) => `ids[]=${id}`).join("&");

    const url =
      String(mode) === "stream"
        ? `https://hermes.pyth.network/v2/updates/price/stream?${queryString}`
        : `https://hermes.pyth.network/v2/updates/price/latest?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Map to calculate the actual price
    const prices = data.parsed.map(
      (entry: { price: { price: string; expo: number } }) => {
        const { price, expo } = entry.price;
        return parseFloat(price) * Math.pow(10, expo);
      },
    );

    return Response.json(prices);
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { error: "Failed to fetch data from Pyth Network" },
      { status: 500 },
    );
  }
}
