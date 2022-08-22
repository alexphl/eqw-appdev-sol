import LineChart from "./LineChart";
import useLocalStorageState from "use-local-storage-state";
import { XIcon } from "@heroicons/react/solid";
import ModeListbox from "./Listbox";

/**
 * Chart visualizations panel
 **/
const Charts = () => {
  //localStorage.removeItem("charts");

  const [count, setCount] = useLocalStorageState("chartCount", {
    defaultValue: 1,
  });
  const [charts, setCharts] = useLocalStorageState("charts", {
    defaultValue: [{ id: count, component: "LineChart", mode: "Events" }],
  });

  function addChart() {
    setCharts((charts) => [
      ...charts,
      { id: count + 1, component: "LineChart", mode: "Events" },
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
    localStorage.removeItem("ChartData" + id);
    
    
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
            className="my-4 bg-zinc-900 px-1 py-2 rounded-xl shadow-lg"
          >
            <div className="grid grid-cols-[20%_1fr_20%] px-1.5 grid-rows-1 h-8 place-content-between">
            <ModeListbox selected={Chart.mode} selector={null}/>
              <div className="font-semibold col-start-2 h-min text-center self-center text-sm"> Chart {Chart.id} </div>
              <button
                className="bg-white/[0.03] hover:bg-rose-400/[0.6] text-zinc-300 hover:text-zinc-900 p-1 rounded-md w-min h-min col-start-3 justify-self-end self-center"
                onClick={() => removeChart(Chart.id)}
              >
                <XIcon className="w-5 h-5" />
              </button>
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
