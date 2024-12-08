import axios from "axios";

export async function fetchTokenDetails(walletAddress: string) {
  // API URL to fetch balances from 1inch API
  const url = `https://api.1inch.dev/balance/v1.2/1/balances/${walletAddress}`;
  const config = {
    headers: {
      Authorization: "Bearer ewOwBTQ87PrAWK7cQVjjLISKkjmc2kXr",
    },
  };

  try {
    // Fetch the balances data from 1inch API
    const response = await axios.get(url, config);
    const balances = response.data; // Contract addresses and quantities

    // Prepare an array of contract addresses from the API response
    const contractAddresses = Object.keys(balances);

    // Fetch token details for each contract address
    const tokenDetailsPromises = contractAddresses.map(
      async (contractAddress) => {
        // Fetch token details from Blockscout
        const blockscoutUrl = `https://blockscout.com/eth/mainnet/api?module=token&action=getToken&contractaddress=${contractAddress}`;
        const blockscoutResponse = await axios.get(blockscoutUrl);
        const tokenData = blockscoutResponse.data.result;

        // Fetch token metadata from CoinGecko (use the contract address or a known CoinGecko ID)
        // Here I'm using a placeholder CoinGecko ID for demonstration. You might need to map contract addresses to CoinGecko IDs.
        const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contractAddress}`;
        const coinGeckoResponse = await axios.get(coinGeckoUrl);
        const tokenMetadata = coinGeckoResponse.data;

        // Construct the final token details
        return {
          contractAddress,
          quantity: balances[contractAddress],
          name: tokenData.name || tokenMetadata.name,
          symbol: tokenData.symbol || tokenMetadata.symbol,
          decimals: tokenData.decimals || tokenMetadata.decimals,
          totalSupply: tokenData.totalSupply || tokenMetadata.total_supply,
          image: tokenMetadata.image
            ? tokenMetadata.image.large
            : "default-image-url.png", // Get image URL
        };
      },
    );

    // Wait for all token details to be fetched
    const tokenDetails = await Promise.all(tokenDetailsPromises);

    return tokenDetails;
  } catch (error) {
    console.error("Error fetching token details:", error);
    return [];
  }
}
