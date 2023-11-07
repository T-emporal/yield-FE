import PlaceOrderCard from "@/components/orderComponents/PlaceOrderCard";
import YieldCurveCard from "@/components/orderComponents/YieldCurveCard";
import React, { useState } from "react";

function OrdersLayout() {
  const [move, setMove] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [yieldGraphOpen, setYieldGraphOpen] = useState(false);
  const handleClick = () => {
    setMove(!move);
    setFadeIn(!fadeIn);
    setYieldGraphOpen(!yieldGraphOpen);
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full xl:mt-8 2xl:mt-20 ">
      <div
        className={`border border-[#395251] backdrop-blur-[2px] flex items-center space-x-60 pl-16  w-full bg-[#15191ddf] py-4 opacity-0 ${
          fadeIn ? "opacity-100" : ""
        } transition-opacity duration-[700ms] ease-in-out z-10`}
      >
        <div className="flex flex-col items-start">
          <span className="text-md xl:text-xl text-[#f2f2f2] uppercase font-medium">
            Transactions
          </span>
          <span className="text-sm text-[#0ABAB5]">345,678</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-md xl:text-xl text-[#f2f2f2] uppercase  font-medium">
            Volume
          </span>
          <span className="text-sm text-[#0ABAB5]">122,690</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-md xl:text-xl text-[#f2f2f2] uppercase  font-medium">
            tvl
          </span>
          <span className="text-sm text-[#0ABAB5]">824,6969</span>
        </div>
      </div>
      <div
        className="grid space-x-3 w-full"
        style={{ gridTemplateColumns: "600px 1fr" }}
      >
        <div
          className={`border border-[#395251] transform ${
            move ? "translate-x-0" : "translate-x-[calc(50vw-350px)]"
          } transition-transform duration-[700ms] ease-in-out z-20`}
        >
          <PlaceOrderCard
            handleClick={handleClick}
            yieldGraphOpen={yieldGraphOpen}
          />
        </div>
        <div
          className={`border border-[#395251] opacity-0 ${
            fadeIn ? "opacity-100" : ""
          } transition-opacity duration-[700ms] ease-in-out z-10`}
        >
          <YieldCurveCard />
        </div>
      </div>
    </div>
  );
}

export default OrdersLayout;
