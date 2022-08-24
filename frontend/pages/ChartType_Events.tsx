import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useSWR from "swr";
import fetcher from "./fetcher";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";

// Chart constants
const prefs: { [key: string]: any } = {
  urls: {
    daily: "http://localhost:5555/events/daily",
    hourly: "http://localhost:5555/events/hourly",
  },
  axis: { x: "date", y: "events" },
};

/**
 * Chart for plotting events
 **/
const EventsChart = (props: { id: number }) => {
  Chart.register(...registerables);

  const [url, setUrl] = useLocalStorageState("ChartURL:" + props.id, {
    defaultValue: prefs.urls.daily,
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
    { defaultValue: prefs.axis.x }
  );

  // Process data updates
  useEffect(() => {
    if (data) {
      var newData = data;

      // Use sane date formatting
      const trimIndex = newData[0].date.indexOf("T");
      if (trimIndex != -1) {
        for (var i = 0; i < data.length; i++) {
          newData[i].date = newData[i].date.substring(0, trimIndex);
        }
      }

      // If in hour view, filter by selected date
      if (url === prefs.urls.hourly) {
        newData = newData.filter(function (json: { date: string }) {
          return json.date === selectedDate;
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
    if (selectedDate && url === prefs.urls.daily) {
      setUrl(prefs.urls.hourly);
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
          yAxisKey: prefs.axis.y,
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
              text:
                xAxisKey.charAt(0).toUpperCase() + (xAxisKey + "s").slice(1), //Capitalize
              padding: 14,
              font: {
                size: 14,
                weight: "600",
              },
            },
            grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
            offset: true,
          },
        },
      }}
    />
  );
};

export default EventsChart;
