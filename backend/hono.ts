import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Log router structure for debugging
try {
  const routerRecord = appRouter._def?.record;
  if (routerRecord) {
    console.log("✅ Router loaded. Available routes:", Object.keys(routerRecord));
    console.log("📰 News routes:", routerRecord.news ? Object.keys(routerRecord.news._def?.record || {}) : "Not found");
  } else {
    console.warn("⚠️ Router record not found");
  }
} catch (error) {
  console.warn("⚠️ Could not inspect router structure:", error);
}

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 tRPC request:", opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path, type }) => {
      console.error(`❌ tRPC Error on ${path} (${type}):`, error.message);
    },
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;