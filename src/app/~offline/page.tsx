"use client";

import { Button } from "@/components/ui/button";
import { IoCloudOffline as OfflineIcon } from "react-icons/io5";

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <OfflineIcon className="text-6xl text-[white]" />
      <h1 className="mt-10 text-3xl font-semibold">You are offline</h1>
      <p className="mt-5 px-12 text-center text-lg">
        Please check your internet connection and try again.
      </p>
      <Button
        className="text-md mt-10 bg-[white] text-[#121212] hover:bg-[#f0f0f0]"
        onClick={() => {
          window.location.reload();
        }}
      >
        Retry
      </Button>
    </main>
  );
}
