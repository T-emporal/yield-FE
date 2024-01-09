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

import { LineChartProps } from '@/types/Components';


export const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { radius: 1, rotation: 30 } },
  plugins: {
    legend: {
      position: 'top' as const,
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
  scales: {
    x: {
      ticks: {
        color: "white",
      },
      border: {
        width: 1,
        color: 'white',
      },
      title: {
        display: true,
        text: 'DURATION',
        color: 'white',
      },
    },
    y: {
      ticks: {
        color: "white",
      },
      border: {
        width: 1,
        color: 'white',
      },
      title: {
        display: true,
        text: 'YIELD',
        color: 'white',
      },
    },
  },
  // scales: {
  //   xAxes: { ticks: { color: "white" } },
  //   yAxes: { ticks: { color: "white" } },
  // },
};

const labels = [0, 2, 4, 6, 8, 10, 12];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [20, 50, 100, 20, 40, 23, 44],
      borderColor: "#0EE29B",
      backgroundColor: "#0EE29B99",
    },
  ],
};

function LineChart({ lineColor }: LineChartProps) {
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

function YieldCurveCard({ lineColor }: LineChartProps) {
  return (
    <div className=" h-full bg-gray-700/20  backdrop-blur-[4px] rounded-xl p-6">
      <span className="text-lg font-bold text-[#f2f2f2] uppercase">
        Yield Curve
      </span>
      <LineChart lineColor={lineColor} />
    </div>
  );
}

export default YieldCurveCard;
