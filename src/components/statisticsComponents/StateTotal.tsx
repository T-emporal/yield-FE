import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,

  Filler
);

const labels = [1];
export const data = {
  fill: true,
  labels,
  datasets: [
    {
      label: "Line Dataset",
      type: "bar",
      data: [10],
      backgroundColor: (item:any) =>
        item.raw < 0 ? "#FF0D09" : "rgba(0, 122, 211, 0.17)",
      fill: true,
    },
    {
      label: "Line Dataset",
      type: "bar",
      data: [60],
      backgroundColor: (item:any) => (item.raw < 0 ? "#FF0D09" : "#5C8733"),
      fill: true,
    },
    {
      label: "Line Dataset",
      type: "bar",
      data: [-20],
      backgroundColor: (item:any) => (item.raw < 0 ? "#FF0D09" : "#5C8733"),
      fill: true,
    },
    {
      label: "Line Dataset",
      type: "bar",
      data: [40],
      backgroundColor: (item:any) => (item.raw < 0 ? "#FF0D09" : "#F7F9F1"),
      fill: true,
    },
  ],
};
function StateTotal() {
  // return (
  //   <Chart
  //     type="bar"
  //     options={{ maintainAspectRatio: false }}
  //     data={data}
  //     className="h-full w-full"
  //   />
  // );
}

export default StateTotal;
