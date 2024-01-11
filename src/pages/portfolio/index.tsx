import TableContainer from "@/components/portfolioComponents/TableContainer";
import DashboardLayout from "@/layouts/DashboardLayout";
import PortfolioLayout from "@/layouts/PortfolioLayout";
import React from "react";

function positions() {
  return (
    <DashboardLayout activePage={"Portfolio"}>
      <PortfolioLayout activePage={"portfolio"}>
        <TableContainer
          title={"Yield"}
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
                    src="/logo_atom.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  ATOM
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
                    src="/logo_atom.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  ATOM
                </span>
              ),
              duration: "10",
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
              liquidate: "1000",
            },
          ]}
        />
        <TableContainer
          title={"Principal"}
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
                    src="/logo_osmo.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  OSMO
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
                    src="/logo_usdt.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  USDT
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
                    src="/logo_usdt.svg"
                    alt=""
                    className="w-4 h-4 mr-2"
                  />{" "}
                  USDT
                </span>
              ),
              duration: "10",
              maturity: "11/03/2023",
              apy: "21%",
              units: "1000",
              liquidate: "1000",
            },
          ]}
        />
      </PortfolioLayout>
    </DashboardLayout>
  );
}

export default positions;
