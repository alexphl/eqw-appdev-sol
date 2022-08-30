// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { hourlyEventsRouter } from "./routes";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("hourlyEventsRouter.", hourlyEventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
