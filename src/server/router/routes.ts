import { createRouter } from "./context";
//import { z } from "zod";
import LRU from "lru-cache";
import { TRPCError } from "@trpc/server";

const tokenCache = new LRU({
  max: 500, // max number of tokens
  ttl: 60000, // rate limit interval (ms)
});

const isRateLimited = (
  remoteAddress: string | null,
  limitPerInterval?: number
) => {
  const limit = limitPerInterval || 250; // Limit per interval, default:10
  const token = remoteAddress; // Use remote address for client tracking

  const tokenCount: [number] = tokenCache.get(token) || [0];
  if (tokenCount[0] === 0) tokenCache.set(token, tokenCount);
  tokenCount[0] += 1;

  console.log("HERE");
  return tokenCount[0] > limit;
};

const dailyEventsRouter = createRouter()
  .query("getDailyEvents", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.hourly_events.groupBy({
          by: ["date"],
          _sum: {
            events: true,
          },
          orderBy: [
            {
              date: "asc",
            },
          ],
          take: 12,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });

 const hourlyEventsRouter = createRouter()
  .query("getHourlyEvents", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.hourly_events.findMany({
          select: {
            date: true,
            hour: true,
            events: true,
          },
          orderBy: {
            date: "asc",
          },
          take: 480,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });

const dailyStatsRouter = createRouter()
  .query("getDailyStats", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.hourly_stats.groupBy({
          by: ["date"],
          _sum: {
            impressions: true,
            clicks: true,
            revenue: true,
          },
          orderBy: [
            {
              date: "asc",
            },
          ],
          take: 12,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });

const hourlyStatsRouter = createRouter()
  .query("getHourlyStats", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.hourly_stats.findMany({
          select: {
            date: true,
            hour: true,
            impressions: true,
            clicks: true,
            revenue: true,
          },
          orderBy: {
            date: "asc",
            hour: 'asc',
          },
          take: 480,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  export const poiRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (isRateLimited(ctx.reqOrigin))
      throw new TRPCError({ code: "BAD_REQUEST" });
    return next();
  })
  .query("getPoi", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.poi.findMany();
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  export const eventsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (isRateLimited(ctx.reqOrigin))
      throw new TRPCError({ code: "BAD_REQUEST" });
    return next();
  })
  .merge("daily.", dailyEventsRouter)
  .merge("hourly.", hourlyEventsRouter);

  export const statsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (isRateLimited(ctx.reqOrigin))
      throw new TRPCError({ code: "BAD_REQUEST" });
    return next();
  })
  .merge("daily.", dailyStatsRouter)
  .merge("hourly.", hourlyStatsRouter);
