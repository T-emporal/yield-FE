import DashboardLayout from "@/layouts/DashboardLayout";
import OrdersLayout from "@/layouts/OrdersLayout";
import React from "react";

function orders() {
  return (
    <DashboardLayout activePage={"Orders"}>
      <OrdersLayout />
    </DashboardLayout>
  );
}

export default orders;
