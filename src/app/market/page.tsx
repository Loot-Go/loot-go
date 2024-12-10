"use client";

import AccountWrapper from "@/components/common/account-wrapper";
import CoinCard from "@/components/market/coin-card";
import Percentage from "@/components/market/percentage";
import {
  SpinnerIcon,
  useIsLoggedIn,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import axios from "axios";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Coin = {
  price: number;
  image: string;
  marketCap: number;
  symbol: string;
  value: number;
  amount: number;
};

type TransactionType = {
  direction: string;
  details: {
    type: string;
    status: string;
    feeInWei: number;
  };
};

type MemeCoin = {
  symbol: string;
  name: string;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: Date;
};

export const MEME_COIN_FEEDS = {
  BONK: {
    id: "0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419",
    name: "BONK",
    image: "https://cryptologos.cc/logos/bonk1-bonk-logo.png",
  },
  MICHI: {
    id: "0x63a45218d6b13ffd28ca04748615511bf70eff80a3411c97d96b8ed74a6decab",
    name: "MICHI",
    image: "https://s2.coinmarketcap.com/static/img/coins/200x200/30943.png",
  },
  WIF: {
    id: "0x4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc",
    name: "WIF",
    image:
      "https://s3.coinmarketcap.com/static-gravity/image/7979f3d6e1304b28affeac60654525d7.jpeg",
  },
};

const formatLargeNumber = (num: number) => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toFixed(2)}`;
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

const MemeCoinCard = ({ coin }: { coin: MemeCoin }) => {
  const formatPrice = (price: number) => {
    return price < 0.01 ? price.toFixed(8) : price.toFixed(4);
  };

  return (
    <div className="mt-2">
      <Link
        href={`/details/${coin.name}?logo=${
          MEME_COIN_FEEDS[coin.symbol as keyof typeof MEME_COIN_FEEDS]?.image ||
          "/placeholder-coin.png"
        }&marketCap=${coin.marketCap}&price=${formatPrice(coin.price)}`}
      >
        <div className="rounded-2xl bg-[#1E1E1E] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={
                  MEME_COIN_FEEDS[coin.symbol as keyof typeof MEME_COIN_FEEDS]
                    ?.image || "/placeholder-coin.png"
                }
                className="h-10 w-10 rounded-full"
                alt={coin.name}
              />
              <div>
                <div className="font-bold">{coin.name}</div>
                <div className="text-sm text-gray-400">{coin.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg">
                ${formatPrice(coin.price)}
              </div>
              {coin.priceChange24h && (
                <div
                  className={`flex items-center justify-end text-sm ${coin.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {coin.priceChange24h >= 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {Math.abs(coin.priceChange24h).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
          {(coin.volume24h || coin.marketCap) && (
            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
              {coin.volume24h && (
                <div>
                  <div className="text-xs">24h Volume</div>
                  <div>{formatLargeNumber(coin.volume24h)}</div>
                </div>
              )}
              {coin.marketCap && (
                <div>
                  <div className="text-xs">Market Cap</div>
                  <div>{formatLargeNumber(coin.marketCap)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

const MarketPage = () => {
  const userWallets = useUserWallets();
  const isLoggedIn = useIsLoggedIn();

  const wallet = userWallets?.[0]?.address;
  const [tab, setTab] = useState("Portfolio");
  const [tokens, setTokens] = useState<Coin[]>([]);
  const [tokenError, setTokenError] = useState<null | string>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [transactionError, setTransactionError] = useState<null | string>(null);
  const [memeCoins, setMemeCoins] = useState<MemeCoin[]>([]);
  const [isMemeCoinLoading, setIsMemeCoinLoading] = useState(true);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchMemeCoins = async () => {
    setIsMemeCoinLoading(true);
    try {
      const queryString = Object.values(MEME_COIN_FEEDS)
        .map((feed) => `ids[]=${feed.id}`)
        .join("&");

      const response = await fetch(`/api/pricefeed?${queryString}`);

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const prices = await response.json();

      const formattedCoins: MemeCoin[] = Object.entries(MEME_COIN_FEEDS).map(
        ([symbol, feed], index) => ({
          symbol,
          name: feed.name,
          price: prices[index],
          lastUpdated: new Date(),
          priceChange24h: Math.random() * 20 - 10,
          volume24h: Math.random() * 1000000000,
          marketCap: Math.random() * 10000000000,
        }),
      );

      setMemeCoins(formattedCoins);
    } catch (error) {
      console.error("Error fetching meme coins:", error);
    } finally {
      setIsMemeCoinLoading(false);
    }
  };
  const fusion = async () => {
    try {
      const response = await axios.get("/api/fusion");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching fusion orders:", error);
    }
  };

  // Fetch data only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (dataFetched) return;

      try {
        const [historyResponse, tokensResponse] = await Promise.all([
          axios.get(
            `/api/transactions?wallet_address=0x568b9bFfF4a3a7C7351db84EC2F4Ad4CA147A1D0`,
          ),
          axios.get(
            `/api/user_tokens?wallet_address=0x568b9bFfF4a3a7C7351db84EC2F4Ad4CA147A1D0`,
          ),
        ]);
        fusion();

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
    fetchMemeCoins();
  }, []);

  useEffect(() => {
    const cachedTransactions = localStorage.getItem("completed-transactions");
    const completedTransactions = cachedTransactions
      ? JSON.parse(cachedTransactions)
      : [];
    setTokens(completedTransactions);
  }, []);

  return (
    <AccountWrapper status={isLoggedIn}>
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
              <div className="flex flex-col items-center justify-center">
                <img
                  src="https://lh3.googleusercontent.com/bFUFCqQ7SiFyLP6v8hosWh5bngKK1cNL_GdDcnEERG6_OcYZ-jKTwTUFNk98VUREAwqUKncnhdlXUfOMVx_KFK1IvWAXQtYxeN8"
                  className="left-0 top-5 h-32 w-32 rounded-full"
                />
                {/* <Identity
                  className="mb-5 mt-2"
                  address={wallet as `0x${string}`}
                  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                >
                  <Avatar />

                  <Name>
                    <Badge />
                  </Name>
                </Identity> */}
              </div>
            ) : null}

            <div className="mt-4 text-3xl font-black">$3,291</div>

            <Percentage percentage="2.1%" />

            <Link
              href={"/deposit"}
              passHref
              className="flex flex-col items-center"
            >
              <img
                src="/add_cash.png"
                className="mt-10 h-[40px] w-[40px]"
                alt=""
              />
              <div className="mt-2 text-center">Add Cash</div>
            </Link>
          </div>
          <div className="mt-10">
            <div className="flex items-center justify-between px-2">
              <b>Cash $1,200</b>
              <Link
                href={"/deposit"}
                passHref
                className="flex flex-col items-center"
              >
                <img
                  src="/plus.png"
                  className="h-[40px] w-[40px] rounded-full"
                  alt=""
                />
              </Link>
            </div>

            <div className="mt-5 space-y-5 px-2">
              <div className="grid grid-cols-2 place-items-center border-b border-gray-900">
                <Tabs
                  onClick={() => setTab("Portfolio")}
                  label="Portfolio"
                  active={tab === "Portfolio"}
                />
                {/* <Tabs
                  onClick={() => setTab("History")}
                  active={tab === "History"}
                  label="History"
                /> */}
                <Tabs
                  onClick={() => setTab("Popular")}
                  active={tab === "Popular"}
                  label="Popular"
                />
              </div>

              {tab === "Portfolio" && (
                <div className="pb-10">
                  {isTokenLoading ? (
                    <div className="flex h-52 w-full items-center justify-center">
                      <SpinnerIcon className="h-10 w-10 animate-spin" />
                    </div>
                  ) : tokens.length > 0 ? (
                    tokens.map((t, index) => (
                      <CoinCard
                        key={index}
                        logo={t.image}
                        price={t.value}
                        amount={t.amount}
                      />
                    ))
                  ) : (
                    <div className="text-center">No tokens available</div>
                  )}
                </div>
              )}

              {/* {tab === "History" && (
                <div className="pb-10">
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
                </div>
              )} */}

              {tab === "Popular" && (
                <div className="pb-10">
                  {isMemeCoinLoading ? (
                    <div className="flex h-52 w-full items-center justify-center">
                      <SpinnerIcon className="h-10 w-10 animate-spin" />
                    </div>
                  ) : memeCoins.length > 0 ? (
                    <div className="space-y-4">
                      {memeCoins.map((coin, index) => (
                        <MemeCoinCard key={index} coin={coin} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">No meme coins available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AccountWrapper>
  );
};

export default MarketPage;
