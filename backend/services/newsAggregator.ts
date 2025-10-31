// Industry-Standard News Aggregator Service
// Integrates multiple open-source news APIs and RSS feeds for global news coverage
// Enhanced with better error handling, retry logic, and comprehensive news sources

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
  retries?: number; // Number of retries on failure
  timeout?: number; // Request timeout in ms
}

// Enhanced global news sources - comprehensive coverage from open-source APIs and RSS feeds
export const GLOBAL_NEWS_SOURCES: NewsSource[] = [
  // International News - Premium Sources
  {
    id: "bbc-world",
    name: "BBC News",
    type: "rss",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "world",
    language: "en",
    active: true,
    priority: 10,
    retries: 3,
    timeout: 15000,
  },
  {
    id: "bbc-top",
    name: "BBC Top Stories",
    type: "rss",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    category: "world",
    language: "en",
    active: true,
    priority: 10,
    retries: 3,
  },
  {
    id: "reuters-world",
    name: "Reuters World News",
    type: "rss",
    url: "https://www.reuters.com/rssFeed/worldNews",
    category: "world",
    language: "en",
    active: true,
    priority: 10,
    retries: 3,
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
    retries: 2,
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
    retries: 2,
  },
  {
    id: "guardian-world",
    name: "The Guardian World",
    type: "rss",
    url: "https://www.theguardian.com/world/rss",
    category: "world",
    language: "en",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "al-jazeera",
    name: "Al Jazeera",
    type: "rss",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    category: "world",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  
  // Technology - Comprehensive Coverage
  {
    id: "techcrunch",
    name: "TechCrunch",
    type: "rss",
    url: "https://techcrunch.com/feed",
    category: "technology",
    language: "en",
    active: true,
    priority: 9,
    retries: 2,
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
    retries: 2,
  },
  {
    id: "wired",
    name: "Wired",
    type: "rss",
    url: "https://www.wired.com/feed/rss",
    category: "technology",
    language: "en",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "ars-technica",
    name: "Ars Technica",
    type: "rss",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "technology",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  {
    id: "engadget",
    name: "Engadget",
    type: "rss",
    url: "https://www.engadget.com/rss.xml",
    category: "technology",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  
  // Business & Finance
  {
    id: "bloomberg",
    name: "Bloomberg",
    type: "rss",
    url: "https://feeds.bloomberg.com/markets/news.rss",
    category: "business",
    language: "en",
    active: true,
    priority: 9,
    retries: 2,
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
    retries: 2,
  },
  {
    id: "cnbc",
    name: "CNBC",
    type: "rss",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "business",
    language: "en",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "reuters-business",
    name: "Reuters Business",
    type: "rss",
    url: "https://www.reuters.com/rssFeed/businessNews",
    category: "business",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  
  // Science & Health
  {
    id: "scientific-american",
    name: "Scientific American",
    type: "rss",
    url: "https://rss.sciam.com/ScientificAmerican-News",
    category: "science",
    language: "en",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "nature",
    name: "Nature",
    type: "rss",
    url: "https://www.nature.com/nature.rss",
    category: "science",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  {
    id: "science-daily",
    name: "Science Daily",
    type: "rss",
    url: "https://www.sciencedaily.com/rss/all.xml",
    category: "science",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  {
    id: "medical-news",
    name: "Medical News Today",
    type: "rss",
    url: "https://www.medicalnewstoday.com/rss",
    category: "health",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
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
    priority: 8,
    retries: 2,
  },
  {
    id: "bbc-sport",
    name: "BBC Sport",
    type: "rss",
    url: "https://feeds.bbci.co.uk/sport/rss.xml",
    category: "sports",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  
  // Entertainment
  {
    id: "variety",
    name: "Variety",
    type: "rss",
    url: "https://variety.com/feed",
    category: "entertainment",
    language: "en",
    active: true,
    priority: 7,
    retries: 2,
  },
  {
    id: "hollywood-reporter",
    name: "The Hollywood Reporter",
    type: "rss",
    url: "https://www.hollywoodreporter.com/feed",
    category: "entertainment",
    language: "en",
    active: true,
    priority: 6,
    retries: 2,
  },
  
  // NewsAPI.org (if API key is provided)
  {
    id: "newsapi-headlines",
    name: "NewsAPI Top Headlines",
    type: "newsapi",
    category: "general",
    language: "en",
    country: "us",
    active: !!process.env.NEWSAPI_KEY,
    priority: 9,
    retries: 2,
    apiKey: process.env.NEWSAPI_KEY,
  },
  {
    id: "newsapi-tech",
    name: "NewsAPI Technology",
    type: "newsapi",
    category: "technology",
    language: "en",
    active: !!process.env.NEWSAPI_KEY,
    priority: 8,
    retries: 2,
    apiKey: process.env.NEWSAPI_KEY,
  },
  {
    id: "newsapi-business",
    name: "NewsAPI Business",
    type: "newsapi",
    category: "business",
    language: "en",
    active: !!process.env.NEWSAPI_KEY,
    priority: 8,
    retries: 2,
    apiKey: process.env.NEWSAPI_KEY,
  },
  
  // NewsData.io (if API key is provided)
  {
    id: "newsdata-top",
    name: "NewsData.io Top",
    type: "newsdata",
    category: "general",
    language: "en",
    active: !!process.env.NEWSDATA_KEY,
    priority: 8,
    retries: 2,
    apiKey: process.env.NEWSDATA_KEY,
  },
  
  // Google News RSS (no API key needed)
  {
    id: "googlenews-tech",
    name: "Google News Technology",
    type: "googlenews",
    category: "technology",
    language: "en",
    country: "us",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "googlenews-business",
    name: "Google News Business",
    type: "googlenews",
    category: "business",
    language: "en",
    country: "us",
    active: true,
    priority: 8,
    retries: 2,
  },
  {
    id: "googlenews-science",
    name: "Google News Science",
    type: "googlenews",
    category: "science",
    language: "en",
    country: "us",
    active: true,
    priority: 7,
    retries: 2,
  },
];

/**
 * Enhanced RSS parser with retry logic and better error handling
 */
async function fetchFromRSS(source: NewsSource, retryCount = 0): Promise<Article[]> {
  if (!source.url) return [];

  const maxRetries = source.retries || 2;
  const timeout = source.timeout || 10000;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Try direct fetch first
    let response: Response | null = null;
    try {
      response = await fetch(source.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If direct fetch fails, try RSS2JSON proxy
      if (fetchError.name === 'AbortError' || !response || !response.ok) {
        console.log(`⚠️ Direct fetch failed for ${source.name}, trying RSS2JSON proxy...`);
        try {
          const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
          response = await fetch(proxyUrl, {
            signal: controller.signal,
          });
        } catch (proxyError: any) {
          throw new Error(`Both direct fetch and proxy failed: ${fetchError.message}`);
        }
      } else {
        throw fetchError;
      }
    }
    
    if (!response) {
      throw new Error("No response received");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Parse response - try JSON first (RSS2JSON), then XML
    let items: any[] = [];
    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const data = await response.json();
      items = data.items || data.entry || [];
    } else {
      // Parse XML RSS feed
      const text = await response.text();
      items = parseRSSXML(text);
    }

    if (items.length === 0) {
      console.warn(`⚠️ No items found in RSS feed: ${source.name}`);
      return [];
    }

    return items.slice(0, 25).map((item: any, index: number) => {
      const timestamp = Date.now();
      const articleId = `${source.id}-${timestamp}-${index}`;
      const title = (item.title || item.title?.trim() || "Untitled").replace(/\[.*?\]/g, "").trim();
      const link = item.link || item.id || item.url || item.guid?.['#text'] || "";
      let description = item.description || item.summary || item.content || item.contentSnippet || "";
      
      // Clean HTML from description
      description = description.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
      
      const pubDate = item.pubDate || item.published || item.updated || item.isoDate || new Date().toISOString();
      
      // Enhanced image extraction
      let imageUrl = "";
      
      // Try multiple image sources
      if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith("image/")) {
        imageUrl = item.enclosure.url;
      } else if (item["media:content"]?.url) {
        imageUrl = item["media:content"].url;
      } else if (item["media:thumbnail"]?.url) {
        imageUrl = item["media:thumbnail"].url;
      } else if (item.thumbnail) {
        imageUrl = item.thumbnail;
      } else if (item.image?.url) {
        imageUrl = item.image.url;
      } else {
        // Extract from description HTML
        const imgMatches = [
          description.match(/<img[^>]+src=["']([^"']+)["']/i),
          description.match(/<img[^>]+src=([^\s>]+)/i),
        ];
        
        for (const match of imgMatches) {
          if (match && match[1]) {
            imageUrl = match[1].replace(/^["']|["']$/g, "");
            break;
          }
        }
      }

      // Generate excerpt from description
      const excerpt = description.length > 200 
        ? description.substring(0, 200).trim() + "..."
        : description;

      return {
        id: articleId,
        sourceId: source.id,
        sourceName: source.name,
        source: source.name,
        category: source.category || "general",
        title,
        excerpt,
        summary: excerpt,
        canonicalUrl: link,
        imageUrl: imageUrl || "",
        publishedAt: pubDate,
        importedAt: new Date().toISOString(),
        status: "published" as const,
        viewCount: 0,
        trending: false,
        featured: index < 3, // First 3 articles are featured
      };
    });
  } catch (error: any) {
    // Retry logic
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 Retrying ${source.name} (attempt ${retryCount + 1}/${maxRetries}) after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFromRSS(source, retryCount + 1);
    }
    
    console.error(`❌ Error fetching RSS from ${source.name} after ${maxRetries} attempts:`, error.message);
    return [];
  }
}

/**
 * Simple RSS XML parser (fallback when JSON parsing fails)
 */
function parseRSSXML(xml: string): any[] {
  try {
    const items: any[] = [];
    
    // Extract items using regex (simple parser)
    const itemMatches = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/gi);
    if (!itemMatches) return [];

    for (const itemXml of itemMatches) {
      const item: any = {};
      
      // Extract title
      const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) item.title = titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
      
      // Extract link
      const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
      if (linkMatch) item.link = linkMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
      
      // Extract description
      const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
      if (descMatch) item.description = descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
      
      // Extract pubDate
      const dateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      if (dateMatch) item.pubDate = dateMatch[1].trim();
      
      // Extract image from enclosure or media:content
      const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
      if (enclosureMatch) item.enclosure = { url: enclosureMatch[1] };
      
      const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
      if (mediaMatch) item["media:content"] = { url: mediaMatch[1] };
      
      if (item.title || item.link) {
        items.push(item);
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error parsing RSS XML:", error);
    return [];
  }
}

/**
 * Fetch from NewsAPI.org with retry logic
 */
async function fetchFromNewsAPI(source: NewsSource, retryCount = 0): Promise<Article[]> {
  const apiKey = source.apiKey || process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.warn(`⚠️ NewsAPI key not configured for ${source.name}`);
    return [];
  }

  const maxRetries = source.retries || 2;

  try {
    const params = new URLSearchParams({
      apiKey: apiKey,
      pageSize: "50",
      sortBy: "publishedAt",
    });

    if (source.category && source.category !== "general") {
      params.append("category", source.category);
    }
    if (source.country) params.append("country", source.country);
    if (source.language) params.append("language", source.language);

    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AvisoNews/2.0",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`⚠️ NewsAPI rate limit hit for ${source.name}`);
        return [];
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== "ok" || !data.articles) {
      console.warn(`⚠️ NewsAPI returned no articles for ${source.name}`);
      return [];
    }

    return data.articles.slice(0, 30).map((item: any, index: number) => ({
      id: `${source.id}-${Date.now()}-${index}`,
      sourceId: source.id,
      sourceName: item.source?.name || source.name,
      source: item.source?.name || source.name,
      category: source.category || "general",
      title: (item.title || "Untitled").replace(/\[.*?\]/g, "").trim(),
      excerpt: (item.description || "").substring(0, 200),
      summary: item.description || "",
      canonicalUrl: item.url || "",
      imageUrl: item.urlToImage || "",
      publishedAt: item.publishedAt || new Date().toISOString(),
      importedAt: new Date().toISOString(),
      status: "published" as const,
      viewCount: 0,
      featured: index < 3,
      trending: false,
    }));
  } catch (error: any) {
    // Retry logic
    if (retryCount < maxRetries && !error.message?.includes("429")) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`🔄 Retrying NewsAPI ${source.name} (attempt ${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFromNewsAPI(source, retryCount + 1);
    }
    
    console.error(`❌ Error fetching from NewsAPI (${source.name}):`, error.message);
    return [];
  }
}

/**
 * Fetch from NewsData.io API
 */
async function fetchFromNewsData(source: NewsSource, retryCount = 0): Promise<Article[]> {
  const apiKey = source.apiKey || process.env.NEWSDATA_KEY;
  if (!apiKey) {
    console.warn(`⚠️ NewsData.io key not configured for ${source.name}`);
    return [];
  }

  const maxRetries = source.retries || 2;

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      language: source.language || "en",
    });

    if (source.category && source.category !== "general") {
      params.append("category", source.category);
    }
    if (source.country) params.append("country", source.country);

    const url = `https://newsdata.io/api/1/news?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AvisoNews/2.0",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`⚠️ NewsData.io rate limit hit for ${source.name}`);
        return [];
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== "success" || !data.results) {
      console.warn(`⚠️ NewsData.io returned no articles for ${source.name}`);
      return [];
    }

    return data.results.slice(0, 30).map((item: any, index: number) => ({
      id: `${source.id}-${Date.now()}-${index}`,
      sourceId: source.id,
      sourceName: item.source_name || source.name,
      source: item.source_name || source.name,
      category: source.category || item.category?.[0] || "general",
      title: (item.title || "Untitled").replace(/\[.*?\]/g, "").trim(),
      excerpt: (item.description || "").substring(0, 200),
      summary: item.description || "",
      canonicalUrl: item.link || item.article_url || "",
      imageUrl: item.image_url || item.image || "",
      publishedAt: item.pubDate || item.publishedAt || new Date().toISOString(),
      importedAt: new Date().toISOString(),
      status: "published" as const,
      viewCount: 0,
      featured: index < 3,
      trending: false,
    }));
  } catch (error: any) {
    // Retry logic
    if (retryCount < maxRetries && !error.message?.includes("429")) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`🔄 Retrying NewsData.io ${source.name} (attempt ${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchFromNewsData(source, retryCount + 1);
    }
    
    console.error(`❌ Error fetching from NewsData.io (${source.name}):`, error.message);
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
        world: "WORLD",
      };
      const topic = topicMap[source.category] || "WORLD";
      params.append("topic", topic);
    } else {
      // Default to top stories if no category
      params.append("topic", "h");
    }

    const url = `https://news.google.com/rss?${params.toString()}`;
    return await fetchFromRSS({ ...source, url });
  } catch (error: any) {
    console.error(`Error fetching from Google News (${source.name}):`, error.message);
    return [];
  }
}

/**
 * Enhanced main aggregator function - fetches from all active sources with better error handling
 */
export async function aggregateNews(sources?: NewsSource[]): Promise<Article[]> {
  const sourcesToFetch = sources || GLOBAL_NEWS_SOURCES.filter((s) => s.active);
  const allArticles: Article[] = [];

  console.log(`📰 Fetching news from ${sourcesToFetch.length} active sources...`);
  console.log(`   Sources: ${sourcesToFetch.map(s => s.name).join(", ")}`);

  const startTime = Date.now();

  // Fetch from all sources in parallel (with batching for rate limiting)
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
        case "newsdata":
          articles = await fetchFromNewsData(source);
          break;
        case "googlenews":
          articles = await fetchFromGoogleNews(source);
          break;
        default:
          console.warn(`⚠️ Unknown source type: ${source.type} for ${source.name}`);
      }

      if (articles.length > 0) {
        console.log(`✅ ${source.name}: ${articles.length} articles`);
      } else {
        console.log(`⚪ ${source.name}: No articles found`);
      }
      return articles;
    } catch (error: any) {
      console.error(`❌ Error fetching from ${source.name}:`, error.message);
      return [];
    }
  });

  // Use Promise.allSettled to handle failures gracefully
  const results = await Promise.allSettled(fetchPromises);
  
  let successCount = 0;
  let failureCount = 0;
  
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
      if (result.value.length > 0) successCount++;
      else failureCount++;
    } else {
      failureCount++;
      console.error(`❌ Source ${sourcesToFetch[index]?.name} failed:`, result.reason);
    }
  });

  console.log(`📊 Fetch summary: ${successCount} succeeded, ${failureCount} failed/no articles`);

  // Remove duplicates by URL (case-insensitive)
  const uniqueArticles = allArticles.reduce((acc, article) => {
    const urlLower = article.canonicalUrl.toLowerCase().trim();
    if (urlLower && !acc.find((a) => a.canonicalUrl.toLowerCase().trim() === urlLower)) {
      acc.push(article);
    }
    return acc;
  }, [] as Article[]);

  // Also remove duplicates by title similarity (if URLs are similar)
  const deduplicated = uniqueArticles.filter((article, index, self) => {
    return index === self.findIndex((a) => {
      // Same URL or very similar titles
      const urlMatch = a.canonicalUrl.toLowerCase() === article.canonicalUrl.toLowerCase();
      const titleSimilarity = a.title.toLowerCase().trim() === article.title.toLowerCase().trim();
      return urlMatch || (titleSimilarity && Math.abs(new Date(a.publishedAt).getTime() - new Date(article.publishedAt).getTime()) < 60000);
    });
  });

  // Sort by published date (newest first)
  deduplicated.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Aggregation complete: ${deduplicated.length} unique articles in ${duration}s`);
  
  return deduplicated;
}

