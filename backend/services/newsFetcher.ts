// News Fetcher Service
// Integrates multiple news APIs and RSS feeds for automated news aggregation

import { Article } from "@/types/news";

export interface NewsFetcherConfig {
  sourceId: string;
  sourceName: string;
  apiType: "newsapi" | "rss" | "googlenews" | "newsdata";
  apiKey?: string;
  feedUrl?: string;
  category?: string;
  language?: string;
  country?: string;
  keywords?: string[];
  excludeKeywords?: string[];
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: {
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }[];
}

interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  enclosure?: { url: string };
  media?: { content?: { url: string } };
}

/**
 * Fetch news from NewsAPI.org
 * Free tier: 100 requests/day
 * Get API key from: https://newsapi.org/
 */
export async function fetchFromNewsAPI(config: NewsFetcherConfig): Promise<Article[]> {
  const apiKey = config.apiKey || process.env.NEWSAPI_KEY || "";
  
  if (!apiKey) {
    console.warn("NewsAPI key not configured, skipping NewsAPI fetch");
    return [];
  }

  try {
    const params = new URLSearchParams({
      apiKey,
      pageSize: "50",
      sortBy: "publishedAt",
    });

    if (config.category) {
      params.append("category", config.category);
    }
    if (config.language) {
      params.append("language", config.language);
    }
    if (config.country) {
      params.append("country", config.country);
    }
    if (config.keywords && config.keywords.length > 0) {
      params.append("q", config.keywords.join(" OR "));
    }

    const url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.statusText}`);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status !== "ok") {
      throw new Error("NewsAPI returned error status");
    }

    return data.articles
      .filter((article) => {
        // Filter by exclude keywords
        if (config.excludeKeywords && config.excludeKeywords.length > 0) {
          const titleLower = article.title.toLowerCase();
          const descLower = (article.description || "").toLowerCase();
          return !config.excludeKeywords.some(
            (keyword) => titleLower.includes(keyword.toLowerCase()) || descLower.includes(keyword.toLowerCase())
          );
        }
        return true;
      })
      .map((article, index): Article => ({
        id: `${config.sourceId}-${Date.now()}-${index}`,
        sourceId: config.sourceId,
        sourceName: article.source.name || config.sourceName,
        source: article.source.name || config.sourceName,
        category: config.category || "general",
        title: article.title,
        excerpt: article.description || article.content?.substring(0, 200) || "",
        summary: article.description || article.content?.substring(0, 200) || "",
        canonicalUrl: article.url,
        imageUrl: article.urlToImage || "",
        publishedAt: new Date(article.publishedAt).toISOString(),
        importedAt: new Date().toISOString(),
        status: "draft" as const,
        viewCount: 0,
        readTime: Math.ceil((article.content?.length || 0) / 1000),
        tags: extractTags(article.title, article.description || ""),
      }));
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
}

/**
 * Fetch news from RSS feed
 * Universal, free, works with any RSS feed
 */
export async function fetchFromRSS(config: NewsFetcherConfig): Promise<Article[]> {
  if (!config.feedUrl) {
    console.warn("RSS feed URL not provided");
    return [];
  }

  try {
    // Try direct fetch first (works in Node.js/server environment)
    let xmlText: string;
    let response: Response;
    
    try {
      // Direct fetch (works in server/Node.js environments)
      response = await fetch(config.feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AvisoNews/1.0)',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Direct fetch failed: ${response.statusText}`);
      }
      
      xmlText = await response.text();
    } catch (directError) {
      // Fallback to CORS proxy if direct fetch fails
      console.log(`Direct fetch failed, trying CORS proxy for ${config.sourceName}...`);
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(config.feedUrl)}`;
      response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AvisoNews/1.0)',
        },
      });
      
      if (!response.ok) {
        throw new Error(`RSS fetch error: ${response.statusText}`);
      }

      const data = await response.json();
      xmlText = data.contents;
    }

    // Simple RSS parser (for production, use a proper XML parser like rss-parser)
    const items = parseRSSFeed(xmlText);
    
    if (items.length === 0) {
      console.warn(`⚠️ RSS parser returned 0 items for ${config.sourceName}. XML length: ${xmlText.length}`);
      // Log a sample of the XML to debug
      if (xmlText.length > 0) {
        console.log(`XML sample (first 500 chars): ${xmlText.substring(0, 500)}`);
      }
    } else {
      console.log(`✅ Parsed ${items.length} items from ${config.sourceName} RSS feed`);
    }

    return items
      .filter((item) => {
        if (config.excludeKeywords && config.excludeKeywords.length > 0) {
          const titleLower = item.title.toLowerCase();
          const descLower = (item.description || "").toLowerCase();
          return !config.excludeKeywords.some(
            (keyword) => titleLower.includes(keyword.toLowerCase()) || descLower.includes(keyword.toLowerCase())
          );
        }
        return true;
      })
      .slice(0, 50)
      .map((item, index): Article => ({
        id: `${config.sourceId}-${Date.now()}-${index}`,
        sourceId: config.sourceId,
        sourceName: config.sourceName,
        source: config.sourceName,
        category: config.category || "general",
        title: item.title,
        excerpt: item.description?.substring(0, 200) || "",
        summary: item.description?.substring(0, 200) || "",
        canonicalUrl: item.link,
        imageUrl: item.enclosure?.url || item.media?.content?.url || "",
        publishedAt: new Date(item.pubDate).toISOString(),
        importedAt: new Date().toISOString(),
        status: "draft" as const,
        viewCount: 0,
        readTime: Math.ceil((item.description?.length || 0) / 1000),
        tags: extractTags(item.title, item.description || ""),
      }));
  } catch (error) {
    console.error("Error fetching from RSS:", error);
    return [];
  }
}

/**
 * Fetch news from Google News RSS
 * Free, no API key needed
 */
export async function fetchFromGoogleNews(config: NewsFetcherConfig): Promise<Article[]> {
  try {
    // Build Google News RSS URL
    const params = new URLSearchParams();
    
    // Map our categories to Google News topics
    const topicMap: Record<string, string> = {
      technology: "TECHNOLOGY",
      business: "BUSINESS",
      world: "WORLD",
      science: "SCIENCE",
      health: "HEALTH",
      sports: "SPORTS",
      entertainment: "ENTERTAINMENT",
      general: "WORLD", // Default to world news
    };
    
    if (config.category && topicMap[config.category.toLowerCase()]) {
      params.append("topic", topicMap[config.category.toLowerCase()]);
    }
    
    if (config.keywords && config.keywords.length > 0) {
      params.append("q", config.keywords.join(" "));
    }
    
    params.append("hl", config.language || "en");
    params.append("gl", config.country || "US");
    params.append("ceid", `${config.country || "US"}:${config.language || "en"}`);

    // Use the RSS endpoint
    const feedUrl = `https://news.google.com/rss${params.toString() ? `?${params.toString()}` : ""}`;
    
    return await fetchFromRSS({
      ...config,
      feedUrl,
    });
  } catch (error) {
    console.error("Error fetching from Google News:", error);
    // Try a simpler fallback
    try {
      const fallbackUrl = `https://news.google.com/rss?hl=${config.language || "en"}&gl=${config.country || "US"}&ceid=${config.country || "US"}:${config.language || "en"}`;
      return await fetchFromRSS({
        ...config,
        feedUrl: fallbackUrl,
      });
    } catch (fallbackError) {
      console.error("Fallback Google News fetch also failed:", fallbackError);
      return [];
    }
  }
}

/**
 * Fetch news from NewsData.io
 * Free tier: 200 requests/day
 * Get API key from: https://newsdata.io/
 */
export async function fetchFromNewsData(config: NewsFetcherConfig): Promise<Article[]> {
  const apiKey = config.apiKey || process.env.NEWSDATA_KEY || "";
  
  if (!apiKey) {
    console.warn("NewsData.io key not configured");
    return [];
  }

  try {
    const params = new URLSearchParams({
      apikey: apiKey,
      q: config.keywords?.join(" ") || "",
      language: config.language || "en",
      category: config.category || "top",
    });

    const url = `https://newsdata.io/api/1/news?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsData.io error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
      throw new Error("NewsData.io returned error");
    }

    return (data.results || [])
      .filter((article: any) => {
        if (config.excludeKeywords && config.excludeKeywords.length > 0) {
          const titleLower = article.title?.toLowerCase() || "";
          const descLower = (article.description || "").toLowerCase();
          return !config.excludeKeywords.some(
            (keyword) => titleLower.includes(keyword.toLowerCase()) || descLower.includes(keyword.toLowerCase())
          );
        }
        return true;
      })
      .map((article: any, index: number): Article => ({
        id: `${config.sourceId}-${Date.now()}-${index}`,
        sourceId: config.sourceId,
        sourceName: article.source_id || config.sourceName,
        source: article.source_id || config.sourceName,
        category: article.category?.[0] || config.category || "general",
        title: article.title || "",
        excerpt: article.description || article.content?.substring(0, 200) || "",
        summary: article.description || article.content?.substring(0, 200) || "",
        canonicalUrl: article.link || "",
        imageUrl: article.image_url || "",
        publishedAt: article.pubDate ? new Date(article.pubDate).toISOString() : new Date().toISOString(),
        importedAt: new Date().toISOString(),
        status: "draft" as const,
        viewCount: 0,
        readTime: Math.ceil((article.content?.length || 0) / 1000),
        tags: extractTags(article.title || "", article.description || ""),
      }));
  } catch (error) {
    console.error("Error fetching from NewsData.io:", error);
    return [];
  }
}

/**
 * Main fetcher function that tries multiple sources
 */
export async function fetchNews(config: NewsFetcherConfig): Promise<Article[]> {
  let articles: Article[] = [];

  switch (config.apiType) {
    case "newsapi":
      articles = await fetchFromNewsAPI(config);
      break;
    case "rss":
      if (config.feedUrl) {
        articles = await fetchFromRSS(config);
      }
      break;
    case "googlenews":
      articles = await fetchFromGoogleNews(config);
      break;
    case "newsdata":
      articles = await fetchFromNewsData(config);
      break;
    default:
      // Try multiple sources as fallback
      articles = await fetchFromGoogleNews(config);
      if (articles.length === 0 && config.apiKey) {
        articles = await fetchFromNewsAPI(config);
      }
      break;
  }

  // Deduplicate articles by URL
  const uniqueArticles = articles.reduce((acc, article) => {
    if (!acc.find((a) => a.canonicalUrl === article.canonicalUrl)) {
      acc.push(article);
    }
    return acc;
  }, [] as Article[]);

  return uniqueArticles;
}

/**
 * Simple RSS parser (basic implementation)
 * For production, consider using a proper RSS parser library
 */
function parseRSSFeed(xmlText: string): RSSFeedItem[] {
  const items: RSSFeedItem[] = [];
  
  if (!xmlText || xmlText.length === 0) {
    console.error("❌ Empty XML text received");
    return items;
  }
  
  try {
    // Try multiple patterns to match RSS items (different RSS formats)
    // Pattern 1: Standard RSS <item> tags
    let itemMatches = Array.from(xmlText.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi));
    
    // Pattern 2: Atom feed <entry> tags (if RSS pattern didn't work)
    if (itemMatches.length === 0) {
      itemMatches = Array.from(xmlText.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/gi));
    }
    
    // Pattern 3: Try without angle brackets (in case of encoding issues)
    if (itemMatches.length === 0) {
      itemMatches = Array.from(xmlText.matchAll(/item[^>]*>([\s\S]*?)<\/item/gi));
    }
    
    console.log(`📄 Found ${itemMatches.length} potential items in RSS feed`);
    
    for (const match of itemMatches) {
      const itemContent = match[1];
      
      const title = extractXMLTag(itemContent, "title") || extractXMLTag(itemContent, "title", true);
      const description = extractXMLTag(itemContent, "description") || 
                         extractXMLTag(itemContent, "content:encoded") ||
                         extractXMLTag(itemContent, "summary");
      const link = extractXMLTag(itemContent, "link") || extractXMLTag(itemContent, "link", true);
      const pubDate = extractXMLTag(itemContent, "pubDate") || 
                     extractXMLTag(itemContent, "published") ||
                     extractXMLTag(itemContent, "updated");
      
      // Extract image - try multiple patterns
      let imageUrl: string | undefined;
      const enclosureMatch = itemContent.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
      const mediaMatch = itemContent.match(/<media:content[^>]*url=["']([^"']+)["']/i);
      const mediaThumbMatch = itemContent.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
      
      if (enclosureMatch) imageUrl = enclosureMatch[1];
      else if (mediaMatch) imageUrl = mediaMatch[1];
      else if (mediaThumbMatch) imageUrl = mediaThumbMatch[1];
      
      if (title && link) {
        items.push({
          title: cleanHTML(title),
          description: cleanHTML(description || ""),
          link: cleanHTML(link),
          pubDate: pubDate || new Date().toISOString(),
          enclosure: imageUrl ? { url: imageUrl } : undefined,
          media: imageUrl ? { content: { url: imageUrl } } : undefined,
        });
      } else {
        console.warn(`⚠️ Skipping item: missing title or link. Title: ${!!title}, Link: ${!!link}`);
      }
    }
    
    console.log(`✅ Successfully parsed ${items.length} valid items`);
  } catch (error) {
    console.error("❌ Error parsing RSS feed:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
  }

  return items;
}

function extractXMLTag(content: string, tagName: string, cdata: boolean = false): string | null {
  // Try standard XML tag pattern
  let regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  let match = content.match(regex);
  
  if (!match && cdata) {
    // Try CDATA pattern
    regex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, "i");
    match = content.match(regex);
  }
  
  if (!match) {
    // Try self-closing tag pattern
    regex = new RegExp(`<${tagName}[^>]*/>`, "i");
    match = content.match(regex);
    if (match) return "";
  }
  
  return match ? match[1]?.trim() || "" : null;
}

function cleanHTML(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const commonTags = [
    "technology", "tech", "ai", "artificial intelligence", "machine learning",
    "business", "finance", "economy", "stock market",
    "health", "medical", "science", "research",
    "politics", "government", "policy",
    "sports", "football", "basketball", "soccer",
    "entertainment", "movies", "music",
    "world", "international", "global",
    "climate", "environment", "energy",
  ];

  return commonTags.filter((tag) => text.includes(tag)).slice(0, 5);
}

