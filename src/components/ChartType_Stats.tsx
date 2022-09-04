import { Bar } from "react-chartjs-2";
import useLocalStorageState from "use-local-storage-state";
import { useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import ChartDeferred from "chartjs-plugin-deferred";
import { trpc } from "../utils/trpc";

// Chart constants
const prefs: { [key: string]: any } = {
  urls: {
    daily: "statsRouter.getDailyStats",
    hourly: "statsRouter.getHourlyStats",
  },
};

/**
 * Chart for plotting events
 **/
const StatsChart = (props: { id: number; yAxisScale: [number, any] }) => {
  const [yMax, setYMax] = props.yAxisScale;

  const [url, setUrl] = useLocalStorageState("ChartURL:" + props.id, {
    defaultValue: prefs.urls.daily,
  });

  const { data, isSuccess } = trpc.useQuery([url]);

  const [selectedDate, setSelectedDate] = useLocalStorageState(
    "ChartSelectedDate" + props.id,
    { defaultValue: null }
  );

  // Datasets
  const [revenueData, setRevenueData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartRevenueData" + props.id, null);

  const [impressionsData, setImpressionsData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartImpressionsData" + props.id, null);

  const [clicksData, setClicksData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartClicksData" + props.id, null);

  const [labels, setLabels]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartLabels" + props.id, null);

  function makeDataset(target: string) {
    const newDataset = [];

    if (url === prefs.urls.daily) {
      for (let i = 0; i < data.length; i++) {
        newDataset.push(data[i]._sum[target]);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        newDataset.push(data[i][target]);
      }
    }

    return newDataset;
  }

  // Process data updates
  useEffect(() => {
    if (isSuccess && data) {
      const newData = data;

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

      // Format X-axis labels for Chart.js
      const newLabels = [];

      if (url != prefs.urls.daily) {
        for (let i = 0; i < 24; i++) {
          newLabels.push(i + ":00");
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          newLabels.push(data[i].date.toString());
        }
      }

      setLabels(newLabels);
      setRevenueData(makeDataset("revenue"));
      setImpressionsData(makeDataset("impressions"));
      setClicksData(makeDataset("clicks"));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: revenueData,
              backgroundColor: "rgba(255, 120, 140, 0.8)",
              borderRadius: 2,
            },
            {
              label: "Impressions",
              data: impressionsData,
              backgroundColor: "rgba(120, 150, 255, 0.8)",
              borderRadius: 2,
            },
            {
              label: "Clicks",
              data: clicksData,
              backgroundColor: "rgba(100, 245, 255, 0.8)",
              borderRadius: 2,
            },
          ],
        }}
        plugins={[ChartDeferred]}
        options={{
          onClick: function (_evt, element) {
            if (element.length > 0 && data) {
              setUrl(prefs.urls.hourly); //@ts-ignore
              setSelectedDate(data[element[0].index].date);
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
          elements: {
            point: {
              radius: 10,
              hitRadius: 60,
              hoverRadius: url === prefs.urls.hourly ? 10 : 15,
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size:11,
                },
                boxWidth: 30,
              }
            },
          },
          scales: {
            y: {
              grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
              beginAtZero: true, //@ts-ignore false alarm for logarithmic scale
              type: "logarithmic",
              ticks: {
                callback: function (label: any, _index, _labels) {
                  if (label / 1000000 >= 1) return label / 1000000 + "M";
                  if (label / 1000 >= 1) return label / 1000 + "k";
                  return label;
                },
                maxTicksLimit: 6,
                font: {
                  size: 10.5,
                },
              },
            },
            x: {
              title: {
                display: true,
                padding: 11,
                font: {
                  size: 13.5,
                  weight: "600",
                },
                text: (selectedDate && "Hours for " + selectedDate) || "Daily data",
              },
              grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
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

export default StatsChart;
