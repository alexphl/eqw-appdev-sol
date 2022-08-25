import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useSWR from "swr";
import fetcher from "./fetcher";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import ChartDeferred from "chartjs-plugin-deferred";

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
const StatsChart = (props: { id: number; yAxisScale: [number, any] }) => {
  Chart.register(...registerables);
  const [yMax, setYMax] = props.yAxisScale;

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
          newData[i].date = newData[i].date.substring(5, trimIndex);
        }
      }

      // If in hour view, filter by selected date
      if (url === prefs.urls.hourly) {
        newData = newData.filter(function (json: { date: string }) {
          return json.date === selectedDate;
        });

        // Generate hourly data
        let hours = [];

        // Make sure every hour has event values to have consistent scale
        for (let i = 0; i < 24; i++) {
          hours.push({ date: selectedDate, hour: `${i.toString()}:00`, events: -10 });
        }

        // Import fetch data values into our data
        for (let i = 0; i < newData.length; i++) {
          hours[newData[i].hour].events = newData[i].events;
          // Update Y scale maximum for all Events charts
          if (hours[newData[i].hour].events > yMax)
            setYMax(hours[newData[i].hour].events);
        }

        newData = hours;
      }

      setProcessedData(newData);
    }
  }, [data]);

  // Handle date click
  useEffect(() => {
    if (selectedDate && url === prefs.urls.daily) {
      setUrl(prefs.urls.hourly);
      setXAxisKey("hour");
    } else if (!selectedDate && url === prefs.urls.hourly) {
      setUrl(prefs.urls.daily);
      setXAxisKey("date");
    }
  }, [selectedDate]);

  return (
    <>
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
              borderDash: [5, 15],
              borderJoinStyle: "round",
              borderCapStyle: "round",
            },
          ],
        }}
        plugins={[ChartDeferred]}
        options={{
          onClick: function (_evt, element) {
            if (element.length > 0 && processedData) {
              setSelectedDate(processedData[element[0].index].date);
            }
          },
          onHover: (event, chartElement) => {
            // @ts-ignore
            const target = event.native ? event.native.target : event.target;
            target.style.cursor =
              chartElement[0] && url === prefs.urls.daily
                ? "pointer"
                : "default";
          },
          maintainAspectRatio: false,
          animations: {},
          parsing: {
            xAxisKey: xAxisKey,
            yAxisKey: prefs.axis.y,
          },
          elements: {
            point: {
              radius: 10,
              hitRadius: 60,
              hoverRadius: url === prefs.urls.hourly ? 10 : 15,
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
              min: 0,
              suggestedMax: yMax,
            },
            x: {
              title: {
                display: true,
                text:
                  (selectedDate &&
                    xAxisKey.charAt(0).toUpperCase() +
                      (xAxisKey + "s").slice(1) +
                      " for " +
                      selectedDate) ||
                  xAxisKey.charAt(0).toUpperCase() + (xAxisKey + "s").slice(1),
                padding: 11,
                font: {
                  size: 13.5,
                  weight: "600",
                },
              },
              grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
              offset: true,
              ticks: {
                maxTicksLimit: 14,
              },
            },
          },
        }}
      />
      <div className="w-min m-auto relative -mt-8">
        {url === prefs.urls.daily && (
          <button
            disabled
            className="-ml-16 absoulute transition-all p-2"
          ></button>
        )}
        {url === prefs.urls.hourly && (
          <button
            className="-ml-24 absoulute bg-white/[0.06] transition-all text-white p-1 rounded-full"
            onClick={() => setSelectedDate(null)}
          >
            <ArrowLeftIcon className="w-8 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

export default StatsChart;
