import dynamic from "next/dynamic";
import useLocalStorageState from "use-local-storage-state";
import { XIcon, PlusIcon } from "@heroicons/react/solid";
import ChartModeListbox from "./ChartModeListbox";
import { Suspense } from "react";
import { Chart, registerables } from "chart.js";
import React from "react";

// Lazy load our chart types
const EventsChart = dynamic(() => import("./ChartType_Events"));
const StatsChart = dynamic(() => import("./ChartType_Stats"));

// Set global chart styles
Chart.defaults.font.size = 13;
Chart.defaults.font.weight = "400";
Chart.defaults.borderColor = "rgba(220, 255, 255, 0.04)";
Chart.defaults.color = "#d4d4d8";

// Flushes local storage chart state cache
function clearChartStorage(id: number) {
  localStorage.removeItem("ChartURL:" + id);
  localStorage.removeItem("ChartSelectedDate" + id);
  localStorage.removeItem("ChartXAxisKey" + id);
  localStorage.removeItem("ChartData" + id);
  localStorage.removeItem("ChartRevenueData" + id);
  localStorage.removeItem("ChartImpressionsData" + id);
  localStorage.removeItem("ChartClicksData" + id);
  localStorage.removeItem("ChartLabels" + id);
}

/**
 * Chart visualizations panel
 **/
const Charts = () => {
  Chart.register(...registerables);

  const [count, setCount] = useLocalStorageState("chartCount", {
    defaultValue: 1,
  });
  const [charts, setCharts] = useLocalStorageState("charts", {
    defaultValue: [{ id: count, mode: "Stats" }],
  });

  const [eventsYMax, setEventsYmax] = useLocalStorageState("eventsYMax", {
    defaultValue: 0,
  });

  const [statsYMax, setStatsYmax] = useLocalStorageState("statsYMax", {
    defaultValue: 0,
  });

  // Add a new chart settings object to charts array
  function addChart() {
    setCharts((charts) => [...charts, { id: count + 1, mode: "Events" }]);
    setCount(count + 1);
  }

  // Removes the chart's settings object from charts array
  const removeChart = (id: number) => {
    const index = charts.findIndex((chart: { id: number }) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((_item, i) => i !== index));
    }

    clearChartStorage(id);

    // Reset chart counter when array is empty
    if (charts.length === 1) {
      setCount(0);
      setEventsYmax(0);
      setStatsYmax(0);
    }
  };

  return (
    <div className="container max-w-3xl xl:max-w-4xl m-auto">
      {charts.map((Chart) => {
        return (
          <div
            key={Chart.id}
            className="my-4 bg-neutral-900 sm:rounded-2xl shadow-md"
          >
            <div className="grid grid-cols-[20%_1fr_20%] px-3 py-6 grid-rows-1 h-4 sticky z-1 top-0 bg-neutral-900/[0.1] backdrop-blur-2xl hover:backdrop-filter-none hover:bg-neutral-900 sm:rounded-t-2xl">
              <ChartModeListbox
                selected={Chart.mode}
                chartController={[charts, setCharts]}
                id={Chart.id}
                cleanupFunc={clearChartStorage}
              />
              <div className="font-medium text-center self-center text-sm">
                {Chart.id === 69
                  ? "Another chart. Thrilling."
                  : "Chart " + Chart.id}
              </div>
              <button
                className="bg-white/[0.06] hover:bg-rose-400/[0.6] transition-all text-zinc-300 hover:text-zinc-900 p-1 rounded-lg justify-self-end self-center"
                onClick={() => removeChart(Chart.id)}
              >
                <XIcon className="w-8 h-4" />
              </button>
            </div>
            <div className="px-3 sm:px-4 pb-1.5 -mt-1 h-[300px] sm:h-[380px] max-h-[85vh]">
              <Suspense
                fallback={<div className="m-auto w-min"> Loading... </div>}
              >
                {Chart.mode === "Events" ? (
                  <EventsChart
                    id={Chart.id}
                    yAxisScale={[eventsYMax, setEventsYmax]}
                  />
                ) : (
                  <StatsChart
                    id={Chart.id}
                    yAxisScale={[statsYMax, setStatsYmax]}
                  />
                )}
              </Suspense>
            </div>
          </div>
        );
      })}

      <div className="m-auto w-min my-14">
        <button
          className="bg-black/[0.2] hover:bg-black/[0.5] hover:scale-110 active:p-12 hover:shadow-sm transition-all text-white p-4 rounded-full"
          onClick={() => addChart()}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(Charts);
