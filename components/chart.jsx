import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ShowChart = ({ chartData, title, chartType }) => {
  return (
    <div>
      <Chart
        data={chartData}
        options={{
          plugins: {
            title: { display: true, text: `${title}` },
            legend: { display: true, position: "bottom" },
          },
        }}
        type={chartType}
      />
    </div>
  );
};
