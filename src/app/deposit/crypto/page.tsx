"use client";

import { useUserWallets } from "@/lib/dynamic";
import { ArrowLeftIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { QRCode } from "react-qrcode-logo";
import { toast } from "sonner";

const DepositPage = () => {
  const userWallets = useUserWallets();
  const userWallet = userWallets[0]?.address;

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <div className="relative flex items-center justify-center">
        <Link href="/market" className="absolute left-5 top-6">
          <ArrowLeftIcon className="h-4 w-4 cursor-pointer" />
        </Link>
        <div className="pt-5 text-center font-bold">Deposit</div>
      </div>
      <div className="grid min-h-screen place-items-center pt-5 text-center">
        {userWallet ? (
          <div>
            <p className="text-xl">Send USDC on Base</p>
            <section className="mt-5 flex justify-center">
              <div className="w-min rounded-2xl bg-white p-4">
                <QRCode
                  value={userWallet ?? ""}
                  logoImage="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                  logoWidth={32}
                  logoHeight={32}
                  logoPadding={3}
                />
              </div>
            </section>

            <div className="mt-5 flex flex-col items-center justify-between">
              <p>Wallet address (Base)</p>
              <p className="mt-2 flex items-center gap-2 text-xs">
                {userWallet ?? ""}
                <CopyToClipboard
                  text={userWallet}
                  onCopy={() => {
                    toast.success("Copied to clipboard");
                  }}
                >
                  <CopyIcon className="h-4 w-4 cursor-pointer" />
                </CopyToClipboard>
              </p>
            </div>
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
