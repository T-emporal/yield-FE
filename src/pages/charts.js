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
  ScatterController
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Line Dataset",
      type: "line",
      data: [10, 20, 30, 40],
      borderColor: "rgba(75,192,192,1)",
      fill: false,
    },
    {
      label: "Scatter Dataset",
      type: "scatter",
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 25 },
        { x: 3, y: 35 },
        { x: 4, y: 40 },
      ],
      backgroundColor: "rgba(255,99,132,1)",
    },
  ],
};

function App() {
  return <Chart type="bar" data={data} />;
}
export default App;
