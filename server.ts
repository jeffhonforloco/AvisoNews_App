// Server entry point for Rork/Expo Server
// Industry-standard REST API server

import app from "./backend/hono";
import { aggregateNews } from "./backend/services/newsAggregator";
import { replaceArticles } from "./backend/store/newsStore";
import { startAutoUpdate } from "./backend/jobs/newsUpdater";

// CRITICAL: Export app FIRST before any async operations
// This ensures Rork can mount the server immediately

console.log("🚀 AvisoNews Server Starting...");
console.log("📰 Initializing news aggregation...");

// Verify app is valid BEFORE doing anything async
if (!app) {
  console.error("❌ CRITICAL: Hono app is undefined!");
  throw new Error("Failed to import Hono app");
}

console.log("✅ Server app imported successfully");
console.log("📋 Available routes:");
console.log("   - GET  / (health check)");
console.log("   - GET  /test (test endpoint)");
console.log("   - GET  /api/test (test endpoint)");
console.log("   - GET  /articles");
console.log("   - GET  /api/articles");
console.log("   - GET  /categories");
console.log("   - GET  /api/categories");
console.log("   - GET  /sources");
console.log("   - GET  /api/sources");
console.log("📦 App export type:", typeof app);
console.log("📦 App constructor:", app.constructor?.name || "unknown");
console.log("✅ Server ready for Rork - exporting app NOW");

// Initialize with news on startup (non-blocking)
// This runs AFTER the app is exported
(async () => {
  try {
    console.log("🔄 Fetching initial news articles (async)...");
    const articles = await aggregateNews();
    
    if (articles.length > 0) {
      replaceArticles(articles);
      console.log(`✅ Initialized with ${articles.length} articles`);
    } else {
      console.warn("⚠️ No articles fetched on startup");
    }

    // Start automatic updates (every 10 minutes for optimal balance)
    // Note: newsUpdater.ts also auto-starts, but we can override the interval here
    startAutoUpdate(10);
    console.log("✅ Auto-update job started (10 minute intervals)");
  } catch (error) {
    console.error("❌ Startup error (non-blocking):", error);
    // Don't throw - allow server to continue running
  }
})();

// Export immediately - don't wait for async operations
export default app;
