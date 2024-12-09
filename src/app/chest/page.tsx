"use client";

import AccountWrapper from "@/components/common/account-wrapper";
import { useIsLoggedIn, useUserWallets } from "@dynamic-labs/sdk-react-core";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { getRandomAirdrop } from "./actions";

const ChestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  const userWallets = useUserWallets();
  const userWallet = userWallets[0]?.address;

  const [token, setToken] = useState<{
    amount: string;
    image: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      // router.push("/login");
    }
  }, [isLoggedIn]);

  return (
    <AccountWrapper status={isLoggedIn}>
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
                  src={token?.image ?? ""}
                  className="h-[80px] w-[80px] rounded-full"
                />
                <div className="ml-2 flex flex-1 flex-col items-center space-y-2">
                  <b className="text-6xl font-extrabold text-white">
                    x{" "}
                    <CountUp
                      duration={5}
                      className="counter"
                      end={token?.value ? Number(token?.value) : 0}
                    />
                  </b>
                  <p className="text-xl font-bold text-white">
                    ($
                    <CountUp
                      duration={5}
                      className="counter"
                      end={token?.amount ? Number(token?.amount) : 0}
                    />
                    )
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
              onClick={async () => {
                if (isOpen) {
                  router.push("/?collected=true");
                  return;
                }

                setLoading(true);
                const data = await getRandomAirdrop(userWallet);

                if (data) {
                  setToken(data);
                }

                router.push("?collect=true");
                setIsOpen(true);
                confetti({
                  particleCount: 450,
                });
                setLoading(false);
              }}
              className="min-w-[200px] rounded-full bg-gradient-to-t from-[#A9D600] to-[#D5FC44] p-5 px-5 font-bold text-[#000] shadow-lg transition-all duration-300 hover:scale-105"
            >
              {loading ? "Loading..." : isOpen ? "COLLECT" : "OPEN CHEST"}
            </button>
          </div>
        </div>
      </div>
    </AccountWrapper>
  );
};

export default ChestPage;
