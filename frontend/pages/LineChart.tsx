import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useSWR from "swr";
import fetcher from "./fetcher";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";

const LineChart = (props: { id: number; mode: string }) => {
  Chart.defaults.font.size = 13;
  Chart.defaults.font.weight = "400";
  Chart.defaults.borderColor = "rgba(220, 255, 255, 0.04)";
  Chart.defaults.color = "#d4d4d8";
  Chart.register(...registerables);

  const modes: { [key: string]: any } = {
    Events: {
      urls: {
        daily: "http://localhost:5555/events/daily",
        hourly: "http://localhost:5555/events/hourly",
      },
      axis: { x: "date", y: "events" },
    },
    Stats: {
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
  const { data } = useSWR(url, fetcher);
  const [processedData, setProcessedData]: [any, any, any] =
    useLocalStorageState("ChartData" + props.id, data);
  const [selectedDate, setSelectedDate] = useLocalStorageState(
    "ChartSelectedDate" + props.id,
    { defaultValue: null }
  );
  const [xAxisKey, setXAxisKey] = useLocalStorageState(
    "ChartXAxisKey" + props.id,
    { defaultValue: modes[props.mode].axis.x }
  );

  // Process data updates
  useEffect(() => {
    if (data) {
      var newData = data;

      // Use sane date formatting
      const trimIndex = newData[0].date.indexOf("T");
      if (props.mode === "Events" && trimIndex != -1) {
        for (var i = 0; i < data.length; i++) {
          newData[i].date = newData[i].date.substring(0, trimIndex);
        }
      }

      // If in hour view, filter by selected date
      if (url === modes[props.mode].urls.hourly) {
        newData = newData.filter(function (obj: { date: any }) {
          return obj.date === selectedDate;
        });

        // We also need hour value to be a string for Chart.js to work
        for (var i = 0; i < newData.length; i++) {
          newData[i].hour = newData[i].hour.toString();
        }
      }

      setProcessedData(newData);
    }
  }, [data]);

  useEffect(() => {
    if (selectedDate && url === modes[props.mode].urls.daily) {
      setUrl(modes[props.mode].urls.hourly);
      setXAxisKey("hour");
    }
  }, [selectedDate]);

  return (
    <Line
      data={{
        labels: [],
        datasets: [
          {
            label: "Events",
            data: processedData,
            backgroundColor: ["rgba(220, 255, 255, 0.4)"],
            borderColor: ["rgba(220, 255, 255, 0.7)"],
            borderWidth: 1.5,
            hoverBorderWidth: 2,
            borderDash: [5, 15],
            borderJoinStyle: "round",
            borderCapStyle: "round",
          },
        ],
      }}
      options={{
        onClick: function (_evt, element) {
          if (element.length > 0 && processedData) {
            setSelectedDate(processedData[element[0].index].date);
          }
        },
        animations: {},
        parsing: {
          xAxisKey: xAxisKey,
          yAxisKey: modes[props.mode].axis.y,
        },
        elements: {
          point: {
            radius: 10,
            hitRadius: 60,
            hoverRadius: 15,
          },
          line: {
            tension: 0.35,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
            beginAtZero: true,
            ticks: {
              maxTicksLimit: 6,
            },
          },
          x: {
            title: {
              display: true,
              text: xAxisKey.charAt(0).toUpperCase() + (xAxisKey + "s").slice(1), //Capitalize
              padding: 14,
              font: {
                size: 14,
                weight: "600",
              }
            },
            grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
            offset: true,
          },
        },
      }}
    />
  );
};

export default LineChart;
