import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

import bs58 from "bs58";

import type { NextApiRequest, NextApiResponse } from "next";

const SOLANA_URL = clusterApiUrl("mainnet-beta");
const WALLET_SECRET_KEY = process.env.WALLET_SECRET_KEY;

const TOKENS = [
  // {
  //   name: "Michi",
  //   address: "5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp",
  //   decimals: 6,
  // },
  // {
  //   name: "WIF",
  //   address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
  //   decimals: 6,
  // },
  {
    name: "Bonk",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { recipientAddress, amount } = req.body;

    if (!recipientAddress || !amount) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const randomToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    const mintAddress = new PublicKey(randomToken.address);

    const connection = new Connection(SOLANA_URL);
    const walletSecretKey = bs58.decode(WALLET_SECRET_KEY!);
    const walletKeypair = Keypair.fromSecretKey(walletSecretKey);

    const recipientPubKey = new PublicKey(recipientAddress);

    const walletTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      walletKeypair.publicKey,
    );
    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      recipientPubKey,
    );

    const amountOfTokens =
      randomToken.name === "WIF"
        ? (amount * 10 ** randomToken.decimals) / 10
        : amount * 10 ** randomToken.decimals;

    const transaction = new Transaction();
    const recipientAccountInfo = await connection.getAccountInfo(
      recipientTokenAccount,
    );

    if (!recipientAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletKeypair.publicKey,
          recipientTokenAccount,
          recipientPubKey,
          mintAddress,
        ),
      );
    }

    transaction.add(
      createTransferInstruction(
        walletTokenAccount,
        recipientTokenAccount,
        walletKeypair.publicKey,
        amountOfTokens,
        [],
        TOKEN_PROGRAM_ID,
      ),
    );

    const txId = await sendAndConfirmTransaction(connection, transaction, [
      walletKeypair,
    ]);
    return res.status(200).json({
      message: `SPL tokens (${randomToken.name}) transferred successfully`,
      txId,
    });
  } catch (error) {
    console.log("Error transferring SPL tokens:", error);
    return res.status(500).json({
      message: "Failed to transfer SPL tokens",
      error: (error as Error).message,
    });
  }
}
