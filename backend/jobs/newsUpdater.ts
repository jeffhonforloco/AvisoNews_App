// Background job for automatic news updates
// Runs on a schedule to keep news fresh

import { aggregateNews } from "../services/newsAggregator";
import { addArticles, replaceArticles } from "../store/newsStore";

let updateInterval: NodeJS.Timeout | null = null;
let isUpdating = false;

/**
 * Start automatic news updates
 */
export function startAutoUpdate(intervalMinutes = 15): void {
  console.log(`🔄 Starting automatic news updates every ${intervalMinutes} minutes`);

  // Initial fetch
  updateNews();

  // Set up interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(() => {
    updateNews();
  }, intervalMinutes * 60 * 1000);
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
 * Update news from all sources
 */
async function updateNews(): Promise<void> {
  if (isUpdating) {
    console.log("⏳ News update already in progress, skipping...");
    return;
  }

  isUpdating = true;
  const startTime = Date.now();

  try {
    console.log("🔄 Starting news update...");
    const articles = await aggregateNews();

    if (articles.length > 0) {
      // Add new articles (deduplication handled in addArticles)
      addArticles(articles);
      console.log(`✅ News update complete: ${articles.length} articles fetched`);
    } else {
      console.warn("⚠️ No articles fetched in this update");
    }
  } catch (error) {
    console.error("❌ Error updating news:", error);
  } finally {
    isUpdating = false;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Update took ${duration}s`);
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

// Auto-start on module load (when server starts)
if (typeof process !== "undefined") {
  // Start with 5 minute intervals for frequent updates
  startAutoUpdate(5);
}

