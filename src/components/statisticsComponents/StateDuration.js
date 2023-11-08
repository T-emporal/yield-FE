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
  ScatterController,
  Filler,
  PolarAreaController,
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
  ScatterController,
  PolarAreaController,
  Filler
);

const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const data = {
  fill: true,
  labels,
  datasets: [
    {
      label: "Line Dataset",
      type: "bar",
      data: [10, -20, 30, 40, 155, 23, 74, 21, 12, 66],
      backgroundColor: (item) => (item.raw < 0 ? "#FF0D09" : "#5C8733"),
      fill: true,
    },
    {
      label: "Line Dataset",
      type: "bar",
      data: [120, 20, -30, 40, 55, 23, -74, 21, -12, 66],
      backgroundColor: (item) => (item.raw < 0 ? "#FF0D09" : "#F7F9F1"),
      fill: true,
    },
    {
      fill: true,
      label: "area Dataset",
      type: "line",
      data: [140, 130, 120, 110, 100, 90, 80, 70, 60, 50],
      backgroundColor: "rgba(0, 122, 211, 0.17)",
      borderColor: "#007AD3",
    },
  ],
};
function StateDuration() {
  return <Chart type="bar" data={data} />;
}

export default StateDuration;
