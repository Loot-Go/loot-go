"use client";

import Swap from "@/components/app/jupiter-trade";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// const shortenAddress = (address: string, chars = 4): null | string => {
//   if (!address) {
//     return null;
//   }
//   const parsed = address;
//   return `${parsed.substring(0, chars + 2)}...${parsed.substring(
//     address.length - chars,
//   )}`;
// };

const OrderModal = ({
  openModal,
  setOpenModal,
  mode,
  coin,
}: {
  orderHash?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  mode: string;
  coin: string;
}) => {
  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
      }}
    >
      <DialogContent className="max-w-sm border border-[#D5FC44] bg-black text-white">
        <div>
          <Swap mode={mode} coin={coin} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
