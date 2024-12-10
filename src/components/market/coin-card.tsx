import { ArrowDown, ArrowUp } from "lucide-react";

// const getFormattedMCap = (mCap: number) => {
//   return `${(mCap / 1000000).toFixed(0)}M`;
// };

const CoinCard = ({
  logo,
  symbol,
  amount,
  price,
}: {
  logo?: string;
  symbol?: string;
  amount?: number;
  price?: number;
}) => {
  const priceChange24h = Math.random() * 20 - 10;

  return (
    <div className="flex w-full items-center">
      <img src={logo} className="h-[40px] w-[40px] rounded-full" alt="" />
      <div className="ml-4 flex-1">
        <div className="flex justify-between font-bold">
          <span>{symbol}</span>
          <b className="font-light">
            {price} ${symbol}
          </b>
        </div>

        <div className="flex justify-between">
          <span>{symbol === "Bonk" ? "1 USD" : amount}</span>
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
  );
};

export default CoinCard;
