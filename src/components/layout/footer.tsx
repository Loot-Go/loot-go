"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaWallet } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

interface MenuBtnProps {
  type: "map" | "market" | "portfolio";
}

const MenuBtn: React.FC<MenuBtnProps> = ({ type }) => {
  const pathname = usePathname();

  const isActive =
    (pathname === "/" && type === "map") || pathname.includes(type);
  const linkPath = type === "map" ? "/" : `/${type}`;

  return (
    <Link href={linkPath}>
      <div
        className={`${isActive ? "text-[#D5FC44]" : "text-[#B3B4B8]"} flex flex-col items-center gap-y-1`}
      >
        {type === "map" ? <FaLocationDot size={26} /> : null}
        {type === "market" ? <FaChartLine size={26} /> : null}
        {type === "portfolio" ? <FaWallet size={26} /> : null}

        <div className={`text-sm font-bold`}>
          {type === "map" ? "Map" : null}
          {type === "market" ? "Market" : null}
          {type === "portfolio" ? "Portfolio" : null}
        </div>
      </div>
    </Link>
  );
};

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full">
      <div className="mx-auto flex w-full max-w-md justify-evenly rounded-t-[30px] bg-black pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-4">
        <MenuBtn type="map" />
        <MenuBtn type="market" />
        {/* <MenuBtn type="portfolio" /> */}
      </div>
    </footer>
  );
}
