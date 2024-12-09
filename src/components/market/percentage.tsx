import { ChevronDown, ChevronUp } from "lucide-react";

const Percentage = ({ percentage }: { percentage: string }) => {
  return (
    <>
      <p
        className={`${percentage.includes("-") ? "text-red-500" : "text-green-500"} flex items-center gap-1`}
      >
        {percentage.includes("-") ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
        {percentage}
      </p>
    </>
  );
};

export default Percentage;
