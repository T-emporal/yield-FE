import TableContainer from "@/components/positionsComponents/TableContainer";
import DashboardLayout from "@/layouts/DashboardLayout";
import PositionsLayout from "@/layouts/PositionsLayout";
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

function Orders() {
  return (
    <DashboardLayout activePage={"Positions"}>
      <PositionsLayout activePage={"orders"}>
        {" "}
        <TableContainer
          title={"Outstanding orders"}
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
              type: "Lend",
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              "Edit/Cancel Order": (
                <div className="flex items-center space-x-3">
                  <PencilSquareIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                  <XCircleIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                </div>
              ),
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
              type: "Lend",
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              "Edit/Cancel Order": (
                <div className="flex items-center space-x-3">
                  <PencilSquareIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                  <XCircleIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                </div>
              ),
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
              type: "Lend",
              duration: "10",
              maturity: "10/10/2024",
              yield: "21%",
              principal: "1000",
              "Edit/Cancel Order": (
                <div className="flex items-center space-x-3">
                  <PencilSquareIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                  <XCircleIcon className="w-5 h-5 text-[#f2f2f2] cursor-pointer" />
                </div>
              ),
            },
          ]}
        />
      </PositionsLayout>
    </DashboardLayout>
  );
}

export default Orders;
