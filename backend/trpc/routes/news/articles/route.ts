import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { Article } from "@/types/news";
import { initializeNewsStore } from "@/backend/services/newsInitializer";

// In-memory store (in production, this would be a database)
// Start EMPTY - only real news from RSS feeds
let articlesStore: Article[] = [];
let initializationPromise: Promise<void> | null = null;
let initializationStarted = false;

// Initialize with real news on first access - NOW BLOCKS until real data is loaded
async function ensureInitialized(): Promise<void> {
  // If already initialized or in progress, wait for it
  if (initializationStarted && initializationPromise) {
    try {
      await initializationPromise;
    } catch (error) {
      console.error("Initialization error:", error);
    }
    return;
  }

  // Start initialization - NOW WE WAIT for it to complete
  if (!initializationStarted) {
    initializationStarted = true;
    console.log("🔄 Starting news initialization (this may take a few seconds)...");
    
    initializationPromise = (async () => {
      try {
        await initializeNewsStore();
        
        // After initialization, check if we got real articles
        const storeAfterInit = getArticlesStore();
        const hasRealArticles = storeAfterInit.some(a => {
          const id = a.id.toLowerCase();
          const isReal = !/^[0-9]+$/.test(id) && 
                        !id.startsWith('fallback-') && 
                        a.canonicalUrl !== 'https://example.com/article/' &&
                        !a.canonicalUrl.includes('techcrunch.com/openai-gpt5');
          
          return isReal;
        });
        
        if (hasRealArticles) {
          const realCount = storeAfterInit.filter(a => {
            const id = a.id.toLowerCase();
            return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-');
          }).length;
          console.log(`✅ Real news loaded: ${realCount} real articles out of ${storeAfterInit.length} total`);
        } else {
          console.warn(`⚠️ No real articles found. Store has ${storeAfterInit.length} articles (likely all fallback)`);
          // Try one more time with emergency fetch
          console.log("🔄 Attempting emergency fetch...");
          await emergencyFetch();
          
          // Check again after emergency fetch
          const finalCheck = getArticlesStore();
          const stillNoReal = !finalCheck.some(a => {
            const id = a.id.toLowerCase();
            return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-') && a.canonicalUrl !== 'https://example.com/article/';
          });
          
          if (stillNoReal && finalCheck.length === 0) {
            console.error("❌ CRITICAL: No articles could be fetched. Store is empty. Check RSS feeds and network.");
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        // Try emergency fetch as last resort
        await emergencyFetch();
      }
    })();
    
    // NOW WAIT for initialization to complete before returning
    await initializationPromise;
  }
}

// Emergency fetch - tries the simplest possible RSS fetch
async function emergencyFetch(): Promise<void> {
  try {
    const { fetchNews } = await import("@/backend/services/newsFetcher");
    
    // Try just BBC - simplest and most reliable
    const articles = await fetchNews({
      sourceId: "bbc-emergency",
      sourceName: "BBC News",
      apiType: "rss",
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      category: "world",
    });
    
    if (articles.length > 0) {
      addArticlesToStore(articles);
      console.log(`✅ Emergency fetch successful: ${articles.length} articles`);
    } else {
      console.error("❌ Emergency fetch returned 0 articles");
    }
  } catch (error) {
    console.error("❌ Emergency fetch failed:", error);
  }
}

// Export getter function for use in other modules
export function getArticlesStore(): Article[] {
  return articlesStore;
}

export function addArticlesToStore(articles: Article[]): void {
  if (articles.length === 0) {
    console.warn("⚠️ Attempted to add 0 articles to store");
    return;
  }
  
  // Filter out any fallback articles (they have IDs starting with "fallback-")
  // Only accept real articles from RSS feeds
  const realArticles = articles.filter((article) => {
    const id = article.id.toLowerCase();
    const isNotFallback = !id.startsWith('fallback-');
    const hasRealUrl = article.canonicalUrl && 
                       !article.canonicalUrl.includes('example.com');
    
    return isNotFallback && hasRealUrl;
  });
  
  if (realArticles.length === 0) {
    console.warn(`⚠️ All ${articles.length} articles were filtered out as fallback/mock`);
    return;
  }
  
  // Merge with existing articles, removing duplicates by URL
  const allArticles = [...articlesStore, ...realArticles];
  const uniqueArticles = allArticles.reduce((acc, article) => {
    if (!acc.find((a) => a.canonicalUrl === article.canonicalUrl)) {
      acc.push(article);
    }
    return acc;
  }, [] as Article[]);
  
  // Replace entire store with unique real articles
  articlesStore = uniqueArticles;
  
  console.log(`✅ Store updated: ${uniqueArticles.length} total articles (added ${realArticles.length} new)`);
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
    // CRITICAL: Ensure news is initialized and loaded BEFORE returning
    await ensureInitialized();
    
    // Wait a bit more if store is still empty (initialization might be in progress)
    if (articlesStore.length === 0) {
      console.log("⏳ Store is empty, waiting for initialization to complete...");
      let retries = 0;
      while (articlesStore.length === 0 && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }
    }
    
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

