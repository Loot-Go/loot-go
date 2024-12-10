"use server";

import axios from "axios";

const price = 0.001711;
export const getRandomAirdrop = async (walletAddress: string) => {
  if (!walletAddress) {
    return null;
  }
  const randomNumber = Math.floor(Math.random() * 1000000);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/send_token`,
    {
      walletAddress,
      randomNumber,
    },
  );

  const data = await response.data;

  console.log(data);

  return {
    value: randomNumber ? Number(randomNumber) : 0,
    amount: randomNumber ? Number(randomNumber) * price : 0,
    image: "/images/token1.svg",
  };
};
