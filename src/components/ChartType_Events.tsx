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
    daily: "eventsRouter.getDailyEvents",
    hourly: "eventsRouter.getHourlyEvents",
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

  const [processedData, setProcessedData]: typeof data = useLocalStorageState(
    "ChartData" + props.id,
    data
  );
  const [selectedDate, setSelectedDate] = useLocalStorageState(
    "ChartSelectedDate" + props.id,
    { defaultValue: null }
  );

  // Process data updates
  useEffect(() => {
    if (isSuccess) {
      let newData = structuredClone(data);

      //Use sane date formatting
      const trimIndex = newData![0]!.date.toString().indexOf(":");
      if (trimIndex != -1) {
        for (let i = 0; i < newData!.length; i++) {
          newData[i].date = newData[i].date
            .toString()
            .substring(4, trimIndex - 8);
        }
      }

      // If in hour view, filter by selected date
      if (url === prefs.urls.hourly) {
        newData = newData.filter(function (json: { date: string }) {
          return json.date === selectedDate;
        });

        // Make sure every hour has event values to have consistent scale
        const hours = [];
        for (let i = 0; i < 24; i++) {
          hours.push({
            date: selectedDate,
            hour: `${i.toString()}:00`,
            events: null,
          });
        }

        // Update Y scale maximum for all Stats charts
        const max = Math.max(
          ...newData.map((o: typeof newData[0]) => o.events)
        );
        if (max > yMax) {
          setYMax(max);
        }

        // Import fetch data values into our data
        for (let i = 0; i < newData.length; i++) {
          hours[newData[i].hour]!.events = newData[i].events;
        }

        newData = hours;
      }

      setProcessedData(newData);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data && data.length, setYMax]);

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
            if (!selectedDate && element.length > 0 && data) {
              setUrl(prefs.urls.hourly);
              const date = data[element[0]!.index].date.toString();
              setSelectedDate(date.substring(4, date.indexOf(":") - 8));
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
          spanGaps: true,
          normalized: true,
          maintainAspectRatio: false,
          animations: {},
          parsing: {
            xAxisKey: url === prefs.urls.daily ? "date" : "hour",
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
              grid: { lineWidth: 2, borderWidth: 2 },
              beginAtZero: true,
              ticks: {
                maxTicksLimit: 6,
                callback: function (val, _index, _ticks) {
                  return val;
                },
              },
              suggestedMax: yMax,
            },
            x: {
              title: {
                display: true,
                text:
                  (selectedDate && "Hours for " + selectedDate) || "Daily data",
                padding: 11,
                font: {
                  size: 13.5,
                  weight: "600",
                },
              },
              grid: { lineWidth: 2, borderWidth: 2 },
              offset: true,
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
            onClick={() => {
              setSelectedDate(null);
              setUrl(prefs.urls.daily);
            }}
          >
            <ArrowLeftIcon className="w-8 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

export default React.memo(EventsChart);
