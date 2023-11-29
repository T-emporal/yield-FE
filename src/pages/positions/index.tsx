import TableContainer from "@/components/positionsComponents/TableContainer";
import DashboardLayout from "@/layouts/DashboardLayout";
import PositionsLayout from "@/layouts/PositionsLayout";
import React from "react";

function positions() {
  return (
    <DashboardLayout activePage={"Positions"}>
      <PositionsLayout activePage={"positions"}>
        <TableContainer
          title={"Lend"}
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
        <TableContainer
          title={"Borrow"}
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
              "Collat. Assets": "LEND",
              "Collat. Quant.": "LEND",
              "Collateral %": "LEND",
              "Dip/Wit Collat.": "LEND",
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
              "Collat. Assets": "LEND",
              "Collat. Quant.": "LEND",
              "Collateral %": "LEND",
              "Dip/Wit Collat.": "LEND",
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
              "Collat. Assets": "LEND",
              "Collat. Quant.": "LEND",
              "Collateral %": "LEND",
              "Dip/Wit Collat.": "LEND",
            },
          ]}
        />
      </PositionsLayout>
    </DashboardLayout>
  );
}

export default positions;
