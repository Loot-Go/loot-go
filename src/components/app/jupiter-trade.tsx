"use client";

import {
  useDynamicContext,
  useSwitchWallet,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const assets = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  {
    name: "CTOAD",
    mint: "Mse6hcdxMWgQgEW7AcidAYw2G5ucW5fC8XK3NWYpump",
    decimals: 6,
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
  },
  {
    name: "BONK",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
  },
  {
    name: "WIF",
    mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    decimals: 6,
  },
];

const debounce = <T extends unknown[]>(
  func: (...args: T) => void,
  wait: number,
) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: T) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Swap({ mode, coin }: { mode: string; coin: string }) {
  const coinInfo = assets.find((asset) => asset.name === coin);
  const [fromAsset, setFromAsset] = useState(
    mode === "buy" ? assets[2] : coinInfo,
  );
  const [toAsset, setToAsset] = useState(mode === "buy" ? coinInfo : assets[2]);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const userWallets = useUserWallets();
  const switchWallet = useSwitchWallet();
  const { primaryWallet } = useDynamicContext();
  const wallet = useWallet();

  console.log("fromAsset");
  console.log(fromAsset);
  console.log("toAsset");
  console.log(toAsset);

  useEffect(() => {
    console.log("userWallets");
    console.log(userWallets);
    console.log(switchWallet);

    for (const wallet of userWallets) {
      if (wallet.chain == "SOL") {
        switchWallet(wallet.id);
      }
    }
  }, [wallet]);

  // sorta like provider
  const connection = new Connection("https://api.mainnet-beta.solana.com/");

  const handleFromAssetChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFromAsset(
      assets.find((asset) => asset.name === event.target.value) || assets[0],
    );
  };

  const handleToAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToAsset(
      assets.find((asset) => asset.name === event.target.value) || assets[0],
    );
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFromAmount(Number(event.target.value));
  };

  const debounceQuoteCall = useCallback(debounce(getQuote, 500), [
    fromAmount,
    toAsset,
    fromAmount,
  ]);

  useEffect(() => {
    debounceQuoteCall(fromAmount);
  }, [fromAmount, debounceQuoteCall]);

  async function getQuote(currentAmount: number) {
    if (isNaN(currentAmount) || currentAmount <= 0) {
      console.error("Invalid fromAmount value:", currentAmount);
      return;
    }

    const quote = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset?.mint}&outputMint=${toAsset?.mint}&amount=${currentAmount * Math.pow(10, fromAsset?.decimals ?? 0)}&slippage=0.5`,
      )
    ).json();
    console.log(quote);

    if (quote && quote.outAmount) {
      const outAmountNumber =
        Number(quote.outAmount) / Math.pow(10, toAsset?.decimals ?? 0);
      setToAmount(outAmountNumber);
    }

    setQuoteResponse(quote);
  }

  async function signAndSendTransaction() {
    console.log(userWallets);
    if (!isSolanaWallet(primaryWallet!)) {
      toast.error("Wallet is not a Solana wallet");
      return;
    }

    const connection = await primaryWallet.getConnection();
    const signer = await primaryWallet.getSigner();

    if (!wallet.connected || !wallet.signTransaction) {
      toast.error(
        "Wallet is not connected or does not support signing transactions",
      );
      return;
    }

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: primaryWallet.address?.toString(),
          wrapAndUnwrapSol: true,
          // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
          // feeAccount: "fee_account_public_key"
        }),
      })
    ).json();
    console.log("swaptx = " + swapTransaction);
    try {
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      console.log(swapTransactionBuf);
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      console.log(transaction);
      const signedTransaction = await wallet.signTransaction(transaction);

      // const txid = await  signer.sendTransaction(signedTransaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed",
      );

      toast.success(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error(error);
      toast.error("Error signing or sending the transaction");
    }
  }

  return (
    <div className="p-5">
      <div className="flex flex-col gap-2">
        <div>You pay</div>
        <div className="flex items-center gap-2">
          <div className="flex-4">
            <input
              type="number"
              value={fromAmount}
              onChange={handleFromValueChange}
              className="w-full rounded-md border p-2 text-black"
            />
          </div>
          {fromAsset?.name}

          {/* <select
            value={fromAsset?.name}
            onChange={handleFromAssetChange}
            className="w-full flex-1 rounded-md border p-2 text-black"
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select> */}
        </div>

        <p className="py-4 text-center text-gray-400">
          You will receive {toAmount.toLocaleString()} {toAsset?.name}
        </p>
        {/* <div>You receive</div> */}
        {/* <div className="flex gap-2">
          <div className="flex-4">
            <input
              type="number"
              value={toAmount}
              // onChange={(e) => setToAmount(Number(e.target.value))}
              className="bg-transparent p-2 text-white"
              readOnly
            />
            {toAsset?.name}
          </div>
           <select
            value={toAsset?.name}
            onChange={handleToAssetChange}
            className="w-full flex-1 rounded-md border p-2 text-black"
          >
            {assets.map((asset) => (
              <option key={asset.mint} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select> 
        </div> */}
        <button
          className={`flex-1 rounded-xl px-4 py-3 font-bold ${
            mode === "buy" ? "bg-[#10DC78]" : "bg-[#F15950]"
          }`}
          onClick={signAndSendTransaction}
          disabled={toAsset?.mint === fromAsset?.mint}
        >
          {mode === "buy" ? "Buy" : "Sell"}
        </button>
      </div>
    </div>
  );
}

/* Sample quote response

    {
      "inputMint": "So11111111111111111111111111111111111111112",
      "inAmount": "100000000",
      "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "outAmount": "9998099",
      "otherAmountThreshold": "9948109",
      "swapMode": "ExactIn",
      "slippageBps": 50,
      "platformFee": null,
      "priceImpactPct": "0.000146888216121999999999995",
      "routePlan": [
        {
          "swapInfo": {
            "ammKey": "HcoJqG325TTifs6jyWvRJ9ET4pDu12Xrt2EQKZGFmuKX",
            "label": "Whirlpool",
            "inputMint": "So11111111111111111111111111111111111111112",
            "outputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "inAmount": "100000000",
            "outAmount": "10003121",
            "feeAmount": "4",
            "feeMint": "So11111111111111111111111111111111111111112"
          },
          "percent": 100
        },
        {
          "swapInfo": {
            "ammKey": "ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq",
            "label": "Meteora DLMM",
            "inputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "inAmount": "10003121",
            "outAmount": "9998099",
            "feeAmount": "1022",
            "feeMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
          },
          "percent": 100
        }
      ],
      "contextSlot": 242289509,
      "timeTaken": 0.002764025
    }
    */
