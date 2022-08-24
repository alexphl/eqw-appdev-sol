import dynamic from "next/dynamic";
import useLocalStorageState from "use-local-storage-state";
import { XIcon, PlusIcon } from "@heroicons/react/solid";
import ChartModeListbox from "./ChartModeListbox";
import { Suspense } from "react";
import { Chart } from "chart.js";

// Lazy load our chart types
const EventsChart = dynamic(() => import("./ChartType_Events"));
const StatsChart = dynamic(() => import("./ChartType_Stats"));

// Set global chart styles
Chart.defaults.font.size = 13;
Chart.defaults.font.weight = "400";
Chart.defaults.borderColor = "rgba(220, 255, 255, 0.04)";
Chart.defaults.color = "#d4d4d8";

/**
 * Chart visualizations panel
 **/
const Charts = () => {
  //localStorage.removeItem("charts");

  const [count, setCount] = useLocalStorageState("chartCount", {
    defaultValue: 1,
  });
  const [charts, setCharts] = useLocalStorageState("charts", {
    defaultValue: [{ id: count, mode: "Events" }],
  });

  function addChart() {
    setCharts((charts) => [...charts, { id: count + 1, mode: "Events" }]);
    setCount(count + 1);
  }

  // Flushes local storage chart state cache
  function clearChartStorage(id: number) {
    localStorage.removeItem("ChartURL:" + id);
    localStorage.removeItem("ChartSelectedDate" + id);
    localStorage.removeItem("ChartXAxisKey" + id);
    localStorage.removeItem("ChartData" + id);
  }

  // Removes a chart from charts array
  const removeChart = (id: number) => {
    const index = charts.findIndex((chart: {id:number}) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((_item, i) => i !== index));
    }

    clearChartStorage(id);

    // Reset chart counter when array is empty
    if (charts.length === 1) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      {charts.map((Chart, _index) => {
        return (
          <div
            key={Chart.id}
            className="my-4 bg-neutral-900 rounded-2xl shadow-md min-h-[35vw] xl:min-h-[30vw] 2xl:min-h-[400px]"
          >
            <div className="grid grid-cols-[20%_1fr_20%] px-3 py-6 grid-rows-1 h-4 sticky z-1 top-0 bg-neutral-900/[0.1] backdrop-blur-2xl hover:backdrop-filter-none hover:bg-neutral-900 rounded-t-2xl">
              <ChartModeListbox
                selected={Chart.mode}
                chartController={[charts, setCharts]}
                id={Chart.id}
                cleanupFunc={clearChartStorage}
              />
              <div className="font-medium text-center self-center text-sm">
                Chart {Chart.id}
              </div>
              <button
                className="bg-white/[0.06] hover:bg-rose-400/[0.6] transition-all text-zinc-300 hover:text-zinc-900 p-1 rounded-lg justify-self-end self-center"
                onClick={() => removeChart(Chart.id)}
              >
                <XIcon className="w-8 h-4" />
              </button>
            </div>
            <div className="px-4 pb-3 -mt-1">
              <Suspense
                fallback={
                  <div className="m-auto w-full"> Loading... </div>
                }
              >
                {Chart.mode === "Events" && (
                  <EventsChart id={Chart.id} />
                )}
                {Chart.mode === "Stats" && (
                  <StatsChart id={Chart.id} />
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

export default Charts;
