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

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Debug middleware - log all incoming requests
app.use("*", async (c, next) => {
  console.log(`📡 Incoming request: ${c.req.method} ${c.req.path}`);
  await next();
});

// Health check - test if server is responding
app.get("/", (c) => {
  console.log("✅ Health check endpoint hit");
  return c.json({
    status: "ok",
    service: "AvisoNews API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    routes: [
      "/articles",
      "/categories",
      "/sources",
      "/stats",
    ],
  });
});

// Try both with and without /api prefix to see what Rork expects
// Rork typically mounts at /api, so routes should be relative to that

// Articles
app.get("/articles", (c) => {
  console.log("📰 GET /articles - fetching articles");
  const category = c.req.query("category");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const featured = c.req.query("featured") === "true";
  const breaking = c.req.query("breaking") === "true";

  const articles = getArticles({
    category,
    limit,
    offset,
    featured,
    breaking,
  });

  console.log(`✅ Returning ${articles.length} articles`);
  return c.json({
    success: true,
    data: articles,
    count: articles.length,
  });
});

// Also try with /api prefix in case Rork doesn't add it
app.get("/api/articles", (c) => {
  console.log("📰 GET /api/articles - fetching articles (with prefix)");
  const category = c.req.query("category");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const featured = c.req.query("featured") === "true";
  const breaking = c.req.query("breaking") === "true";

  const articles = getArticles({
    category,
    limit,
    offset,
    featured,
    breaking,
  });

  console.log(`✅ Returning ${articles.length} articles (with prefix)`);
  return c.json({
    success: true,
    data: articles,
    count: articles.length,
  });
});

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
  const id = c.req.param("id");
  incrementViewCount(id);
  return c.json({ success: true });
});

app.post("/api/articles/:id/view", async (c) => {
  const id = c.req.param("id");
  incrementViewCount(id);
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

// Categories
app.get("/categories", (c) => {
  console.log("📂 GET /categories - fetching categories");
  const categories = getCategories();
  console.log(`✅ Returning ${categories.length} categories`);
  return c.json({ success: true, data: categories });
});

app.get("/api/categories", (c) => {
  console.log("📂 GET /api/categories - fetching categories (with prefix)");
  const categories = getCategories();
  console.log(`✅ Returning ${categories.length} categories (with prefix)`);
  return c.json({ success: true, data: categories });
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

// Sources
app.get("/sources", (c) => {
  const sources = getSources();
  return c.json({ success: true, data: sources });
});

app.get("/api/sources", (c) => {
  const sources = getSources();
  return c.json({ success: true, data: sources });
});

// Admin/Management
app.post("/admin/update", async (c) => {
  try {
    const result = await forceUpdate();
    return c.json({
      success: result.success,
      message: result.success
        ? `Updated ${result.count} articles`
        : "Update failed",
      count: result.count,
    });
  } catch (error) {
    return c.json(
      { success: false, error: (error as Error).message },
      500
    );
  }
});

app.post("/api/admin/update", async (c) => {
  try {
    const result = await forceUpdate();
    return c.json({
      success: result.success,
      message: result.success
        ? `Updated ${result.count} articles`
        : "Update failed",
      count: result.count,
    });
  } catch (error) {
    return c.json(
      { success: false, error: (error as Error).message },
      500
    );
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

// 404 handler with detailed logging
app.notFound((c) => {
  console.error(`❌ 404 - Route not found: ${c.req.method} ${c.req.path}`);
  console.error(`   Full URL: ${c.req.url}`);
  return c.json({ 
    success: false, 
    error: "Endpoint not found",
    path: c.req.path,
    method: c.req.method,
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`❌ API Error [${c.req.path}]:`, err);
  return c.json(
    { success: false, error: err.message || "Internal server error" },
    500
  );
});

console.log("✅ Hono app configured with routes:");
console.log("   GET  /articles");
console.log("   GET  /api/articles");
console.log("   GET  /categories");
console.log("   GET  /api/categories");
console.log("   GET  /sources");
console.log("   GET  /api/sources");

export default app;
