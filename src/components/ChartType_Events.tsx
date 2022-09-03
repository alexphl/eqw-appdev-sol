import { Line } from "react-chartjs-2";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import ChartDeferred from "chartjs-plugin-deferred";
import { trpc } from "../utils/trpc";
import React from "react";

// Chart constants
const prefs: { [key: string]: any } = {
  urls: {
    daily: "eventsRouter.daily.getDailyEvents",
    hourly: "eventsRouter.hourly.getHourlyEvents",
  },
};

/**
 * Chart for plotting events
 **/
const EventsChart = (props: { id: number; yAxisScale: [number, any] }) => {
  const [yMax, setYMax] = props.yAxisScale;

  const [url, setUrl] = useLocalStorageState("ChartURL:" + props.id, {
    defaultValue: prefs.urls.daily,
  });

  const { data, isSuccess } = trpc.useQuery([url]);

  const [processedData, setProcessedData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartData" + props.id, data);
  const [selectedDate, setSelectedDate] = useLocalStorageState(
    "ChartSelectedDate" + props.id,
    { defaultValue: null }
  );
  const [xAxisKey, setXAxisKey] = useLocalStorageState(
    "ChartXAxisKey" + props.id,
    { defaultValue: "events" }
  );

  // Process data updates
  useEffect(() => {
    if (isSuccess) {
      let newData = data;

      //Use sane date formatting
      const trimIndex = newData![0]!.date.toString().indexOf(":");
      if (trimIndex != -1) {
        for (let i = 0; i < data!.length; i++) {
          //@ts-ignore
          newData[i].date = newData[i].date
            .toString()
            .substring(4, trimIndex - 8);
        }
      }

      // If in hour view, filter by selected date
      if (url === prefs.urls.hourly) {
        //@ts-ignore
        newData = newData.filter(function (json: { date: string }) {
          return json.date === selectedDate;
        });

        // Generate hourly data
        const hours = [];

        // Make sure every hour has event values to have consistent scale
        for (let i = 0; i < 24; i++) {
          hours.push({
            date: selectedDate,
            hour: `${i.toString()}:00`,
            events: -10,
          });
        }

        // Import fetch data values into our data
        for (let i = 0; i < newData.length; i++) {
          //@ts-ignore
          hours[newData[i].hour].events = newData[i].events;
          //@ts-ignore // Update Y scale maximum for all Events charts
          if (hours[newData[i].hour].events > yMax)
            //@ts-ignore
            setYMax(hours[newData[i].hour].events);
        }

        //@ts-ignore
        newData = hours;
      }

      setProcessedData(newData);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setProcessedData, setYMax, url]);

  // Handle date click
  useEffect(() => {
    if (selectedDate) {
      setUrl(prefs.urls.hourly);
      setXAxisKey("hour");
    } else {
      setUrl(prefs.urls.daily);
      setXAxisKey("date");
    }
  }, [selectedDate, setUrl, setXAxisKey]);

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
              //@ts-ignore
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
            yAxisKey: url === prefs.urls.daily ? "_sum.events" : "events",
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

export default React.memo(EventsChart);
