"use client";

import DynamicProvider from "@/providers/DynamicProvider";
import { usePathname, useSearchParams } from "next/navigation";
import Footer from "./footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const collected = searchParams.get("collect");

  return (
    <DynamicProvider>
      <section
        className={` ${collected ? "bg-[#FF9900]" : ""} ${pathname === "/chest" && !collected ? "bg-[#EAA928]" : ""} bg-[#121212] text-white`}
      >
        <main className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#000] pb-[calc(78px+env(safe-area-inset-bottom))] shadow shadow-white">
          {children}
        </main>
        <Footer />
      </section>
    </DynamicProvider>
  );
}
