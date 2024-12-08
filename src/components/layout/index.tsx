"use client";

import DynamicProvider from "@/providers/DynamicProvider";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { usePathname, useSearchParams } from "next/navigation";
import { Toaster } from "sonner";
import { base } from "viem/chains";
import Footer from "./footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const collected = searchParams.get("collect");

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
      chain={base}
    >
      <DynamicProvider>
        <section
          className={` ${collected ? "bg-[#FF9900]" : ""} ${pathname === "/chest" && !collected ? "bg-[#EAA928]" : ""} bg-[#121212] text-white`}
        >
          <main className="mx-auto flex min-h-[100svh] max-w-md flex-col pb-[calc(78px+env(safe-area-inset-bottom))]">
            {children}
          </main>

          {!["/chest", "/login"].includes(pathname) && <Footer />}

          <Toaster position="top-center" />
        </section>
      </DynamicProvider>
    </OnchainKitProvider>
  );
}
