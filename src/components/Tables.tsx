import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const urls = {
  events: {
    daily: "eventsRouter.getDailyEvents",
    hourly: "eventsRouter.getHourlyEvents",
  },
  stats: {
    daily: "statsRouter.getDailyStats",
    hourly: "statsRouter.getHourlyStats",
  },
};

type EventsData = [
  {
    _sum: {
      events: number;
    };
    hourly: [{ hour: number; events: number }];
    date: Date;
  }
];

type StatsData = [
  {
    _sum: {
      events: number;
    };
    hourly: {
      hour: number;
      impressions: number;
      clicks: number;
      revenue: number;
    };
    date: Date;
  }
];

const Tables = () => {
  return (
    <div className="pt-20">
      Tables: Nothing here just yet, check again later.
    </div>
  );
};

export default Tables;
