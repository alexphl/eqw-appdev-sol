// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
//type CreateContextOptions = Record<string, never>;

export const createContext = async ({
  req,
}: trpcNext.CreateNextContextOptions) => {
  async function getRemoteAddress() {
    if (req.socket.remoteAddress) {
      return req.socket.remoteAddress;
    } else return null;
  }
  const reqOrigin = await getRemoteAddress();

  return {
    prisma,
    reqOrigin,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
