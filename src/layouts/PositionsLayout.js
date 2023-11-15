import Link from "next/link";
import React from "react";

function PositionsLayout({ children, activePage }) {
  return (
    <div className="w-full h-full relative">
      <div className="flex items-center space-x-6 absolute top-0 left-[300px] text-[#f2f2f2] ">
        <Link
          href={"/positions"}
          className={`${activePage == "positions" ? "text-temporal" : ""}`}
        >
          LEND/BORROW
        </Link>
        <Link
          href={"/positions/earn"}
          className={`${activePage == "earn" ? "text-temporal" : ""}`}
        >
          EARN
        </Link>
        <Link
          href={"/positions/orders"}
          className={`${activePage == "orders" ? "text-temporal" : ""}`}
        >
          ORDERS
        </Link>
      </div>
      <div className="pt-8 xl:pt-12">{children}</div>
    </div>
  );
}

export default PositionsLayout;
