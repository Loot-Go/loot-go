import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";

const getFormattedMCap = (mCap: number) => {
  return `${(mCap / 1000000).toFixed(0)}M`;
};

const CoinCard = ({
  logo = "https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044",
  symbol = "MIGGLES",
  price = 0.1377,
  marketCap = 133000000,
}: {
  logo?: string;
  symbol?: string;
  price?: number;
  marketCap?: number;
}) => {
  const priceChange24h = Math.random() * 20 - 10;

  return (
    <Link
      href={`/details/${symbol}?price=${price}&marketCap=${marketCap}&logo=${logo}`}
      className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-600 p-2 px-3"
    >
      <div className="flex w-full items-center">
        <img src={logo} className="h-[40px] w-[40px] rounded-full" alt="" />
        <div className="ml-4 flex-1">
          <div className="flex justify-between font-bold">
            <span>${symbol}</span>
            <b className="font-light">${price}</b>
          </div>

          <div className="flex justify-between">
            <span>${`${getFormattedMCap(marketCap)}`} M.Cap</span>
            <div
              className={`flex items-center ${priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {priceChange24h >= 0 ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {Math.abs(priceChange24h).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
