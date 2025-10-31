// In-memory news store (can be replaced with database in production)
// Industry-standard data management

import { Article, Category, Source } from "@/types/news";

// Articles storage
let articlesStore: Article[] = [];

// Categories storage
const categoriesStore: Category[] = [
  { id: "world", slug: "world", name: "World News", color: "#0071E3" },
  { id: "technology", slug: "technology", name: "Technology", color: "#34C759" },
  { id: "business", slug: "business", name: "Business", color: "#FF9500" },
  { id: "science", slug: "science", name: "Science", color: "#5856D6" },
  { id: "health", slug: "health", name: "Health", color: "#FF3B30" },
  { id: "sports", slug: "sports", name: "Sports", color: "#FF9500" },
  { id: "entertainment", slug: "entertainment", name: "Entertainment", color: "#AF52DE" },
];

// Sources storage
const sourcesStore: Source[] = [];

/**
 * Get all articles with optional filtering
 */
export function getArticles(filters?: {
  category?: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  breaking?: boolean;
}): Article[] {
  let filtered = [...articlesStore];

  if (filters?.category) {
    filtered = filtered.filter((a) => a.category === filters.category);
  }

  if (filters?.featured) {
    filtered = filtered.filter((a) => a.featured);
  }

  if (filters?.breaking) {
    filtered = filtered.filter((a) => a.breaking);
  }

  // Sort by published date (newest first)
  filtered.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const offset = filters?.offset || 0;
  const limit = filters?.limit || 20;

  return filtered.slice(offset, offset + limit);
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): Article | undefined {
  return articlesStore.find((a) => a.id === id);
}

/**
 * Add articles to store (with deduplication)
 */
export function addArticles(articles: Article[]): void {
  const newArticles = articles.filter((article) => {
    // Skip if already exists (by URL)
    return !articlesStore.some((a) => a.canonicalUrl === article.canonicalUrl);
  });

  articlesStore.push(...newArticles);
  console.log(`📝 Added ${newArticles.length} new articles to store`);
}

/**
 * Replace articles (for full refresh)
 */
export function replaceArticles(articles: Article[]): void {
  articlesStore = articles;
  console.log(`🔄 Replaced store with ${articles.length} articles`);
}

/**
 * Search articles
 */
export function searchArticles(query: string, limit = 20): Article[] {
  const queryLower = query.toLowerCase();
  const results = articlesStore.filter(
    (article) =>
      article.title.toLowerCase().includes(queryLower) ||
      article.excerpt.toLowerCase().includes(queryLower)
  );

  return results.slice(0, limit);
}

/**
 * Get related articles
 */
export function getRelatedArticles(articleId: string, limit = 3): Article[] {
  const article = getArticleById(articleId);
  if (!article) return [];

  const related = articlesStore.filter(
    (a) =>
      a.id !== articleId &&
      (a.category === article.category || 
       a.sourceId === article.sourceId)
  );

  return related.slice(0, limit);
}

/**
 * Increment view count
 */
export function incrementViewCount(id: string): void {
  const article = getArticleById(id);
  if (article) {
    article.viewCount++;
  }
}

/**
 * Get all categories
 */
export function getCategories(): Category[] {
  return categoriesStore;
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesStore.find((c) => c.slug === slug);
}

/**
 * Get all sources
 */
export function getSources(): Source[] {
  return [...sourcesStore, ...articlesStore.reduce((acc, article) => {
    if (!acc.find((s) => s.id === article.sourceId)) {
      acc.push({
        id: article.sourceId,
        name: article.sourceName,
        feedUrl: "",
        categorySlug: article.category,
        active: true,
      });
    }
    return acc;
  }, [] as Source[])];
}

/**
 * Get store statistics
 */
export function getStoreStats() {
  return {
    totalArticles: articlesStore.length,
    byCategory: categoriesStore.map((cat) => ({
      category: cat.name,
      count: articlesStore.filter((a) => a.category === cat.slug).length,
    })),
    newestArticle: articlesStore[0]?.publishedAt,
    oldestArticle: articlesStore[articlesStore.length - 1]?.publishedAt,
  };
}

