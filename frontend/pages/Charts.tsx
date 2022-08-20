import LineChart from "./LineChart";
import { useState } from "react";

/**
 * Chart visualizations panel
 **/

const Charts = () => {
  const [charts, setCharts] = useState([LineChart]);

  function addChart() {
    setCharts((charts) => [LineChart, ...charts]);
  }

  const removeChart = (index: number) => {
    console.log("removed chart at " + index);
    setCharts([
      ...charts.slice(0, index),
      ...charts.slice(index + 1, charts.length),
    ]);
  };

  return (
    <div className="max-w-4xl m-auto">
      {charts.map((Chart, index) => {
        return (
          <>
            <Chart key={index} />
            <button onClick={() => removeChart(index)}> Delete Chart </button>
          </>
        );
      })}

      <br />
      <button onClick={addChart}> Add Chart </button>
    </div>
  );
};

export default Charts;
