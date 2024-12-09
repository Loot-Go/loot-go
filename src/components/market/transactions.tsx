import { MdArrowOutward } from "react-icons/md";

const Transaction = ({
  transactionPosition,
  transactionType,
  status,
  fee,
}: {
  transactionPosition: string;
  transactionType: string;
  status: string;
  fee: number;
}) => {
  return (
    <div className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-600 p-2 px-3">
      <div className="flex w-full items-center">
        <div className="rounded-full border border-gray-700 bg-neutral-700 p-2">
          {transactionPosition === "out" && (
            <MdArrowOutward className="h-7 w-7" />
          )}
          {transactionPosition === "in" && (
            <MdArrowOutward className="h-7 w-7 rotate-180" />
          )}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between font-bold">
            <span>{transactionType}</span>
            <b className="font-light">{fee} Wei</b>
          </div>

          <div className="flex justify-between">
            <span
              className={`${status === "completed" ? "text-green-500" : "text-red-500"}`}
            >
              {status.slice(0, 1).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
