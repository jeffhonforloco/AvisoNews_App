import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// Comprehensive router validation on server start
function validateRouterStructure() {
  console.log("\n" + "=".repeat(60));
  console.log("🔍 COMPREHENSIVE ROUTER VALIDATION");
  console.log("=".repeat(60));
  
  try {
    const routerRecord = appRouter._def?.record;
    if (!routerRecord) {
      console.error("❌ CRITICAL: Router _def.record is missing!");
      console.error("Router type:", typeof appRouter);
      console.error("Router keys:", Object.keys(appRouter));
      return false;
    }
    
    console.log("✅ Router _def.record exists");
    console.log("📋 Top-level routes:", Object.keys(routerRecord));
    
    // Validate news router
    if (!routerRecord.news) {
      console.error("❌ CRITICAL: 'news' router not found in top-level routes!");
      return false;
    }
    
    const newsDef = (routerRecord.news as any)._def;
    if (!newsDef || !newsDef.record) {
      console.error("❌ CRITICAL: News router _def.record is missing!");
      return false;
    }
    
    const newsRecord = newsDef.record;
    console.log("✅ News router found");
    console.log("📰 News sub-routes:", Object.keys(newsRecord));
    
    // Validate articles router
    if (!newsRecord.articles) {
      console.error("❌ CRITICAL: 'articles' router not found in news router!");
      return false;
    }
    
    const articlesDef = (newsRecord.articles as any)._def;
    if (!articlesDef || !articlesDef.record) {
      console.error("❌ CRITICAL: Articles router _def.record is missing!");
      return false;
    }
    
    const articlesRecord = articlesDef.record;
    console.log("✅ Articles router found");
    console.log("📄 Articles procedures:", Object.keys(articlesRecord));
    
    // Validate 'list' procedure
    if (!articlesRecord.list) {
      console.error("❌ CRITICAL: 'list' procedure NOT found!");
      console.error("Available procedures:", Object.keys(articlesRecord));
      return false;
    }
    
    console.log("✅ 'list' procedure FOUND and registered!");
    console.log("✅ Router structure is VALID");
    console.log("=".repeat(60) + "\n");
    return true;
  } catch (error) {
    console.error("❌ CRITICAL ERROR during router validation:", error);
    console.error("Stack:", (error as Error).stack);
    return false;
  }
}

const routerValid = validateRouterStructure();
if (!routerValid) {
  console.error("❌ Router validation FAILED - server may not work correctly!");
}

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router using @hono/trpc-server
// CRITICAL: The endpoint must match exactly what the client calls
// Client calls: /api/trpc/news.articles.list
// Since Rork mounts server at /api, we handle /trpc/*
const trpcMiddleware = trpcServer({
  router: appRouter,
  endpoint: "/trpc", // Explicit endpoint path
  createContext: async (opts) => {
    const url = new URL(opts.req.url);
    console.log("📡 tRPC request:", opts.req.method, url.pathname, url.search);
    return await createContext(opts);
  },
  onError: ({ error, path, type }) => {
    console.error(`\n❌ tRPC ERROR`);
    console.error(`Path: ${path}`);
    console.error(`Type: ${type}`);
    console.error(`Error:`, error);
    
    if ((error as any).code === 'NOT_FOUND' || (error as any).code === 'BAD_REQUEST') {
      console.error(`\n❌ PROCEDURE NOT FOUND: ${path}`);
      console.error("This means the router doesn't have this path registered.");
      console.error("\n📋 AVAILABLE ROUTER STRUCTURE:");
      console.log(JSON.stringify(getRouterStructure(appRouter), null, 2));
      console.error("\n🔍 Did you mean one of these?");
      
      // Try to suggest similar paths
      const structure = getRouterStructure(appRouter);
      if (structure.news?.articles) {
        console.error("Available procedures under news.articles:", structure.news.articles);
      }
    }
  },
});

// Mount the tRPC middleware - CRITICAL: must handle /trpc/* for path-based routing
// tRPC sends requests like: POST /trpc/news.articles.list
app.all("/trpc", trpcMiddleware);
app.all("/trpc/*", trpcMiddleware);

// Helper to inspect router structure recursively
function getRouterStructure(router: any, depth = 0): any {
  try {
    const record = router._def?.record;
    if (!record) return { error: "No _def.record found" };
    
    const structure: any = {};
    for (const [key, value] of Object.entries(record)) {
      const subRouter = (value as any)?._def?.record;
      if (subRouter) {
        // It's a sub-router, recurse deeper
        structure[key] = getRouterStructure(value, depth + 1);
      } else {
        // It's a procedure
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