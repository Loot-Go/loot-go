import { abi } from "@/config/abi";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Test");
  console.log(req.body);

  const { walletAddress, randomNumber } = req.body;

  const providerUrl = "https://spicy-rpc.chiliz.com/";
  const provider = new ethers.JsonRpcProvider(providerUrl);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const contractAddress = "0x7CC3922213136A7Ce8467eCB02FdF4135D5d400F";
  const tokenAddress = "0xe77C75Ec925b36A3F2AF8a1fc62769e5ef8201cA";

  const contract = new ethers.Contract(contractAddress, abi, wallet);
  const airdrop = await contract.distribute(
    walletAddress,
    tokenAddress,
    ethers.parseEther(randomNumber.toString()).toString(),
  );

  return res.status(200).json({
    message: "Token sent successfully",
    airdrop,
  });
}
