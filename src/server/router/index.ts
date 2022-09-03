// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { eventsRouter, statsRouter, poiRouter } from "./routes";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("eventsRouter.", eventsRouter)
  .merge("statsRouter.", statsRouter)
  .merge("poiRouter.", poiRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
