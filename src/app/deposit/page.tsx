"use client";

import { useUserWallets } from "@/lib/dynamic";
import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DepositPage = () => {
  const userWallets = useUserWallets();
  const [amount, setAmount] = useState(20);
  const projectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID!;
  const userWallet = userWallets[0]?.address;

  const onrampBuyUrl = userWallet
    ? getOnrampBuyUrl({
        projectId,
        addresses: { [userWallet]: ["base"] },
        assets: ["USDC"],
        presetFiatAmount: amount,
        fiatCurrency: "USD",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <div className="relative flex items-center justify-center">
        <Link href="/market" className="absolute left-5 top-6">
          <ArrowLeftIcon className="h-4 w-4 cursor-pointer" />
        </Link>
        <div className="pt-5 text-center font-bold">Deposit</div>
      </div>
      <div className="grid min-h-screen place-items-center pt-5 text-center">
        {userWallets[0]?.address ? (
          <div>
            <div className="mb-24 flex items-center justify-center text-6xl">
              $
              <input
                type="number"
                value={amount}
                placeholder="100"
                className="w-[150px] bg-transparent p-2 text-white focus:outline-none"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <section className="mt-5 flex justify-center">
              {onrampBuyUrl && (
                <FundButton
                  fundingUrl={onrampBuyUrl}
                  text="Buy"
                  hideIcon
                  className="ramp_button min-w-[200px] rounded-full bg-gradient-to-t from-[#A9D600] to-[#D5FC44] font-bold shadow-lg transition-all duration-300 hover:scale-105"
                />
              )}
            </section>

            <Link href="/deposit/crypto" passHref>
              <div className="mt-5 text-center text-gray-300">
                Fund with crypto
              </div>
            </Link>
          </div>
        ) : (
          <>
            <div>Loading...</div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
