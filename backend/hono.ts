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

// Mount tRPC router - IMPORTANT: Use app.all to handle all HTTP methods (GET, POST)
// tRPC uses POST for mutations and queries can use GET or POST
app.all("/trpc/*", async (c) => {
  console.log("📡 Incoming tRPC request:", c.req.method, c.req.path);
  
  // Create the tRPC server handler
  const handler = trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 Creating context for:", opts.req.method, opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path, type, ctx }) => {
      console.error(`❌ tRPC Error on ${path} (${type}):`, error);
      if (error.code === 'NOT_FOUND') {
        console.error(`❌ Procedure not found! Looking for: ${path}`);
        console.error("Available router structure:", JSON.stringify(getRouterStructure(appRouter), null, 2));
      }
    },
  });
  
  // Execute the handler
  return handler(c.req.raw, c.env, c.executionCtx);
});

// Helper to inspect router structure
function getRouterStructure(router: any): any {
  try {
    const record = router._def?.record;
    if (!record) return { error: "No _def.record found" };
    
    const structure: any = {};
    for (const [key, value] of Object.entries(record)) {
      if ((value as any)?._def?.record) {
        structure[key] = Object.keys((value as any)._def.record);
      } else {
        structure[key] = "procedure";
      }
    }
    return structure;
  } catch (error) {
    return { error: String(error) };
  }
}

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

export default app;