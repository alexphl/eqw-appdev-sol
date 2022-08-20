const fetcher = (url: RequestInfo | URL | string) =>
    fetch(url).then((r) => r.json());

export default fetcher;
