import axios from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet_address = searchParams.get("wallet_address");

  if (!wallet_address) {
    return new Response(
      JSON.stringify({ error: "wallet_address is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const url = `https://api.1inch.dev/history/v2.0/history/${wallet_address}/events`;

  const config = {
    headers: {
      Authorization: "Bearer ewOwBTQ87PrAWK7cQVjjLISKkjmc2kXr",
    },
    params: {
      limit: "10",
      chainId: "8453",
    },
    paramsSerializer: {
      indexes: null,
    },
  };

  try {
    const response = await axios.get(url, config);

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data", details: error }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
