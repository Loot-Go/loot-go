"use client";

import CoinCard from "@/components/market/coin-card";
import Percentage from "@/components/market/percentage";
import Transaction from "@/components/market/transactions";
import { Avatar, Badge, Identity, Name } from "@coinbase/onchainkit/identity";
import { SpinnerIcon, useUserWallets } from "@dynamic-labs/sdk-react-core";
import axios from "axios";
import { useEffect, useState } from "react";

type Coin = {
  price: number;
  image: string;
  marketCap: number;
  symbol: string;
};

type TransactionType = {
  direction: string;
  details: {
    type: string;
    status: string;
    feeInWei: number;
  };
};

const Tabs = ({
  onClick,
  label,
  active,
}: {
  onClick: () => void;
  label?: string;
  active?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer py-3 text-center ${
        active
          ? "border-b-4 border-black font-semibold text-lime-500"
          : "text-white"
      }`}
    >
      {label}
    </div>
  );
};

const ChestPage = () => {
  const userWallets = useUserWallets();
  const wallet = userWallets?.[0]?.address;
  const [tab, setTab] = useState("Portfolio");
  const [tokens, setTokens] = useState<Coin[]>([]);
  const [tokenError, setTokenError] = useState<null | string>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [transactionError, setTransactionError] = useState<null | string>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched) return; // Skip if data already fetched

      try {
        const [historyResponse, tokensResponse] = await Promise.all([
          axios.get(
            `/api/transactions?wallet_address=0x568b9bFfF4a3a7C7351db84EC2F4Ad4CA147A1D0`,
          ),
          axios.get(
            `/api/user_tokens?wallet_address=0x568b9bFfF4a3a7C7351db84EC2F4Ad4CA147A1D0`,
          ),
        ]);

        setTransactions(historyResponse.data.items);
        if (tokensResponse.data.length > 0) {
          setTokens(tokensResponse.data);
        }
        setDataFetched(true);
      } catch (err) {
        setTransactionError("Failed to fetch transaction details");
        setTokenError("Failed to fetch token details");
      } finally {
        setIsTokenLoading(false);
        setIsTransactionLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="relative mx-auto max-w-[90%]">
        <div
          className="absolute top-0 -mt-5 h-32 w-full animate-pulse bg-lime-700 blur-2xl"
          style={{
            transitionDuration: "10000ms",
          }}
        ></div>

        <div className="relative z-10 grid place-items-center pt-16 text-center">
          {wallet ? (
            <Identity
              className="my-5"
              address={wallet as `0x${string}`}
              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            >
              <Avatar />
              <Name className="ml-5">
                <Badge />
              </Name>
            </Identity>
          ) : null}

          <div className="text-3xl font-black">$3,291</div>

          <Percentage percentage="91%" />

          <div className="flex flex-col items-center">
            <img
              src="/add_cash.png"
              className="mt-10 h-[40px] w-[40px]"
              alt=""
            />
            <div className="mt-2 text-center">Add Cash</div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-center justify-between px-2">
            <b>Cash $1,200</b>
            <img
              src="/plus.png"
              className="h-[40px] w-[40px] rounded-full"
              alt=""
            />
          </div>

          <div className="mt-5 space-y-5 px-2">
            <div className="grid grid-cols-2 place-items-center border-b">
              <Tabs
                onClick={() => setTab("Portfolio")}
                label="Portfolio"
                active={tab === "Portfolio"}
              />
              <Tabs
                onClick={() => setTab("History")}
                active={tab === "History"}
                label="History"
              />
            </div>

            {tab === "Portfolio" && (
              <>
                {isTokenLoading ? (
                  <div className="flex h-52 w-full items-center justify-center">
                    <SpinnerIcon className="h-10 w-10 animate-spin" />
                  </div>
                ) : tokens.length > 0 ? (
                  tokens.map((t, index) => (
                    <CoinCard
                      key={index}
                      logo={t.image}
                      price={t.price}
                      marketCap={t.marketCap}
                      symbol={t.symbol}
                    />
                  ))
                ) : (
                  <div className="text-center">No tokens available</div>
                )}
              </>
            )}

            {tab === "History" && (
              <>
                {isTransactionLoading ? (
                  <div className="flex h-52 w-full items-center justify-center">
                    <SpinnerIcon className="h-10 w-10 animate-spin" />
                  </div>
                ) : transactions.length > 0 ? (
                  transactions.map((t, index) => (
                    <Transaction
                      key={index}
                      transactionPosition={t.direction}
                      transactionType={t.details.type}
                      status={t.details.status}
                      fee={t.details.feeInWei}
                    />
                  ))
                ) : (
                  <div className="text-center">No transactions available</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChestPage;
