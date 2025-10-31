// News Initializer - Fetches real news on startup to replace mock data
import { fetchNews } from "./newsFetcher";
import { addArticlesToStore } from "@/backend/trpc/routes/news/articles/route";

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
      console.warn("⚠️ No articles fetched. Using fallback sources...");
    }

    initialized = true;
  } catch (error) {
    console.error("❌ Error initializing news store:", error);
    // Continue anyway - the store will have mock data as fallback
    initialized = true;
  }
}

/**
 * Force re-initialization (useful for manual refresh)
 */
export function resetInitialization(): void {
  initialized = false;
}

