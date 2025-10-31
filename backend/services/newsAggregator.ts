// Industry-Standard News Aggregator Service
// Integrates multiple open-source news APIs and RSS feeds for global news coverage

import { Article } from "@/types/news";

export interface NewsSource {
  id: string;
  name: string;
  type: "rss" | "newsapi" | "newsdata" | "googlenews";
  url?: string;
  apiKey?: string;
  category?: string;
  country?: string;
  language?: string;
  active: boolean;
  priority: number; // Higher priority = fetch more frequently
}

// Global news sources - industry standard RSS feeds
export const GLOBAL_NEWS_SOURCES: NewsSource[] = [
  // International News
  {
    id: "bbc-world",
    name: "BBC News",
    type: "rss",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "world",
    language: "en",
    active: true,
    priority: 10,
  },
  {
    id: "reuters-world",
    name: "Reuters World",
    type: "rss",
    url: "https://www.reuters.com/world",
    category: "world",
    language: "en",
    active: true,
    priority: 10,
  },
  {
    id: "ap-news",
    name: "Associated Press",
    type: "rss",
    url: "https://feeds.apnews.com/rss/topnews",
    category: "world",
    language: "en",
    active: true,
    priority: 9,
  },
  {
    id: "cnn-world",
    name: "CNN World",
    type: "rss",
    url: "http://rss.cnn.com/rss/edition.rss",
    category: "world",
    language: "en",
    active: true,
    priority: 8,
  },
  // Technology
  {
    id: "techcrunch",
    name: "TechCrunch",
    type: "rss",
    url: "https://techcrunch.com/feed",
    category: "technology",
    language: "en",
    active: true,
    priority: 9,
  },
  {
    id: "the-verge",
    name: "The Verge",
    type: "rss",
    url: "https://www.theverge.com/rss/index.xml",
    category: "technology",
    language: "en",
    active: true,
    priority: 8,
  },
  // Business
  {
    id: "bloomberg",
    name: "Bloomberg",
    type: "rss",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    category: "business",
    language: "en",
    active: true,
    priority: 9,
  },
  {
    id: "financial-times",
    name: "Financial Times",
    type: "rss",
    url: "https://www.ft.com/?format=rss",
    category: "business",
    language: "en",
    active: true,
    priority: 8,
  },
  // Science
  {
    id: "scientific-american",
    name: "Scientific American",
    type: "rss",
    url: "https://rss.sciam.com/ScientificAmerican-News",
    category: "science",
    language: "en",
    active: true,
    priority: 7,
  },
  // Sports
  {
    id: "espn",
    name: "ESPN",
    type: "rss",
    url: "https://www.espn.com/espn/rss/news",
    category: "sports",
    language: "en",
    active: true,
    priority: 7,
  },
];

/**
 * Fetch articles from RSS feed
 */
async function fetchFromRSS(source: NewsSource): Promise<Article[]> {
  if (!source.url) return [];

  try {
    // Try direct fetch first
    let response = await fetch(source.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AvisoNews/1.0)",
      },
    });

    // If CORS fails, try with CORS proxy
    if (!response.ok) {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }

    const data = await response.json();
    const items = data.items || data.entry || [];

    return items.slice(0, 20).map((item: any, index: number) => {
      const articleId = `${source.id}-${Date.now()}-${index}`;
      const title = item.title || item.title?.trim() || "Untitled";
      const link = item.link || item.id || item.url || "";
      const description = item.description || item.summary || item.content || "";
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
      
      // Extract image
      let imageUrl = "";
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      } else if (item["media:content"]?.url) {
        imageUrl = item["media:content"].url;
      } else if (item.thumbnail) {
        imageUrl = item.thumbnail;
      } else if (description.includes("<img")) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      return {
        id: articleId,
        sourceId: source.id,
        sourceName: source.name,
        category: source.category || "general",
        title,
        excerpt: description.substring(0, 200).replace(/<[^>]*>/g, ""),
        canonicalUrl: link,
        imageUrl,
        publishedAt: pubDate,
        importedAt: new Date().toISOString(),
        status: "published" as const,
        viewCount: 0,
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS from ${source.name}:`, error);
    return [];
  }
}

/**
 * Fetch from NewsAPI.org
 */
async function fetchFromNewsAPI(source: NewsSource): Promise<Article[]> {
  if (!source.apiKey) {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) return [];
    source.apiKey = apiKey;
  }

  try {
    const params = new URLSearchParams({
      apiKey: source.apiKey,
      pageSize: "50",
      sortBy: "publishedAt",
    });

    if (source.category) params.append("category", source.category);
    if (source.country) params.append("country", source.country);
    if (source.language) params.append("language", source.language);

    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) return [];

    const data = await response.json();
    if (data.status !== "ok" || !data.articles) return [];

    return data.articles.slice(0, 20).map((item: any, index: number) => ({
      id: `${source.id}-${Date.now()}-${index}`,
      sourceId: source.id,
      sourceName: item.source?.name || source.name,
      category: source.category || "general",
      title: item.title || "Untitled",
      excerpt: item.description || "",
      canonicalUrl: item.url || "",
      imageUrl: item.urlToImage || "",
      publishedAt: item.publishedAt || new Date().toISOString(),
      importedAt: new Date().toISOString(),
      status: "published" as const,
      viewCount: 0,
    }));
  } catch (error) {
    console.error(`Error fetching from NewsAPI (${source.name}):`, error);
    return [];
  }
}

/**
 * Fetch from Google News RSS
 */
async function fetchFromGoogleNews(source: NewsSource): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      hl: source.language || "en",
      gl: source.country || "US",
      ceid: `${source.country || "US"}:${source.language || "en"}`,
    });

    if (source.category) {
      const topicMap: Record<string, string> = {
        technology: "TECHNOLOGY",
        business: "BUSINESS",
        science: "SCIENCE",
        health: "HEALTH",
        sports: "SPORTS",
        entertainment: "ENTERTAINMENT",
      };
      const topic = topicMap[source.category] || "WORLD";
      params.append("topic", topic);
    }

    const url = `https://news.google.com/rss?${params.toString()}`;
    return await fetchFromRSS({ ...source, url });
  } catch (error) {
    console.error(`Error fetching from Google News:`, error);
    return [];
  }
}

/**
 * Main aggregator function - fetches from all active sources
 */
export async function aggregateNews(sources?: NewsSource[]): Promise<Article[]> {
  const sourcesToFetch = sources || GLOBAL_NEWS_SOURCES.filter((s) => s.active);
  const allArticles: Article[] = [];

  console.log(`📰 Fetching news from ${sourcesToFetch.length} sources...`);

  // Fetch from all sources in parallel
  const fetchPromises = sourcesToFetch.map(async (source) => {
    try {
      let articles: Article[] = [];

      switch (source.type) {
        case "rss":
          articles = await fetchFromRSS(source);
          break;
        case "newsapi":
          articles = await fetchFromNewsAPI(source);
          break;
        case "googlenews":
          articles = await fetchFromGoogleNews(source);
          break;
        default:
          console.warn(`Unknown source type: ${source.type}`);
      }

      if (articles.length > 0) {
        console.log(`✅ ${source.name}: ${articles.length} articles`);
      }
      return articles;
    } catch (error) {
      console.error(`❌ Error fetching from ${source.name}:`, error);
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);
  
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  });

  // Remove duplicates by URL
  const uniqueArticles = allArticles.reduce((acc, article) => {
    if (!acc.find((a) => a.canonicalUrl === article.canonicalUrl)) {
      acc.push(article);
    }
    return acc;
  }, [] as Article[]);

  // Sort by published date (newest first)
  uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  console.log(`✅ Total unique articles fetched: ${uniqueArticles.length}`);
  return uniqueArticles;
}

