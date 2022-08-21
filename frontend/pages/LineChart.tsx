import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useSWR from "swr";
import fetcher from "./fetcher";
import useLocalStorageState from "use-local-storage-state";

const LineChart = (props: {id: number}) => {
    const [url, setUrl] = useLocalStorageState("ChartURL:" + props.id, {defaultValue: "http://localhost:5555/events/daily"});
    const { data, error } = useSWR(url, fetcher);

    // // Shows old data if refresh fails
    // if (error && !data)
    //     return (
    //         <div>
    //             Contents failed to load :( <p> Retrying... </p>
    //         </div>
    //     );

    Chart.register(...registerables);

    return (
        <Line
            data={{
                labels: [],
                datasets: [
                    {
                        label: "Events",
                        data: data,
                        backgroundColor: ["rgba(220, 255, 255, 0.2)"],
                        borderColor: ["rgba(220, 255, 255, 0.6)"],
                        borderWidth: 1,
                    },
                ],
            }}
            options={{
                onClick: function (evt, element) {
                    if (element.length > 0) {
                        //console.log(element[0].index);
                        setUrl("http://localhost:5555/events/hourly");
                    }
                },
                animations: {},
                parsing: {
                    xAxisKey: "date",
                    yAxisKey: "events",
                },
                elements: {
                    point: {
                        radius: 8,
                        hitRadius: 50,
                        hoverRadius: 10,
                    },
                    line: {
                        tension: 0.3,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    );
};

export default LineChart;
