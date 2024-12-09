"use client";

import { CopyIcon } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { QRCode } from "react-qrcode-logo";
import { toast } from "sonner";

const DepositPage = () => {
  return (
    <div className="min-h-screen bg-[#000] text-white">
      <div className="pt-5 text-center font-bold">Deposit</div>
      <div className="grid min-h-screen place-items-center pt-5 text-center">
        <div>
          <p className="text-xl">Send USDC on Base</p>
          <section className="mt-5 flex justify-center">
            <div className="w-min rounded-2xl bg-white p-4">
              <QRCode
                value="https://github.com/gcoro/react-qrcode-logo"
                logoImage="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                logoWidth={32}
                logoHeight={32}
                logoPadding={3}
              />
            </div>
          </section>

          <div className="mt-5 flex flex-col items-center justify-between">
            <p>Wallet address (Base)</p>
            <p className="flex items-center gap-2">
              0x1234567890123456789012345678901234567890
              <CopyToClipboard
                text={`0x`}
                onCopy={() => {
                  toast.success("Copied to clipboard");
                }}
              >
                <CopyIcon />
              </CopyToClipboard>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
