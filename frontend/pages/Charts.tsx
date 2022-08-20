import LineChart from "./LineChart";
import { useState } from "react";

/**
 * Chart visualizations panel
 **/

const Charts = () => {
  const [count, setCount] = useState(1);
  const [charts, setCharts] = useState([{ id: count, component: LineChart }]);

  function addChart() {
    setCharts((charts) => [...charts, { id: count + 1, component: LineChart }]);
    setCount(count + 1);
  }

  const removeChart = (id: number) => {
    const index = charts.findIndex((chart) => chart.id === id);

    if (index > -1) {
      setCharts(charts.filter((item, i) => i !== index));
      console.log("removed chart at " + index);
    }
  };

  return (
    <div className="max-w-4xl m-auto">
      {charts.map((Chart, index) => {
        return (
          <div key={Chart.id}>
            <Chart.component />
            <button onClick={() => removeChart(Chart.id)}>
              Delete Chart {Chart.id}
            </button>
          </div>
        );
      })}

      <button onClick={() => addChart()}> Add Chart </button>
    </div>
  );
};

export default Charts;
