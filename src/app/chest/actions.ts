"use server";

export const getRandomAirdrop = async (walletAddress: string) => {
  if (!walletAddress) {
    return null;
  }

  return {
    value: "13000",
    amount: "1790",
    image:
      "https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044",
  };
};
