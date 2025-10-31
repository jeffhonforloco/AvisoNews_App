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

// Health check
app.get("/", (c) => {
  return c.json({
    status: "ok",
    service: "AvisoNews API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
// NOTE: Rork mounts the server at /api, so routes should NOT include /api prefix

// Articles
app.get("/articles", (c) => {
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

app.post("/articles/:id/view", async (c) => {
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

app.get("/articles/:id/related", (c) => {
  const id = c.req.param("id");
  const limit = parseInt(c.req.query("limit") || "3");
  const related = getRelatedArticles(id, limit);
  return c.json({ success: true, data: related });
});

// Categories
app.get("/categories", (c) => {
  const categories = getCategories();
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

// Sources
app.get("/sources", (c) => {
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

app.get("/stats", (c) => {
  const stats = getStoreStats();
  return c.json({ success: true, data: stats });
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: "Endpoint not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json(
    { success: false, error: err.message || "Internal server error" },
    500
  );
});

export default app;

