// News Initializer - Fetches real news on startup to replace mock data
import { fetchNews } from "./newsFetcher";
import { addArticlesToStore } from "@/backend/trpc/routes/news/articles/route";
import { generateFallbackArticles } from "./simpleNewsFetcher";

let initialized = false;

/**
 * Initialize the articles store with real news
 * This should be called on server startup or when articles are first requested
 */
export async function initializeNewsStore(): Promise<void> {
  if (initialized) {
    return;
  }

  try {
    console.log("🚀 Initializing news store with real news data...");

    // Fetch from multiple sources to get diverse content
    // Using RSS feeds from reliable news sources that work without API keys
    const sources = [
      {
        sourceId: "bbc-news",
        sourceName: "BBC News",
        apiType: "rss" as const,
        feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
        category: "world",
      },
      {
        sourceId: "techcrunch",
        sourceName: "TechCrunch",
        apiType: "rss" as const,
        feedUrl: "https://techcrunch.com/feed/",
        category: "tech",
      },
      {
        sourceId: "reuters",
        sourceName: "Reuters",
        apiType: "rss" as const,
        feedUrl: "https://www.reuters.com/rssFeed/worldNews",
        category: "world",
      },
      {
        sourceId: "google-tech",
        sourceName: "Google Tech News",
        apiType: "googlenews" as const,
        category: "technology",
      },
      {
        sourceId: "google-business",
        sourceName: "Google Business News",
        apiType: "googlenews" as const,
        category: "business",
      },
    ];

    // Fetch from all sources in parallel
    const fetchPromises = sources.map((source) =>
      fetchNews({
        ...source,
        keywords: [],
        excludeKeywords: ["sponsored", "advertisement"],
      }).catch((error) => {
        console.error(`Error fetching from ${source.sourceName}:`, error);
        return [];
      })
    );

    const results = await Promise.all(fetchPromises);
    const allArticles = results.flat();

    // Remove duplicates by URL
    const uniqueArticles = allArticles.reduce((acc, article) => {
      if (!acc.find((a) => a.canonicalUrl === article.canonicalUrl)) {
        acc.push(article);
      }
      return acc;
    }, [] as typeof allArticles);

    // Add articles to store
    if (uniqueArticles.length > 0) {
      addArticlesToStore(uniqueArticles);
      console.log(`✅ Successfully loaded ${uniqueArticles.length} real news articles`);
    } else {
      console.warn("⚠️ No articles fetched from RSS feeds. Will try alternative sources...");
      // Try a simpler direct fetch without proxy
      await tryDirectRSSFetch();
      
      // If still no articles, use generated fallback articles
      const store = await import("@/backend/trpc/routes/news/articles/route");
      const currentCount = store.getArticlesStore().length;
      if (currentCount === 0) {
        const fallbackArticles = generateFallbackArticles();
        addArticlesToStore(fallbackArticles);
        console.log(`✅ Added ${fallbackArticles.length} fallback articles to ensure app has content`);
      }
    }

    initialized = true;
  } catch (error) {
    console.error("❌ Error initializing news store:", error);
    console.error("Full error:", error instanceof Error ? error.message : String(error));
    // Try alternative approach
    try {
      await tryDirectRSSFetch();
      
      // Check if we got any articles from direct fetch
      const store = await import("@/backend/trpc/routes/news/articles/route");
      const currentCount = store.getArticlesStore().length;
      
      // If still no articles, use generated fallback
      if (currentCount === 0) {
        const fallbackArticles = generateFallbackArticles();
        addArticlesToStore(fallbackArticles);
        console.log(`✅ Added ${fallbackArticles.length} fallback articles after error`);
      }
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);
      // Last resort: add fallback articles
      const store = await import("@/backend/trpc/routes/news/articles/route");
      const currentCount = store.getArticlesStore().length;
      if (currentCount === 0) {
        const fallbackArticles = generateFallbackArticles();
        addArticlesToStore(fallbackArticles);
        console.log(`✅ Added ${fallbackArticles.length} fallback articles as last resort`);
      }
    }
    initialized = true;
  }
}

/**
 * Try fetching from RSS feeds directly (for environments where CORS proxy doesn't work)
 */
async function tryDirectRSSFetch(): Promise<void> {
  try {
    console.log("🔄 Trying direct RSS fetch...");
    const { fetchNews } = await import("./newsFetcher");
    
    // Try fetching just from BBC which is reliable
    const articles = await fetchNews({
      sourceId: "bbc-direct",
      sourceName: "BBC News",
      apiType: "rss",
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      category: "world",
    });
    
    if (articles.length > 0) {
      const { addArticlesToStore } = await import("@/backend/trpc/routes/news/articles/route");
      addArticlesToStore(articles);
      console.log(`✅ Direct fetch successful: ${articles.length} articles`);
    }
  } catch (error) {
    console.error("Direct RSS fetch failed:", error);
  }
}

/**
 * Force re-initialization (useful for manual refresh)
 */
export function resetInitialization(): void {
  initialized = false;
}

