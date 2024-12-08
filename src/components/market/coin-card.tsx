import Link from "next/link";
import Percentage from "./percentage";

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
  return (
    <Link
      href="/details/mister-miggles"
      className="flex items-center justify-between rounded-2xl bg-neutral-600 p-2 px-3"
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
            <Percentage percentage="53.0%" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
