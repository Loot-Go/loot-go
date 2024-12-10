"use client";

import AccountWrapper from "@/components/common/account-wrapper";
import ChartOption from "@/components/market/chart-option";
import Percentage from "@/components/market/percentage";
import { PriceChart } from "@/components/market/price-chart";
import { formatDate } from "@/lib/helpers";
import {
  FusionSDK,
  NetworkEnum,
  OrderStatus,
  Web3Like,
  Web3ProviderConnector,
} from "@1inch/fusion-sdk";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import CountUp from "react-countup";

interface DetailsPageProps {
  params: {
    id: string;
  };
}

const DetailsPage: FC<DetailsPageProps> = ({ params }) => {
  const coinId = params.id;

  const searchParams = useSearchParams();
  const logo = searchParams?.get("logo");
  const price = Number(searchParams?.get("price")) * 15353;
  const marketCap = searchParams?.get("marketCap");

  console.log("________________________________________");
  console.log({ logo, price, marketCap });
  console.log("________________________________________");

  console.log(params);
  const isLoggedIn = useIsLoggedIn();

  const { primaryWallet } = useDynamicContext();

  const [activeChart, setActiveChart] = useState("7d");
  const [chartValues, setChartValues] = useState([]);

  const getChartData = async () => {
    const fromTimestamp =
      new Date().getTime() -
      Number(activeChart.replace("d", "")) * 24 * 60 * 60 * 1000;

    const toTimestamp = new Date().getTime();

    const result = await fetch(`/api/chart?id=${coinId}`);

    const data = await result.json();

    setChartValues(
      data.map((price: [number, number]) => {
        return {
          date: formatDate(new Date(price[0])),
          price: price[1],
        };
      }),
    );
  };

  const buyHandler = async () => {
    console.log("buyHandler");
    console.log(primaryWallet);
    if (primaryWallet) {
      const signer = await getSigner(primaryWallet);
      const provider = signer.provider;
      console.log(signer);
      console.log(provider);
      const ethersProviderConnector: Web3Like = {
        eth: {
          call(transactionConfig): Promise<string> {
            return signer.call(transactionConfig);
          },
        },
        extend(): void {},
      };
      const connector = new Web3ProviderConnector(ethersProviderConnector);
      const DEV_PORTAL_API_TOKEN = process.env.NEXT_PUBLIC_1INCH_API_KEY!;

      const sdk = new FusionSDK({
        url: "https://api.1inch.dev/fusion",
        network: NetworkEnum.COINBASE,
        blockchainProvider: connector,
        authKey: DEV_PORTAL_API_TOKEN,
      });
      const params = {
        fromTokenAddress: "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE", // 1inch
        toTokenAddress: "0x4200000000000000000000000000000000000006", // WETH
        amount: "1000000000000000000", // 10 1inch
        walletAddress: signer.address,
        source: "sdk-test",
      };

      const quote = await sdk.getQuote(params);

      const dstTokenDecimals = 18;
      const preparedOrder = await sdk.createOrder(params);

      const info = await sdk.submitOrder(
        preparedOrder.order,
        preparedOrder.quoteId,
      );

      console.log("OrderHash", info.orderHash);

      const start = Date.now();

      while (true) {
        try {
          const data = await sdk.getOrderStatus(info.orderHash);

          if (data.status === OrderStatus.Filled) {
            console.log("fills", data.fills);
            break;
          }

          if (data.status === OrderStatus.Expired) {
            console.log("Order Expired");
            break;
          }

          if (data.status === OrderStatus.Cancelled) {
            console.log("Order Cancelled");
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }

      console.log("Order executed for", (Date.now() - start) / 1000, "sec");
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <AccountWrapper status={isLoggedIn}>
      <div className="flex min-h-screen flex-col bg-[#000] text-white">
        <div className="relative">
          <Link href="/market" className="absolute left-5 top-6">
            <ArrowLeftIcon className="h-4 w-4 cursor-pointer" />
          </Link>
        </div>
        <div className="my-10 grid place-items-center pt-20">
          <img
            src={
              logo ??
              "https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044"
            }
            className="h-[40px] w-[40px] rounded-full"
            alt=""
          />
          <b className="mt-4 text-2xl font-bold">
            ${" "}
            <CountUp
              duration={1}
              className="counter"
              end={Number(price ?? 0.42)}
            />
          </b>
          <Percentage percentage="4.5%" />
        </div>

        <div className="mb-20">
          <div className="scale-105 overflow-hidden transition-all duration-300">
            <PriceChart data={chartValues} />
          </div>

          <div className="mt-5 flex items-center justify-center space-x-2">
            <ChartOption
              title="7d"
              active={activeChart === "7d"}
              onClick={() => setActiveChart("7d")}
            />
            <ChartOption
              title="14d"
              active={activeChart === "14d"}
              onClick={() => setActiveChart("14d")}
            />
            <ChartOption
              title="30d"
              active={activeChart === "30d"}
              onClick={() => setActiveChart("30d")}
            />
            <ChartOption
              title="1y"
              active={activeChart === "364y"}
              onClick={() => setActiveChart("364y")}
            />
          </div>
        </div>

        <div className="mt-28 flex space-x-2 bg-[#000] px-5 pb-10">
          <button
            onClick={buyHandler}
            className="flex-1 rounded-xl bg-[#F15950] px-4 py-3 font-bold"
          >
            BUY
          </button>
          <button
            onClick={buyHandler}
            className="flex-1 rounded-xl bg-[#10DC78] px-4 py-3 font-bold"
          >
            SELL
          </button>
        </div>
      </div>
    </AccountWrapper>
  );
};

export default DetailsPage;
