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
    useLocalStorageState("ChartRevenueData" + props.id, data);

  const [impressionsData, setImpressionsData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartImpressionsData" + props.id, data);

  const [clicksData, setClicksData]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartClicksData" + props.id, data);

  const [labels, setLabels]: [any, any, any] = //@ts-ignore
    useLocalStorageState("ChartLabels" + props.id, data);

  function makeDataset(target: string) {
    const newDataset = [];

    for (let i = 0; i < data.length; i++) {
      newDataset.push(data[i]._sum[target]);
    }

    console.log(newDataset);
    return newDataset;
  }

  // Process data updates
  useEffect(() => {
    if (isSuccess) {
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
      for (let i = 0; i < data.length; i++) {
        newLabels.push(data[i].date.toString());
      }

      console.log(newLabels);

      setLabels(newLabels);
      setRevenueData(makeDataset("revenue"));
      setImpressionsData(makeDataset("impressions"));
      setClicksData(makeDataset("clicks"));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setYMax, url]);

  // Handle date click
  useEffect(() => {
    if (selectedDate) {
      setUrl(prefs.urls.hourly);
      //setXAxisKey("hour");
    } else {
      setUrl(prefs.urls.daily);
      //setXAxisKey("date");
    }
  }, [selectedDate, setUrl]);

  return (
    <>
      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: "Revenue",
              data: revenueData,
              backgroundColor: "rgba(255, 100, 80, 0.8)",
              barThickness: 12,
              borderRadius: 3,
            },
            {
              label: "Impressions",
              data: impressionsData,
              backgroundColor: "rgba(100, 100, 255, 0.8)",
              barThickness: 12,
              borderRadius: 3,
            },
            {
              label: "Clicks",
              data: clicksData,
              backgroundColor: "rgba(100, 255, 255, 0.8)",
              barThickness: 12,
              borderRadius: 3,
            },
          ],
        }}
        plugins={[ChartDeferred]}
        options={{
          onClick: function (_evt, element) {
            if (element.length > 0 && data) {
              //@ts-ignore
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
            },
          },
          scales: {
            y: {
              grid: { drawTicks: true, lineWidth: 2, borderWidth: 2 },
              beginAtZero: true, //@ts-ignore false alarm for logarithmic scale
              type: "logarithmic",
              ticks: {
                callback: function (label: any, _index, _labels) { 
                  if ((label / 1000000) >= 1) return label / 1000000 + "M";
                  return label / 1000 + "k";
                },
                maxTicksLimit: 6,
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
