// Server entry point for Rork/Expo Server
// Industry-standard REST API server

import app from "./backend/hono";
import { aggregateNews } from "./backend/services/newsAggregator";
import { replaceArticles } from "./backend/store/newsStore";
import { startAutoUpdate } from "./backend/jobs/newsUpdater";

console.log("🚀 AvisoNews Server Starting...");
console.log("📰 Initializing news aggregation...");

// Initialize with news on startup
(async () => {
  try {
    console.log("🔄 Fetching initial news articles...");
    const articles = await aggregateNews();
    
    if (articles.length > 0) {
      replaceArticles(articles);
      console.log(`✅ Initialized with ${articles.length} articles`);
    } else {
      console.warn("⚠️ No articles fetched on startup");
    }

    // Start automatic updates (every 5 minutes)
    startAutoUpdate(5);
    console.log("✅ Auto-update job started (5 minute intervals)");
  } catch (error) {
    console.error("❌ Startup error:", error);
  }
})();

// Verify app is valid before exporting
if (!app) {
  console.error("❌ CRITICAL: Hono app is undefined!");
  throw new Error("Failed to import Hono app");
}

console.log("✅ Server ready for Rork");
console.log("📋 Available routes:");
console.log("   - GET  / (health check)");
console.log("   - GET  /articles");
console.log("   - GET  /api/articles");
console.log("   - GET  /categories");
console.log("   - GET  /api/categories");
console.log("   - GET  /sources");
console.log("   - GET  /api/sources");
console.log("📦 App export type:", typeof app);
console.log("📦 App constructor:", app.constructor?.name || "unknown");

export default app;
