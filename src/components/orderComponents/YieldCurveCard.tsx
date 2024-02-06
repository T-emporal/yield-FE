import React, { useState } from "react";
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

const baseOptions = {
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
  },
};

interface YieldCurveCardProps {
  lineColor: string;
  data?: {
    yieldData?: Array<number>;
    principalData?: Array<number>;
  };
}

const createDataset = (label: string, data: Array<number>, lineColor: string) => ({
  label,
  data,
  borderColor: lineColor,
  backgroundColor: `${lineColor}99`,
});

const YieldCurveCard: React.FC<YieldCurveCardProps> = ({ lineColor, data }) => {
  const [activeDataset, setActiveDataset] = useState<'yield' | 'principal'>('yield');

  const labels = [0, 2, 4, 6, 8, 10, 12];
  const defaultYieldData = [20, 50, 90, 20, 40, 23, 44];
  const defaultPrincipalData = [40, 10, 50, 70, 35, 25, 40];

  const yieldData = data?.yieldData ? createDataset("Yield Dataset", data.yieldData, lineColor) : createDataset("Default Yield Dataset", defaultYieldData, lineColor);
  const principalData = data?.principalData ? createDataset("Principal Dataset", data.principalData, lineColor) : createDataset("Default Principal Dataset", defaultPrincipalData, lineColor);

  const toggleDataset = () => {
    setActiveDataset(activeDataset === 'yield' ? 'principal' : 'yield');
  };

  const chartData = {
    labels,
    datasets: [activeDataset === 'yield' ? yieldData : principalData],
  };

  // Dynamically adjust options based on activeDataset
  const options = {
    ...baseOptions,
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
          text: activeDataset.toUpperCase(),
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="relative h-full bg-gray-700/20 backdrop-blur-[4px] rounded-xl p-6">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 m-4 flex">
        <button
          className={`text-sm w-24 border border-r-0 border-temporal px-4 py-2 transition rounded-l-lg duration-500 ease-in-out ${activeDataset === 'yield' ? 'bg-temporal50 text-white' : 'bg-teal-900/30 text-gray-400'} `}
          onClick={toggleDataset}
          disabled={activeDataset === 'yield'}
        >
          YIELD
        </button>
        <button
          className={`text-sm w-24 border border-l-0 border-temporal px-4 py-2 transition rounded-r-lg duration-500 ease-in-out ${activeDataset === 'principal' ? 'bg-temporal50 text-white' : 'bg-teal-900/30 text-gray-400'} `}
          onClick={toggleDataset}
          disabled={activeDataset === 'principal'}
        >
          PRINCIPAL
        </button>
      </div>

      <Line options={options} data={chartData} className="h-[400px] mt-10 xl:h-[450px] w-full" />
    </div>
  );
};

export default YieldCurveCard;
