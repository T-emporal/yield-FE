import TableContainer from "@/components/positionsComponents/TableContainer";
import DashboardLayout from "@/layouts/DashboardLayout";
import PortfolioLayout from "@/layouts/PortfolioLayout";
import React from "react";

function Earn() {
  return (
    <DashboardLayout activePage={"Portfolio"}>
      <PortfolioLayout activePage={"earn"}>
        {" "}
        <TableContainer
          title={"Earn"}
          data={[
            {
              asset: (
                <span className="flex items-center">
                  <img
                    src="/logo_injective.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  INJ
                </span>
              ),
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              liquidate: "1000",
            },
            {
              asset: (
                <span className="flex items-center">
                  <img
                    src="/logo_injective.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  INJ
                </span>
              ),
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              liquidate: "1000",
            },
            {
              asset: (
                <span className="flex items-center">
                  <img
                    src="/logo_injective.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  INJ
                </span>
              ),
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              liquidate: "1000",
            },
          ]}
        />
      </PortfolioLayout>
    </DashboardLayout>
  );
}

export default Earn;
