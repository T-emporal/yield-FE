import StateDuration from "@/components/statisticsComponents/StateDuration";
import StateTotal from "@/components/statisticsComponents/StateTotal";
import DashboardLayout from "@/layouts/DashboardLayout";
import React from "react";

function statistics() {
  return (
    <DashboardLayout activePage={"Statistics"}>
      <section
        className="grid max-h-[450px] xl:mt-8 2xl:mt-20  gap-4"
        style={{ gridTemplateColumns: "2fr 1fr" }}
      >
        <div
          className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4 rounded-[4px] backdrop-blur-[2px]"
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
        <div
          className="p-4 xl:p-6 flex flex-col items-start  border border-[#395251ee] mb-3 xl:mb-4 rounded-[4px] backdrop-blur-[2px]"
          style={{
            background:
              "radial-gradient(44.09% 44.09% at 50% 50%, rgba(20, 32, 36, 0.75) 0%, rgba(21, 24, 29, 0.75) 100%)",
          }}
        >
          <span className="text-[#f2f2f2] font-bold uppercase text-lg block mb-3 xl:mb-4">
            AMM - STATE Total
          </span>
          <StateTotal />
        </div>
      </section>
    </DashboardLayout>
  );
}

export default statistics;
