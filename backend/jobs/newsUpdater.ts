// Background job for automatic news updates
// Enhanced with smart scheduling and better error handling

import { aggregateNews } from "../services/newsAggregator";
import { addArticles, replaceArticles } from "../store/newsStore";
import { GLOBAL_NEWS_SOURCES } from "../services/newsAggregator";

let updateInterval: NodeJS.Timeout | null = null;
let isUpdating = false;
let lastUpdateTime: Date | null = null;
let updateStats = {
  totalUpdates: 0,
  successfulUpdates: 0,
  failedUpdates: 0,
  totalArticlesFetched: 0,
};

/**
 * Start automatic news updates with smart interval based on source priorities
 */
export function startAutoUpdate(baseIntervalMinutes = 10): void {
  console.log(`🔄 Starting automatic news updates (base interval: ${baseIntervalMinutes} minutes)`);

  // Initial fetch (non-blocking)
  setTimeout(() => {
    updateNews();
  }, 2000); // Wait 2 seconds after server start

  // Set up interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  // Smart interval: update every baseIntervalMinutes, but adjust based on priority sources
  const intervalMs = baseIntervalMinutes * 60 * 1000;
  
  updateInterval = setInterval(() => {
    updateNews();
  }, intervalMs);

  // Log statistics periodically
  setInterval(() => {
    logUpdateStats();
  }, 60 * 60 * 1000); // Every hour
}

/**
 * Log update statistics
 */
function logUpdateStats(): void {
  console.log(`\n📊 News Update Statistics:`);
  console.log(`   Total updates: ${updateStats.totalUpdates}`);
  console.log(`   Successful: ${updateStats.successfulUpdates}`);
  console.log(`   Failed: ${updateStats.failedUpdates}`);
  console.log(`   Total articles fetched: ${updateStats.totalArticlesFetched}`);
  console.log(`   Success rate: ${updateStats.totalUpdates > 0 ? ((updateStats.successfulUpdates / updateStats.totalUpdates) * 100).toFixed(1) : 0}%`);
  if (lastUpdateTime) {
    console.log(`   Last update: ${lastUpdateTime.toISOString()}`);
  }
  console.log(``);
}

/**
 * Stop automatic updates
 */
export function stopAutoUpdate(): void {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log("⏹️ Stopped automatic news updates");
  }
}

/**
 * Update news from all sources with enhanced logging and statistics
 */
async function updateNews(): Promise<void> {
  if (isUpdating) {
    console.log("⏳ News update already in progress, skipping...");
    return;
  }

  isUpdating = true;
  updateStats.totalUpdates++;
  const startTime = Date.now();

  try {
    console.log(`\n🔄 [${new Date().toISOString()}] Starting news update...`);
    console.log(`   Active sources: ${GLOBAL_NEWS_SOURCES.filter(s => s.active).length}`);
    
    const articles = await aggregateNews();

    if (articles.length > 0) {
      // Add new articles (deduplication handled in addArticles)
      const beforeCount = articles.length;
      addArticles(articles);
      
      updateStats.successfulUpdates++;
      updateStats.totalArticlesFetched += beforeCount;
      lastUpdateTime = new Date();
      
      console.log(`✅ News update complete: ${beforeCount} articles processed`);
    } else {
      console.warn("⚠️ No articles fetched in this update");
      updateStats.failedUpdates++;
    }
  } catch (error: any) {
    console.error(`❌ Error updating news:`, error.message);
    updateStats.failedUpdates++;
  } finally {
    isUpdating = false;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Update completed in ${duration}s\n`);
  }
}

/**
 * Force immediate update
 */
export async function forceUpdate(): Promise<{ success: boolean; count: number }> {
  try {
    console.log("🔄 Force update triggered...");
    const articles = await aggregateNews();
    
    if (articles.length > 0) {
      // For force update, replace all (full refresh)
      replaceArticles(articles);
      console.log(`✅ Force update complete: ${articles.length} articles`);
      return { success: true, count: articles.length };
    }
    
    return { success: false, count: 0 };
  } catch (error) {
    console.error("❌ Force update failed:", error);
    return { success: false, count: 0 };
  }
}

/**
 * Get update statistics
 */
export function getUpdateStats() {
  return {
    ...updateStats,
    lastUpdateTime,
    isUpdating,
  };
}

// Auto-start on module load (when server starts)
if (typeof process !== "undefined") {
  // Start with 10 minute intervals for balanced updates
  // High-priority sources (priority 10) will get fresh content regularly
  startAutoUpdate(10);
  console.log("✅ Auto-update job initialized");
}

