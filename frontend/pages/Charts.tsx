import useSWR from "swr";

const Charts = () => {
  const fetcher = (url: RequestInfo | URL | string) => fetch(url).then(r => r.json());
  const { data, error } = useSWR('http://localhost:5555/events/hourly', fetcher);

  if (error) return <div>failed to load</div>

  return (
    <div>
      hello
    </div>
  );
}

export default Charts;
