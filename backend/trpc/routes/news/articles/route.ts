import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { mockArticles } from "@/mocks/articles";
import { Article } from "@/types/news";
import { initializeNewsStore } from "@/backend/services/newsInitializer";

// In-memory store (in production, this would be a database)
// Start with mock data so app always has content immediately
let articlesStore: Article[] = [...mockArticles];
let initializationPromise: Promise<void> | null = null;
let initializationStarted = false;

// Initialize with real news on first access (runs in background, doesn't block)
async function ensureInitialized(): Promise<void> {
  // If already initialized or in progress, just wait for it
  if (initializationStarted && initializationPromise) {
    try {
      await initializationPromise;
    } catch (error) {
      console.error("Initialization error:", error);
    }
    return;
  }

  // Start initialization in background (non-blocking)
  if (!initializationStarted) {
    initializationStarted = true;
    initializationPromise = (async () => {
      try {
        await initializeNewsStore();
        // After initialization, check if we got real articles
        const storeAfterInit = getArticlesStore();
        const hasRealArticles = storeAfterInit.some(a => {
          const id = a.id.toLowerCase();
          return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-') && a.canonicalUrl !== 'https://example.com/article/';
        });
        
        if (hasRealArticles) {
          console.log(`✅ Real news loaded: ${storeAfterInit.length} articles`);
        } else if (storeAfterInit.length === 0) {
          // Still empty after trying, use mock data as last resort
          articlesStore = [...mockArticles];
          console.log("⚠️ Using mock articles as last resort fallback");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        // Keep what we have (either real or mock)
      }
    })();
    
    // Don't wait for it - return immediately so API responds with mock data
    // Real data will replace it when ready
  }
}

// Export getter function for use in other modules
export function getArticlesStore(): Article[] {
  return articlesStore;
}

export function addArticlesToStore(articles: Article[]): void {
  // Filter out mock articles (they have simple numeric IDs like "1", "2")
  // and fallback articles (they have IDs starting with "fallback-")
  const isRealArticle = (article: Article) => {
    const id = article.id.toLowerCase();
    // Mock articles have simple numeric IDs, real articles have complex IDs with timestamps
    return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-');
  };
  
  // Get current real articles (if any)
  const existingRealArticles = articlesStore.filter(isRealArticle);
  
  // Merge with new articles, removing duplicates by URL
  const allRealArticles = [...existingRealArticles, ...articles];
  const uniqueArticles = allRealArticles.reduce((acc, article) => {
    if (!acc.find((a) => a.canonicalUrl === article.canonicalUrl && a.canonicalUrl !== 'https://example.com/article/')) {
      acc.push(article);
    }
    return acc;
  }, [] as Article[]);
  
  // Replace entire store with real articles only
  articlesStore = uniqueArticles;
  
  // If we have real articles, log success
  if (uniqueArticles.length > 0 && uniqueArticles.some(isRealArticle)) {
    console.log(`✅ Store updated with ${uniqueArticles.length} real news articles`);
  }
}

export const getArticles = publicProcedure
  .input(
    z
      .object({
        category: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
        featured: z.boolean().optional(),
        breaking: z.boolean().optional(),
        trending: z.boolean().optional(),
      })
      .optional()
  )
  .query(async ({ input }) => {
    // Ensure news is initialized before querying
    await ensureInitialized();
    let filtered = [...articlesStore];

    // Filter by category
    if (input?.category && input.category !== "all") {
      filtered = filtered.filter(
        (article) => article.category?.toLowerCase() === input.category?.toLowerCase()
      );
    }

    // Filter by featured
    if (input?.featured !== undefined) {
      filtered = filtered.filter((article) => article.featured === input.featured);
    }

    // Filter by breaking
    if (input?.breaking !== undefined) {
      filtered = filtered.filter((article) => article.breaking === input.breaking);
    }

    // Filter by trending
    if (input?.trending !== undefined) {
      filtered = filtered.filter((article) => article.trending === input.trending);
    }

    // Sort by published date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.importedAt || a.publishedAt).getTime();
      const dateB = new Date(b.importedAt || b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Apply pagination
    const total = filtered.length;
    const articles = filtered.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 20));

    return {
      articles,
      total,
      hasMore: (input?.offset || 0) + articles.length < total,
    };
  });

export const getArticleById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    await ensureInitialized();
    const article = articlesStore.find((a) => a.id === input.id);
    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  });

export const incrementViewCount = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const article = articlesStore.find((a) => a.id === input.id);
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1;
      return { success: true, viewCount: article.viewCount };
    }
    throw new Error("Article not found");
  });

export const searchArticles = publicProcedure
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(100).optional().default(20),
      offset: z.number().min(0).optional().default(0),
    })
  )
  .query(async ({ input }) => {
    await ensureInitialized();
    const searchTerm = input.query.toLowerCase();
    const filtered = articlesStore.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt?.toLowerCase().includes(searchTerm) ||
        article.summary?.toLowerCase().includes(searchTerm) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );

    const total = filtered.length;
    const articles = filtered.slice(input.offset, input.offset + input.limit);

    return {
      articles,
      total,
      hasMore: input.offset + articles.length < total,
    };
  });

export const getRelatedArticles = publicProcedure
  .input(
    z.object({
      articleId: z.string(),
      limit: z.number().min(1).max(10).optional().default(3),
    })
  )
  .query(async ({ input }) => {
    await ensureInitialized();
    const article = articlesStore.find((a) => a.id === input.articleId);
    if (!article) {
      return { articles: [] };
    }

    const related = articlesStore
      .filter(
        (a) =>
          a.id !== article.id &&
          (a.category === article.category ||
            a.tags?.some((tag) => article.tags?.includes(tag)))
      )
      .slice(0, input.limit);

    return { articles: related };
  });

