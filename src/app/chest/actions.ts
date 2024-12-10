"use server";

import axios from "axios";

const price = 0.001711;
export const getRandomAirdrop = async (walletAddress: string) => {
  if (!walletAddress) {
    return null;
  }

  const randomNumber = Math.floor(Math.random() * (600 - 10 + 1)) + 10;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URI}/api/send_token`,
    {
      recipientAddress: walletAddress,
      amount: randomNumber,
    },
  );

  const data = await response.data;

  console.log(data);

  return {
    value: randomNumber ? Number(randomNumber) : 0,
    amount: randomNumber ? Number(randomNumber) * price : 0,
    image: "/token.jpg",
    txId: data.txId as string,
  };
};
