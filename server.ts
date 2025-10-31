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

console.log("✅ Server ready for Rork");
export default app;
