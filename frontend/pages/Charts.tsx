import useSWR from "swr";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const Charts = () => {
  const fetcher = (url: RequestInfo | URL | string) =>
    fetch(url).then((r) => r.json());
  const { data, error } = useSWR("http://localhost:5555/events/daily", fetcher);

  if (error) return <div>failed to load</div>;
  console.log(data);

  Chart.register(...registerables);

  return (
    <div>
      <Bar
        data={{
          labels: [],
          datasets: [
            {
              label: "TESTING",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)",
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(153, 102, 255, 0.7)",
                "rgba(255, 159, 64, 0.7)",
              ],
            },
          ],
        }}
        options={{
          parsing: {
            xAxisKey: "date",
            yAxisKey: "events",
          },
        }}
      />
    </div>
  );
};

export default Charts;
