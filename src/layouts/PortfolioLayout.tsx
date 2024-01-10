import Link from "next/link";
import React from "react";
import { LayoutProps } from '@/types/Layout';

const PortfolioLayout = ({ children, activePage }: LayoutProps) => {
  return (
    <div className="w-full h-full relative">
      <div className="flex items-center space-x-6 absolute top-0 left-[300px] text-[#f2f2f2] ">
        <Link
          href={"/portfolio"}
          className={`${activePage == "portfolio" ? "text-temporal" : ""}`}
        >
          LEND/BORROW
        </Link>
        <Link
          href={"/portfolio/earn"}
          className={`${activePage == "earn" ? "text-temporal" : ""}`}
        >
          EARN
        </Link>
        <Link
          href={"/portfolio/orders"}
          className={`${activePage == "orders" ? "text-temporal" : ""}`}
        >
          ORDERS
        </Link>
      </div>
      <div className="pt-8 xl:pt-12">{children}</div>
    </div>
  );
}

export default PortfolioLayout;
