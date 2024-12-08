"use client";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CountUp from "react-countup";

const ChestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`${
        isOpen
          ? "bg-[#FF9900]"
          : "bg-gradient-to-r from-[#EAA928] via-[#FAD96B] to-[#E7A218]"
      }`}
    >
      <div className="grid h-full min-h-screen place-items-center items-center">
        <div className="flex flex-col items-center space-y-20">
          {isOpen ? (
            <div className="flex">
              <img
                src="https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044"
                className="h-[80px] w-[80px] rounded-full"
              />
              <div className="ml-2 flex flex-1 flex-col items-center space-y-2">
                <b className="text-6xl font-extrabold text-white">
                  x <CountUp duration={5} className="counter" end={13000} />
                </b>
                <p className="text-xl font-bold text-white">
                  ($
                  <CountUp duration={5} className="counter" end={1790.035} />)
                </p>
              </div>
            </div>
          ) : null}
          <img
            src={isOpen ? "/chest_open.png" : "/chest.png"}
            alt="chest"
            className="h-[250px] w-[250px]"
          />

          <button
            onClick={() => {
              if (isOpen) {
                router.push("/?collected=true");
                return;
              }

              router.push("?collect=true");
              setIsOpen(true);
              confetti({
                particleCount: 450,
              });
            }}
            className="min-w-[200px] rounded-full bg-gradient-to-t from-[#A9D600] to-[#D5FC44] p-5 px-5 font-bold text-[#000] shadow-lg transition-all duration-300 hover:scale-105"
          >
            {isOpen ? "COLLECT" : "OPEN CHEST"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChestPage;
