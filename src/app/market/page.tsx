"use client";

import CoinCard from "@/components/market/coin-card";
import Percentage from "@/components/market/percentage";

const ChestPage = () => {
  return (
    <div className={`min-h-screen bg-[#121212] text-white`}>
      <div className="grid place-items-center pt-5 text-center">
        <div className="font-bold">Market</div>

        <div className="mb-2 mt-5 text-center">Total Assets</div>

        <div className="text-3xl font-bold">$3,291</div>

        <Percentage percentage="91%" />

        <div className="flex flex-col items-center">
          <img src="/add_cash.png" className="mt-10 h-[40px] w-[40px]" alt="" />
          <div className="mt-2 text-center">Add Cash</div>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between px-2">
          <b>Cash $1,200</b>
          <img src="/plus.png" className="h-[40px] w-[40px]" alt="" />
        </div>
        <p className="mt-6 pl-2 text-left">My coins 😎</p>

        <div className="mt-5 space-y-5 px-2">
          <CoinCard />
        </div>
      </div>
    </div>
  );
};

export default ChestPage;
