"use client";

import CoinCard from "@/components/market/coin-card";

const ChestPage = () => {
  return (
    <div className={`bg-[#000] min-h-screen text-white`}>
      <div className="text-center pt-5 grid place-items-center">
        <div className="font-bold">Market</div>

        <div className="text-center mt-5 mb-2">Total Assets</div>

        <div className="text-3xl font-bold">$3,291</div>

        <div className="text-center text-green-500">2.41%</div>

        <div className="flex flex-col items-center">
          <img src="/add_cash.png" className="w-[40px] h-[40px] mt-10" />
          <div className="text-center">Add Cash</div>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between pr-5 items-center">
          <b>Cash $1,200</b>
          <img src="/plus.png" className="w-[40px] h-[40px]" />
        </div>
        <p className="text-left mt-6">My coins 😎</p>

        <div className="space-y-5 px-2 mt-5">
          <CoinCard />
          <CoinCard />
          <CoinCard />
          <CoinCard />
        </div>
      </div>
    </div>
  );
};

export default ChestPage;
