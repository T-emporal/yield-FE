import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { radius: 1, rotation: 30 } },
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
    },
    customCanvasBackgroundColor: {
      color: "transparent",
      display: false,
    },
  },
  // scales: {
  //   xAxes: { ticks: { color: "white" } },
  //   yAxes: { ticks: { color: "white" } },
  // },
};

const labels = [0, 2, 4, 6, 8, 10, 12];

function LineChart({ lineColor }) {
  return (
    <div className="  p-6">
      <Line
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: "Dataset 1",
              data: [3.0, 3.05, 3.05, 3.1, 3.2, 3.15, 3.3],
              borderColor: lineColor,
              backgroundColor: "#0EE29B99",
            },
          ],
        }}
        // height={"450px"}
        className="h-[400px] xl:h-[450px] !w-full"
      />
    </div>
  );
}

export default LineChart;
