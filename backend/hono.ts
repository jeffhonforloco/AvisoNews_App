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

// Mount tRPC router
// CRITICAL: Use exact path match and handle both /trpc and /trpc/*
// @hono/trpc-server needs the endpoint to match the client URL
app.all("/trpc", async (c) => {
  console.log("📡 tRPC request (exact /trpc):", c.req.method, c.req.path, c.req.url);
  
  // Create handler for this specific request
  const handler = trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 Creating context:", opts.req.method, opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path, type }) => {
      console.error(`❌ tRPC Error on ${path} (${type}):`, error);
      if ((error as any).code === 'NOT_FOUND' || (error as any).code === 'BAD_REQUEST') {
        console.error(`❌ Procedure NOT FOUND: ${path}`);
        console.error("Full error:", JSON.stringify(error, null, 2));
        console.error("Available router structure:", JSON.stringify(getRouterStructure(appRouter), null, 2));
      }
    },
  });
  
  return handler(c.req.raw);
});

// Also handle /trpc/* for path-based requests
app.all("/trpc/*", async (c) => {
  console.log("📡 tRPC request (wildcard /trpc/*):", c.req.method, c.req.path, c.req.url);
  
  const handler = trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      console.log("📡 Creating context (wildcard):", opts.req.method, opts.req.url);
      return await createContext(opts);
    },
    onError: ({ error, path, type }) => {
      console.error(`❌ tRPC Error on ${path} (${type}):`, error);
      if ((error as any).code === 'NOT_FOUND' || (error as any).code === 'BAD_REQUEST') {
        console.error(`❌ Procedure NOT FOUND: ${path}`);
        console.error("Available router structure:", JSON.stringify(getRouterStructure(appRouter), null, 2));
      }
    },
  });
  
  return handler(c.req.raw);
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