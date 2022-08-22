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
  const [processedData, setProcessedData] = useLocalStorageState("ChartData" + props.id, data);
  const [selectedDate, setSelectedDate] = useLocalStorageState(
    "ChartSelectedDate" + props.id,
    { defaultValue: null }
  );
  const [xAxisKey, setXAxisKey] = useLocalStorageState(
    "ChartXAxisKey" + props.id,
    { defaultValue: modes[props.mode].axis.x }
  );

  useEffect(() => {
    if (data) {
      var newData = data;
      const trimIndex = newData[0].date.indexOf("T");

      if (props.mode === "events" && trimIndex != -1) {
        for (var i = 0; i < data.length; i++) {
          newData[i].date = newData[i].date.substring(0, trimIndex);
        }
      }

      // If in hour view, filter by selected date
      if (url === modes[props.mode].urls.hourly) {
        for (var i = 0; i < data.length; i++) {
          newData[i].hour = newData[i].hour.toString();
        }

        newData = newData.filter(function (obj: { date: any }) {
          return obj.date === selectedDate;
        });
      }

      setProcessedData(newData);
    }
  }, [data]);

  useEffect(() => {
    if (selectedDate && url === modes[props.mode].urls.daily) {
      console.log("Selected date " + selectedDate);
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
            borderWidth: 1,
            borderDash: [5, 10],
          },
        ],
      }}
      options={{
        onClick: function (_evt, element) {
          if (element.length > 0) {
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
