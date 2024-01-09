import DashboardLayout from "@/layouts/DashboardLayout";
import OrdersLayout from "@/layouts/OrdersLayout";
import React from "react";

function orders() {
  return (
    <DashboardLayout activePage={"Orders/Trade"}>
      <OrdersLayout />
    </DashboardLayout>
  );
}

export default orders;
