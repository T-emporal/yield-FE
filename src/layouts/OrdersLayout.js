import PlaceOrderCard from "@/components/orderComponents/PlaceOrderCard";
import YieldCurveCard from "@/components/orderComponents/YieldCurveCard";
import React from "react";

function OrdersLayout() {
  return (
    <div className="flex flex-col items-center space-y-3 w-full mt-8">
      <div className="border border-[#395251] flex items-center space-x-12 pl-16  w-full bg-[#15191D] py-4">
        <div className="flex flex-col items-start">
          <span className="text-xl text-white uppercase font-light">
            Transactions
          </span>
          <span className="text-sm text-[#0ABAB5]">345,678</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xl text-white uppercase  font-light">
            Volume
          </span>
          <span className="text-sm text-[#0ABAB5]">122,690</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xl text-white uppercase  font-light">tvl</span>
          <span className="text-sm text-[#0ABAB5]">824,6969</span>
        </div>
      </div>
      <div
        className="grid space-x-3 w-full"
        style={{ gridTemplateColumns: "600px 1fr" }}
      >
        <div className="border border-[#395251]">
          <PlaceOrderCard />
        </div>
        <div className=" border border-[#395251]">
          <YieldCurveCard />
        </div>
      </div>
    </div>
  );
}

export default OrdersLayout;
