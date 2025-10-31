import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Log router structure for debugging on server start
function logRouterStructure() {
  try {
    const routerRecord = appRouter._def?.record;
    if (routerRecord) {
      console.log("✅ Router loaded. Top-level routes:", Object.keys(routerRecord));
      
      // Check news router
      if (routerRecord.news && (routerRecord.news as any)._def?.record) {
        const newsRecord = (routerRecord.news as any)._def.record;
        console.log("📰 News router sub-routes:", Object.keys(newsRecord));
        
        // Check articles router
        if (newsRecord.articles && (newsRecord.articles as any)._def?.record) {
          const articlesRecord = (newsRecord.articles as any)._def.record;
          console.log("📄 Articles router procedures:", Object.keys(articlesRecord));
          
          if (articlesRecord.list) {
            console.log("✅ 'list' procedure found in articles router!");
          } else {
            console.error("❌ 'list' procedure NOT found in articles router!");
            console.error("Available procedures:", Object.keys(articlesRecord));
          }
        } else {
          console.error("❌ Articles router not found or has no record");
        }
      } else {
        console.error("❌ News router not found or has no record");
      }
    } else {
      console.warn("⚠️ Router record not found");
    }
  } catch (error) {
    console.warn("⚠️ Could not inspect router structure:", error);
  }
}

logRouterStructure();

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router
// @hono/trpc-server returns a Hono middleware that handles the routing
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 tRPC request:", opts.req.method, opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path, type }) => {
      console.error(`❌ tRPC Error on ${path} (${type}):`, error);
      if ((error as any).code === 'NOT_FOUND') {
        console.error(`❌ Procedure NOT FOUND: ${path}`);
        console.error("Available router structure:", JSON.stringify(getRouterStructure(appRouter), null, 2));
      }
    },
  })
);

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