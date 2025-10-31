import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Create Hono app
const app = new Hono();

// Enable CORS
app.use("*", cors());

// Mount tRPC using fetch adapter directly - simpler and more reliable
app.all("/trpc/*", async (c) => {
  console.log("📡 tRPC request received:", c.req.method, c.req.url);
  
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: c.req.raw,
    createContext: async () => {
      return await createContext({
        req: c.req.raw,
        resHeaders: new Headers(),
      });
    },
    onError: ({ error, path, type }) => {
      console.error(`❌ tRPC Error [${type}] on ${path}:`, error.message);
    },
  });

  return response;
});

// Health check
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;
