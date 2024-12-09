const CoinCard = () => {
  return (
    <div className="flex items-center justify-between bg-[#484D58] rounded-2xl p-2">
      <div className="flex w-full items-center">
        <img
          src="https://s2.coinmarketcap.com/static/img/coins/64x64/74.png"
          className="w-[40px] h-[40px]"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between font-bold">
            <span>$DOE</span>
            <b>$1,40</b>
          </div>

          <div className="flex justify-between">
            <span>$2.0B M.Cap</span>
            <span className="text-green-500">12,21%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
