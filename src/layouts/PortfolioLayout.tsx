import Link from "next/link";
import React from "react";
import { LayoutProps } from '@/types/Layout';

const PortfolioLayout = ({ children, activePage }: LayoutProps) => {
  return (
    <div className="w-full h-full relative">
      <div className="flex w-full items-center justify-center space-x-6 absolute top-0 text-xl text-[#f2f2f2]">
        <Link
          href={"/portfolio"}
          className={`${activePage == "portfolio" ? "text-temporal" : ""}`}
        >
          TOKENS
        </Link>
        <Link
          href={"/portfolio/earn"}
          className={`${activePage == "earn" ? "text-temporal" : ""}`}
        >
          EARN
        </Link>
      </div>
      <div className="pt-12 xl:pt-16 ">{children}</div>
    </div>
  );
}

export default PortfolioLayout;
