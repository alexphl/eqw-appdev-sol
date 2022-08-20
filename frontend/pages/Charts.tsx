import useSWR from "swr";
import fetcher from "./fetcher";
import LineChart from "./LineChart";
import { useState } from "react";

/**
 * Chart visualizations panel
 **/

const Charts = () => {
  const [charts, setCharts] = useState([LineChart]);

  return (
    <div className="max-w-4xl m-auto">
      {charts.map((Chart, index) => {
        return <Chart key={index} />;
      })}
    </div>
  );
};

export default Charts;