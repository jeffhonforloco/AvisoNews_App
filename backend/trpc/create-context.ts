import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // Extract auth token from headers
  const authHeader = opts.req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  
  // In production, verify JWT token and get user
  let userId: string | undefined;
  let userRole: string | undefined;
  
  if (token && token.startsWith("mock_token_")) {
    userId = token.replace("mock_token_", "");
  }

  return {
    req: opts.req,
    userId,
    userRole,
    // You can add more context items here like database connections, auth, etc.
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Middleware for protected routes
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);