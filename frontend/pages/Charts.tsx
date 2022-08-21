import LineChart from "./LineChart";
import useLocalStorageState from "use-local-storage-state";
import { XIcon } from '@heroicons/react/solid'

/**
 * Chart visualizations panel
 **/
const Charts = () => {
  const [count, setCount] = useLocalStorageState("chartCount", {defaultValue: 1});
  const [charts, setCharts] = useLocalStorageState('charts', {defaultValue: [{ id: count, component: 'LineChart' }]});

  function addChart() {
    setCharts((charts) => [...charts, { id: count + 1, component: 'LineChart' }]);
    setCount(count + 1);
  }

  const removeChart = (id: number) => {
    const index = charts.findIndex((chart) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((item, i) => i !== index));
      console.log("removed chart at " + index);
    }

    localStorage.removeItem("ChartURL:" + id);
    if (charts.length == 1) {setCount(0)}
  };

  return (
    <div className="max-w-4xl m-auto">
      {charts.map((Chart, index) => {
        return (
          <div key={Chart.id} className="my-8">
            <button className="bg-rose-800 p-1 mx-2 rounded" onClick={() => removeChart(Chart.id)}>
              <XIcon className="h-5 w-5"/>
            </button>
            Chart {Chart.id}
            <LineChart id={Chart.id}/>
          </div>
        );
      })}

      <button className="bg-zinc-700 text-white font-bold p-2 rounded" onClick={() => addChart()}> Add Chart </button>
    </div>
  );
};

export default Charts;
