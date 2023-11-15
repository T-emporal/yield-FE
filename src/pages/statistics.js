import StateDuration from "@/components/statisticsComponents/StateDuration";
import StateTotal from "@/components/statisticsComponents/StateTotal";
import DashboardLayout from "@/layouts/DashboardLayout";
import React from "react";

function statistics() {
  return (
    <DashboardLayout activePage={"Statistics"}>
      <section
        className=" xl:mt-8 2xl:mt-16  gap-4 "
        // style={{ gridTemplateColumns: "2fr 1fr" }}
      >
        {" "}
        <div
          className={`border border-[#395251] mb-4 backdrop-blur-[2px] flex items-center space-x-60 pl-4 w-full bg-[#15191ddf] py-4 opacity-0 ${
            true ? "opacity-100" : ""
          } transition-opacity duration-[700ms] ease-in-out z-10 rounded-[2px]`}
        >
          <div className="flex flex-col items-start">
            <span className="text-sm xl:text-lg text-[#f2f2f2] uppercase font-medium">
              Transactions
            </span>
            <span className="text-sm text-[#0ABAB5]">345,678</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm xl:text-lg text-[#f2f2f2] uppercase  font-medium">
              Volume
            </span>
            <span className="text-sm text-[#0ABAB5]">122,690</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm xl:text-lg text-[#f2f2f2] uppercase  font-medium">
              tvl
            </span>
            <span className="text-sm text-[#0ABAB5]">824,6969</span>
          </div>
        </div>
        <div
          className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4 rounded-[4px] backdrop-blur-[2px]   pb-20"
          style={{
            background:
              "radial-gradient(44.09% 44.09% at 50% 50%, rgba(20, 32, 36, 0.75) 0%, rgba(21, 24, 29, 0.75) 100%)",
          }}
        >
          <span className="text-[#f2f2f2] font-bold uppercase text-lg block mb-3 xl:mb-4">
            AMM - STATE DURATION
          </span>
          <StateDuration />
        </div>
        {/* <div
          className="p-4 pb-20 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4 rounded-[4px] backdrop-blur-[2px] h-[600px]"
          style={{
            background:
              "radial-gradient(44.09% 44.09% at 50% 50%, rgba(20, 32, 36, 0.75) 0%, rgba(21, 24, 29, 0.75) 100%)",
          }}
        >
          <span className="text-[#f2f2f2] font-bold uppercase text-lg block mb-3 xl:mb-4">
            AMM - STATE Total
          </span>
          <StateTotal />
        </div> */}
      </section>
    </DashboardLayout>
  );
}

export default statistics;
