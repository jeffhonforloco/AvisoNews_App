// Industry-Standard REST API Server
// Built with Hono for cross-platform compatibility

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  getArticles,
  getArticleById,
  searchArticles,
  getRelatedArticles,
  incrementViewCount,
  getCategories,
  getCategoryBySlug,
  getSources,
  getStoreStats,
  addArticles,
} from "./store/newsStore";
import { aggregateNews } from "./services/newsAggregator";
import { forceUpdate } from "./jobs/newsUpdater";

console.log("🔧 Creating Hono app instance...");
const app = new Hono();

console.log("🔧 Middleware setup starting...");

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

console.log("🔧 Middleware configured");

// Debug middleware - log ALL incoming requests with full details
// PLACED FIRST so it catches ALL requests before route matching
app.use("*", async (c, next) => {
  try {
    const url = new URL(c.req.url);
    console.log(`\n📡 === INCOMING REQUEST ===`);
    console.log(`   Method: ${c.req.method}`);
    console.log(`   Path: ${c.req.path}`);
    console.log(`   Full URL: ${c.req.url}`);
    console.log(`   Query: ${JSON.stringify(c.req.query())}`);
    console.log(`   Raw Path: ${c.req.raw.path}`);
    await next();
    console.log(`✅ Response: ${c.res.status}\n`);
  } catch (error) {
    console.error("❌ Error in debug middleware:", error);
    await next();
  }
});

// Health check - test base route (VERY FIRST ROUTE)
app.get("/", (c) => {
  console.log("✅ Health check hit at /");
  return c.json({
    status: "ok",
    service: "AvisoNews API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    message: "Server is running",
    routes: ["/articles", "/api/articles", "/categories", "/api/categories"],
  });
});

// CRITICAL TEST: Simple test endpoint to verify server is working
app.get("/test", (c) => {
  console.log("✅ TEST endpoint hit at /test");
  return c.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/test", (c) => {
  console.log("✅ TEST endpoint hit at /api/test");
  return c.json({
    success: true,
    message: "API server is working!",
    timestamp: new Date().toISOString(),
  });
});

// ALSO try health check at /api in case that's where Rork mounts
app.get("/api", (c) => {
  console.log("✅ Health check hit at /api");
  return c.json({
    status: "ok",
    service: "AvisoNews API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    message: "Server is running at /api",
  });
});

// ARTICLES ROUTES - Try every possible path
app.get("/articles", (c) => {
  console.log("📰 GET /articles - Handler called!");
  try {
    const category = c.req.query("category");
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = parseInt(c.req.query("offset") || "0");
    const featured = c.req.query("featured") === "true";
    const breaking = c.req.query("breaking") === "true";

    console.log(`📰 Query params: category=${category}, limit=${limit}, offset=${offset}`);
    
    const articles = getArticles({
      category,
      limit,
      offset,
      featured,
      breaking,
    });

    console.log(`✅ Returning ${articles.length} articles from store`);
    return c.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("❌ Error in /articles:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/api/articles", (c) => {
  console.log("📰 GET /api/articles - Handler called!");
  try {
    const category = c.req.query("category");
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = parseInt(c.req.query("offset") || "0");
    const featured = c.req.query("featured") === "true";
    const breaking = c.req.query("breaking") === "true";

    console.log(`📰 Query params: category=${category}, limit=${limit}, offset=${offset}`);
    
    const articles = getArticles({
      category,
      limit,
      offset,
      featured,
      breaking,
    });

    console.log(`✅ Returning ${articles.length} articles from /api/articles`);
    return c.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("❌ Error in /api/articles:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Other article routes
app.get("/articles/:id", (c) => {
  const id = c.req.param("id");
  const article = getArticleById(id);
  if (!article) {
    return c.json({ success: false, error: "Article not found" }, 404);
  }
  return c.json({ success: true, data: article });
});

app.get("/api/articles/:id", (c) => {
  const id = c.req.param("id");
  const article = getArticleById(id);
  if (!article) {
    return c.json({ success: false, error: "Article not found" }, 404);
  }
  return c.json({ success: true, data: article });
});

app.post("/articles/:id/view", async (c) => {
  incrementViewCount(c.req.param("id"));
  return c.json({ success: true });
});

app.post("/api/articles/:id/view", async (c) => {
  incrementViewCount(c.req.param("id"));
  return c.json({ success: true });
});

app.get("/articles/search", (c) => {
  const query = c.req.query("q");
  const limit = parseInt(c.req.query("limit") || "20");
  if (!query || query.length < 1) {
    return c.json({ success: false, error: "Query parameter 'q' is required" }, 400);
  }
  const results = searchArticles(query, limit);
  return c.json({ success: true, data: results, count: results.length });
});

app.get("/api/articles/search", (c) => {
  const query = c.req.query("q");
  const limit = parseInt(c.req.query("limit") || "20");
  if (!query || query.length < 1) {
    return c.json({ success: false, error: "Query parameter 'q' is required" }, 400);
  }
  const results = searchArticles(query, limit);
  return c.json({ success: true, data: results, count: results.length });
});

app.get("/articles/:id/related", (c) => {
  const id = c.req.param("id");
  const limit = parseInt(c.req.query("limit") || "3");
  const related = getRelatedArticles(id, limit);
  return c.json({ success: true, data: related });
});

app.get("/api/articles/:id/related", (c) => {
  const id = c.req.param("id");
  const limit = parseInt(c.req.query("limit") || "3");
  const related = getRelatedArticles(id, limit);
  return c.json({ success: true, data: related });
});

// CATEGORIES ROUTES - Try every possible path
app.get("/categories", (c) => {
  console.log("📂 GET /categories - Handler called!");
  try {
    const categories = getCategories();
    console.log(`✅ Returning ${categories.length} categories from store`);
    return c.json({ success: true, data: categories });
  } catch (error) {
    console.error("❌ Error in /categories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/api/categories", (c) => {
  console.log("📂 GET /api/categories - Handler called!");
  try {
    const categories = getCategories();
    console.log(`✅ Returning ${categories.length} categories from /api/categories`);
    return c.json({ success: true, data: categories });
  } catch (error) {
    console.error("❌ Error in /api/categories:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.get("/categories/:slug", (c) => {
  const slug = c.req.param("slug");
  const category = getCategoryBySlug(slug);
  if (!category) {
    return c.json({ success: false, error: "Category not found" }, 404);
  }
  return c.json({ success: true, data: category });
});

app.get("/api/categories/:slug", (c) => {
  const slug = c.req.param("slug");
  const category = getCategoryBySlug(slug);
  if (!category) {
    return c.json({ success: false, error: "Category not found" }, 404);
  }
  return c.json({ success: true, data: category });
});

app.get("/sources", (c) => {
  const sources = getSources();
  return c.json({ success: true, data: sources });
});

app.get("/api/sources", (c) => {
  const sources = getSources();
  return c.json({ success: true, data: sources });
});

app.post("/admin/update", async (c) => {
  try {
    const result = await forceUpdate();
    return c.json({
      success: result.success,
      message: result.success ? `Updated ${result.count} articles` : "Update failed",
      count: result.count,
    });
  } catch (error) {
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

app.post("/api/admin/update", async (c) => {
  try {
    const result = await forceUpdate();
    return c.json({
      success: result.success,
      message: result.success ? `Updated ${result.count} articles` : "Update failed",
      count: result.count,
    });
  } catch (error) {
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

app.get("/stats", (c) => {
  const stats = getStoreStats();
  return c.json({ success: true, data: stats });
});

app.get("/api/stats", (c) => {
  const stats = getStoreStats();
  return c.json({ success: true, data: stats });
});

// Catch-all route handler - matches ANY path to see what's being requested
app.all("*", async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;
  
  // If it's already handled, skip
  if (path === "/" || path.startsWith("/articles") || path.startsWith("/categories") || path.startsWith("/sources") || path.startsWith("/api") || path.startsWith("/test") || path.startsWith("/stats") || path.startsWith("/admin")) {
    return next();
  }
  
  console.error(`\n❌ === UNHANDLED ROUTE ===`);
  console.error(`   Method: ${method}`);
  console.error(`   Path: ${path}`);
  console.error(`   Full URL: ${c.req.url}`);
  console.error(`   Query: ${JSON.stringify(c.req.query())}`);
  console.error(`========================\n`);
  
  return next();
});

// Catch-all 404 handler with EXTENSIVE logging
app.notFound((c) => {
  console.error(`\n❌ === 404 NOT FOUND ===`);
  console.error(`   Method: ${c.req.method}`);
  console.error(`   Path: ${c.req.path}`);
  console.error(`   Full URL: ${c.req.url}`);
  console.error(`   Raw Path: ${c.req.raw.path}`);
  console.error(`   Headers:`, Object.fromEntries(c.req.header()));
  console.error(`   All registered routes should be listed above`);
  console.error(`========================\n`);
  
  return c.json({ 
    success: false, 
    error: "Endpoint not found",
    path: c.req.path,
    rawPath: c.req.raw.path,
    method: c.req.method,
    url: c.req.url,
    hint: "Check server logs to see registered routes",
    registeredRoutes: [
      "GET /",
      "GET /api",
      "GET /test",
      "GET /api/test",
      "GET /articles",
      "GET /api/articles",
      "GET /categories",
      "GET /api/categories",
      "GET /sources",
      "GET /api/sources",
    ],
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`\n❌ === SERVER ERROR ===`);
  console.error(`   Path: ${c.req.path}`);
  console.error(`   Error: ${err.message}`);
  console.error(`   Stack: ${err.stack}`);
  console.error(`=====================\n`);
  
  return c.json(
    { success: false, error: err.message || "Internal server error" },
    500
  );
});

// Log all registered routes on startup
console.log("\n✅ === HONO APP CONFIGURED ===");
console.log("Registered routes:");
console.log("  GET  /");
console.log("  GET  /api");
console.log("  GET  /test");
console.log("  GET  /api/test");
console.log("  GET  /articles");
console.log("  GET  /api/articles");
console.log("  GET  /categories");
console.log("  GET  /api/categories");
console.log("  GET  /sources");
console.log("  GET  /api/sources");
console.log("===========================\n");

export default app;
