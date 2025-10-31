import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Log router structure for debugging
console.log("🔍 Router keys:", Object.keys(appRouter._def.procedures || {}));
console.log("🔍 Router structure:", JSON.stringify(Object.keys(appRouter._def.record || {}), null, 2));

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
// The endpoint should match what the frontend calls
app.all("/trpc/*", async (c) => {
  console.log("📡 tRPC request received:", c.req.path);
  return trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 Creating context for:", opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path }) => {
      console.error(`❌ tRPC Error on path ${path}:`, error);
    },
  })(c);
});

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;