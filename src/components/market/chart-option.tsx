const ChartOption = ({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`cursor-pointer rounded-md px-3 py-1 ${
        active ? "bg-[#D5FC44] text-[#000000]" : "text-[#8D9096]"
      }`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default ChartOption;
