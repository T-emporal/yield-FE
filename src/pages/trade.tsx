import DashboardLayout from "@/layouts/DashboardLayout";
import TradeLayout from "@/layouts/TradeLayout";
import React from "react";

function orders() {
  return (
    <DashboardLayout activePage={"Trade"}>
      <TradeLayout />
    </DashboardLayout>
  );
}

export default orders;
