import TableContainer from "@/components/portfolioComponents/TableContainer";
import DashboardLayout from "@/layouts/DashboardLayout";
import PortfolioLayout from "@/layouts/PortfolioLayout";
import React from "react";

function Earn() {
  return (
    <DashboardLayout activePage={"Portfolio"}>
      <PortfolioLayout activePage={"earn"}>
        <TableContainer
          title={"Yield"}
          data={[
            ["stINJ", "10", "11/03/2023", "21%", "1000", "", ""],
            ["stMATIC", "10", "11/03/2023", "21%", "1000", "", ""],
            ["stMATIC", "20", "11/03/2023", "21%", "1000", "", ""],
            ["stOSMO", "10", "11/03/2023", "21%", "1000", "", ""],
            // ... other rows ...
          ]}
        />
        {/* <TableContainer
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
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
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
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
              liquidate: "1000",
            },
            {
              asset: (
                <span className="flex items-center">
                  <img
                    src="/logo_matic.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  MATIC
                </span>
              ),
              duration: "10",
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
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
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
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
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
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
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
              liquidate: "1000",
            },
          ]}
        /> */}
      </PortfolioLayout>
    </DashboardLayout>
  );
}

export default Earn;
