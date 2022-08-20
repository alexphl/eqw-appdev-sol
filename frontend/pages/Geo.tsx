import useSWR from "swr";
import fetcher from "./fetcher";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

/**
 * Chart visualizations panel
 **/
const Geo = () => {
  const { data, error } = useSWR("http://localhost:5555/events/hourly", fetcher);

  // Shows old data if refresh fails
  if (error && !data)
    return (
      <div>
        Contents failed to load :( <p> Retrying... </p>
      </div>
    );

  Chart.register(...registerables);

  return (
    <div className="m-auto">
      <Bar
        data={{
          labels: [],
          datasets: [
            {
              label: "TESTING",
              data: data,
              backgroundColor: ["rgba(220, 255, 255, 0.2)"],
              borderColor: ["rgba(220, 255, 255, 0.6)"],
              borderWidth: 1,
              barThickness: 5,
              borderRadius: 5,
            },
          ],
        }}
        options={{
          parsing: {
            xAxisKey: "date",
            yAxisKey: "events",
          },
          plugins: {
            legend: {
              position: "top",
              align: "center",
              labels: {
                boxWidth: 20,
                usePointStyle: false,
              },
              title: {
                text: "Daily events",
                display: false,
                color: "white",
                font: {
                  size: 10,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Geo;
