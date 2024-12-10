"use client";

import AccountWrapper from "@/components/common/account-wrapper";
import ChartOption from "@/components/market/chart-option";
import Percentage from "@/components/market/percentage";
import { PriceChart } from "@/components/market/price-chart";
import { formatDate } from "@/lib/helpers";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import CountUp from "react-countup";
import { swap1INCH } from "./actions";
import OrderModal from "./orderModal";

interface DetailsPageProps {
  params: {
    id: string;
  };
}

// const TOKENS = {
//   "1INCH": "0x111111111117dC0aa78b770fA6A738034120C302",
//   WETH: "0x4200000000000000000000000000000000000006",
// };

// const ERC20_ABI = [
//   "function approve(address spender, uint256 amount) public returns (bool)",
//   "function allowance(address owner, address spender) public view returns (uint256)",
// ];

const DetailsPage: FC<DetailsPageProps> = ({ params }) => {
  const coinId = params.id;

  const searchParams = useSearchParams();
  const logo = searchParams?.get("logo");
  const price = Number(searchParams?.get("price")) * 15353;
  const marketCap = searchParams?.get("marketCap");
  const [orderHash, setOrderHash] = useState<string>();
  const [openModal, setOpenModal] = useState(false);

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

    setOrderHash(undefined);
    setOpenModal(true);

    const orderHash = await swap1INCH();
    console.log(orderHash);
    setOrderHash(orderHash);
  };

  const sellHandler = async () => {
    console.log("sellHandler");

    setOrderHash(undefined);
    setOpenModal(true);

    const orderHash = await swap1INCH();
    console.log(orderHash);
    setOrderHash(orderHash);
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <>
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
              className="flex-1 rounded-xl bg-[#10DC78] px-4 py-3 font-bold"
            >
              BUY
            </button>
            <button
              onClick={sellHandler}
              className="flex-1 rounded-xl bg-[#F15950] px-4 py-3 font-bold"
            >
              SELL
            </button>
          </div>
        </div>
      </AccountWrapper>

      <OrderModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        orderHash={orderHash}
      />
    </>
  );
};

export default DetailsPage;
