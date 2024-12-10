import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { getOrderStatus } from "./actions";

const shortenAddress = (address: string, chars = 4): null | string => {
  if (!address) {
    return null;
  }
  const parsed = address;
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(
    address.length - chars,
  )}`;
};

const OrderModal = ({
  orderHash,
  openModal,
  setOpenModal,
}: {
  orderHash?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}) => {
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    async function checkOrderStatus() {
      if (!orderHash) {
        return;
      }

      const data = await getOrderStatus(orderHash);

      if (data.status === "filled") {
        console.log("fills", data.fills);
        setTxHash(data.fills[0].txHash);
      }
    }

    const timeout = setTimeout(() => {
      checkOrderStatus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [orderHash]);

  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
      }}
    >
      <DialogContent className="max-w-sm border border-[#D5FC44] bg-black text-white">
        <div>
          {!orderHash ? (
            <>
              <div className="flex justify-center py-10 text-[#D5FC44]">
                <ImSpinner2 className="animate-spin" size={70} />
              </div>
            </>
          ) : (
            <>
              <div className="mb-5 flex justify-center">
                {!txHash ? (
                  <div className="animate-spin rounded-full p-2 text-[#D5FC44]">
                    <ImSpinner2 size={40} />
                  </div>
                ) : (
                  <div className="rounded-full p-2 text-[#D5FC44]">
                    <FaCheck size={40} />
                  </div>
                )}
              </div>

              {!txHash ? (
                <div className="text-center text-lg font-bold">
                  <span className="text-2xl">Order placed!</span>
                  <br />
                  Waiting for confirmation...
                  <br />
                  <span className="text-sm">
                    Order hash: {shortenAddress(orderHash ?? "")}
                  </span>
                </div>
              ) : (
                <div className="text-center text-lg font-bold">
                  <span className="text-2xl">Swapped!</span>
                  <br />
                  <a
                    className="mt-2 flex items-center justify-center gap-x-2 text-center text-sm underline hover:no-underline"
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View tx on BaseScan <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
