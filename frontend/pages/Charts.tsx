import LineChart from "./LineChart";
import useLocalStorageState from "use-local-storage-state";
import { XIcon } from "@heroicons/react/solid";
import Listbox from "./Listbox";

/**
 * Chart visualizations panel
 **/
const Charts = () => {
  //localStorage.removeItem("charts");

  const [count, setCount] = useLocalStorageState("chartCount", {
    defaultValue: 1,
  });
  const [charts, setCharts] = useLocalStorageState("charts", {
    defaultValue: [{ id: count, component: "LineChart", mode: "events" }],
  });

  function addChart() {
    setCharts((charts) => [
      ...charts,
      { id: count + 1, component: "LineChart", mode: "events" },
    ]);
    setCount(count + 1);
  }

  const removeChart = (id: number) => {
    const index = charts.findIndex((chart) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((_item, i) => i !== index));
      console.log("removed chart at " + index);
    }

    localStorage.removeItem("ChartURL:" + id);
    localStorage.removeItem("ChartSelectedDate" + id);
    localStorage.removeItem("ChartXAxisKey" + id);
    
    if (charts.length == 1) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-4xl m-auto">
      {charts.map((Chart, _index) => {
        return (
          <div
            key={Chart.id}
            className="my-4 bg-zinc-900 px-1 py-3 rounded-xl shadow-lg"
          >
            <div>
              <button
                className="bg-white/[0.1] p-1 mx-2 rounded-md"
                onClick={() => removeChart(Chart.id)}
              >
                <XIcon className="h-5 w-5" />
              </button>
              Chart {Chart.id}
            </div>
            <div className="p-6">
              <LineChart id={Chart.id} mode={Chart.mode} />
            </div>
          </div>
        );
      })}

      <button
        className="bg-white/[0.1] text-white font-bold px-4 py-2 rounded"
        onClick={() => addChart()}
      >
        Add Chart
      </button>
    </div>
  );
};

export default Charts;
