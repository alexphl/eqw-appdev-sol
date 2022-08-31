// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { eventsRouter } from "./routes";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("eventsRouter.", eventsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
