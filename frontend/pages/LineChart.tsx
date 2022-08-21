import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useSWR from "swr";
import fetcher from "./fetcher";
import useLocalStorageState from "use-local-storage-state";
import { useEffect, useState } from "react";

const LineChart = (props: { id: number; mode: string }) => {
  Chart.register(...registerables);

  const modes: { [key: string]: any } = {
    events: {
      urls: {
        daily: "http://localhost:5555/events/daily",
        hourly: "http://localhost:5555/events/hourly",
      },
      axis: { x: "date", y: "events" },
    },
    stats: {
      urls: {
        daily: "http://localhost:5555/stats/daily",
        hourly: "http://localhost:5555/stats/hourly",
      },
      axis: { x: "date", y: "events" },
    },
  };

  const [url, setUrl] = useLocalStorageState("ChartURL:" + props.id, {
    defaultValue: modes[props.mode].urls.daily,
  });
  const { data, error } = useSWR(url, fetcher);
  const [processedData, setProcessedData] = useState(data);

  useEffect(() => {
    var newData = data;
    if (newData && url === modes[props.mode].urls.daily && newData[0].date.indexOf("T") != -1) {
      for (var i = 0; i < data.length; i++) {
        newData[i].date = newData[i].date.substring(
          0,
          newData[i].date.indexOf("T")
        );
      }
      console.log(newData);
      setProcessedData(newData);
    } else {
      setProcessedData(data);
    }
  }, [data]);

  return (
    <Line
      data={{
        labels: [],
        datasets: [
          {
            label: "Events",
            data: processedData,
            backgroundColor: ["rgba(220, 255, 255, 0.2)"],
            borderColor: ["rgba(220, 255, 255, 0.6)"],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        onClick: function (_evt, element) {
          if (element.length > 0) {
            //console.log(element[0].index);
            setUrl(modes[props.mode].urls.hourly);
          }
        },
        animations: {},
        parsing: {
          xAxisKey: modes[props.mode].axis.x,
          yAxisKey: modes[props.mode].axis.y,
        },
        elements: {
          point: {
            radius: 8,
            hitRadius: 50,
            hoverRadius: 10,
          },
          line: {
            tension: 0.3,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default LineChart;
