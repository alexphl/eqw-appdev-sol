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
  const limit = limitPerInterval || 15; // Limit per interval, default:10
  const token = remoteAddress; // Use remote address for client tracking

  const tokenCount: [number] = tokenCache.get(token) || [0];
  if (tokenCount[0] === 0) tokenCache.set(token, tokenCount);
  tokenCount[0] += 1;

  return tokenCount[0] > limit;
};

export const hourlyEventsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (isRateLimited(ctx.reqOrigin))
      throw new TRPCError({ code: "UNAUTHORIZED" });
    return next();
  })
  .query("/events/hourly", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.hourly_events.findMany({
          select: {
            date: true,
            hour: true,
            events: true,
          },
          orderBy: {
            date: "desc",
            hour: "desc",
          },
          take: 480,
        });
      } catch (error) {
        console.log("error", error);
      }
    },
  });

export const dailyEventsRouter = createRouter().query("/events/daily", {
  async resolve({ ctx }) {
    try {
      return await ctx.prisma.hourly_events.groupBy({
        by: ["date"],
        _sum: {
          events: true,
        },
        orderBy: {
          date: "desc",
        },
        take: 12,
      });
    } catch (error) {
      console.log("error", error);
    }
  },
});
