import DashboardLayout from "@/layouts/DashboardLayout";
import TradeLayout from "@/layouts/TradeLayout";
import React from "react";

function orders() {
  return (
    <DashboardLayout activePage={"Transact"}>
      <TradeLayout />
    </DashboardLayout>
  );
}

export default orders;
