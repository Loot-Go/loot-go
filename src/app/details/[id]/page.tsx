"use client";

import ChartOption from "@/components/market/chart-option";
import Percentage from "@/components/market/percentage";
import { PriceChart } from "@/components/market/price-chart";
import { formatDate } from "@/lib/helpers";
import { FC, useEffect, useState } from "react";

interface DetailsPageProps {
  params: {
    id: string;
  };
}

const DetailsPage: FC<DetailsPageProps> = ({ params }) => {
  const coinId = params.id;

  const [activeChart, setActiveChart] = useState("7d");
  const [chartValues, setChartValues] = useState([]);

  const getChartData = async () => {
    const fromTimestamp =
      new Date().getTime() -
      Number(activeChart.replace("d", "")) * 24 * 60 * 60 * 1000;
    const toTimestamp = new Date().getTime();

    const result = await fetch(
      `/api/chart?id=${coinId}&from=${fromTimestamp}&to=${toTimestamp}`,
    );

    const data = await result.json();

    console.log(data);

    setChartValues(
      data.map((price: [number, number]) => {
        return {
          date: formatDate(new Date(price[0])),
          price: price[1],
        };
      }),
    );
  };

  useEffect(() => {
    getChartData();
  }, [activeChart]);

  return (
    <div className="flex min-h-screen flex-col bg-[#000] text-white">
      <div className="my-10 grid place-items-center">
        <img
          src="https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044"
          className="h-[40px] w-[40px]"
          alt=""
        />
        <b className="mt-4 text-2xl font-bold">$3,260.62</b>
        <Percentage percentage="91%" />
      </div>

      <div className="mb-20">
        <PriceChart data={chartValues} />

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
        <button className="flex-1 rounded-xl bg-[#F15950] px-4 py-3 font-bold">
          BUY
        </button>
        <button className="flex-1 rounded-xl bg-[#10DC78] px-4 py-3 font-bold">
          SELL
        </button>
      </div>
    </div>
  );
};

export default DetailsPage;
