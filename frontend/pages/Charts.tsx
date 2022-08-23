import dynamic from "next/dynamic";
import useLocalStorageState from "use-local-storage-state";
import { XIcon, PlusIcon } from "@heroicons/react/solid";
import ModeListbox from "./Listbox";

const EventChart = dynamic(() => import("./EventChart"));
const StatsChart = dynamic(() => import("./StatsChart"));

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

  function clearChartStorage(id:number) {
    localStorage.removeItem("ChartURL:" + id);
    localStorage.removeItem("ChartSelectedDate" + id);
    localStorage.removeItem("ChartXAxisKey" + id);
    localStorage.removeItem("ChartData" + id);
  }

  const removeChart = (id: number) => {
    const index = charts.findIndex((chart) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((_item, i) => i !== index));
      console.log("removed chart at " + index);
    }

    clearChartStorage(id);

    if (charts.length == 1) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-3xl m-auto">
      {charts.map((Chart, _index) => {
        return (
          <div
            key={Chart.id}
            className="my-4 bg-neutral-900 rounded-2xl shadow-md"
          >
            <div className="grid grid-cols-[20%_1fr_20%] px-3 py-6 grid-rows-1 h-4 sticky z-1 top-0 bg-neutral-900/[0.1] backdrop-blur-2xl hover:backdrop-filter-none hover:bg-neutral-900 rounded-t-2xl">
              <ModeListbox
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
            <div className="px-4 pb-1 -mt-1 min-h-[200px] transition-all h-fit">
              {Chart.mode === "Events" && (
                <EventChart id={Chart.id} mode={Chart.mode}/>
              )}
              {Chart.mode === "Stats" && (
                <StatsChart id={Chart.id} mode={Chart.mode}/>
              )}
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
