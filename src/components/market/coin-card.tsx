import Link from "next/link";
import Percentage from "./percentage";

const CoinCard = () => {
  return (
    <Link
      href="/details/mister-miggles"
      className="flex items-center justify-between rounded-2xl bg-[#484D58] p-2"
    >
      <div className="flex w-full items-center">
        <img
          src="https://assets.coingecko.com/coins/images/39251/standard/miggles.jpg?1721283044"
          className="h-[40px] w-[40px]"
          alt=""
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between font-bold">
            <span>$MIGGLES</span>
            <b>$0.1377</b>
          </div>

          <div className="flex justify-between">
            <span>$133M M.Cap</span>
            <Percentage percentage="53.0%" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
