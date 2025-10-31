import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { AutomationConfig } from "@/types/admin";
import { Article } from "@/types/news";
import { addArticlesToStore } from "@/backend/trpc/routes/news/articles/route";

// In-memory automation configs
let automationConfigs: AutomationConfig[] = [
  {
    id: "auto-1",
    sourceId: "techcrunch",
    enabled: true,
    fetchInterval: 60, // 60 minutes
    autoPublish: false,
    requireModeration: true,
    filters: {
      categories: ["tech"],
      keywords: ["AI", "technology", "innovation"],
      excludeKeywords: ["sponsored"],
      minTrustScore: 70,
    },
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 3300000).toISOString(),
    articlesFetched: 15,
  },
];

export const getAutomationConfigs = protectedProcedure.query(() => {
  return automationConfigs;
});

export const getAutomationConfig = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");
    return config;
  });

export const createAutomationConfig = protectedProcedure
  .input(
    z.object({
      sourceId: z.string(),
      sourceName: z.string().optional(),
      apiType: z.enum(["newsapi", "rss", "googlenews", "newsdata"]).optional().default("googlenews"),
      feedUrl: z.string().url().optional(),
      apiKey: z.string().optional(),
      enabled: z.boolean().default(true),
      fetchInterval: z.number().min(1).max(1440), // 1 minute to 24 hours
      autoPublish: z.boolean().default(false),
      requireModeration: z.boolean().default(true),
      filters: z
        .object({
          categories: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
          excludeKeywords: z.array(z.string()).optional(),
          minTrustScore: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
  )
  .mutation(({ input }) => {
    const config: AutomationConfig = {
      id: `auto-${Date.now()}`,
      sourceId: input.sourceId,
      sourceName: input.sourceName,
      apiType: input.apiType || "googlenews",
      feedUrl: input.feedUrl,
      apiKey: input.apiKey,
      enabled: input.enabled,
      fetchInterval: input.fetchInterval,
      autoPublish: input.autoPublish,
      requireModeration: input.requireModeration,
      filters: input.filters || {},
      nextRun: new Date(Date.now() + input.fetchInterval * 60000).toISOString(),
    };

    automationConfigs.push(config);
    return config;
  });

export const updateAutomationConfig = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      enabled: z.boolean().optional(),
      fetchInterval: z.number().min(1).max(1440).optional(),
      autoPublish: z.boolean().optional(),
      requireModeration: z.boolean().optional(),
      filters: z
        .object({
          categories: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
          excludeKeywords: z.array(z.string()).optional(),
          minTrustScore: z.number().min(0).max(100).optional(),
        })
        .optional(),
    })
  )
  .mutation(({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");

    Object.assign(config, {
      ...input,
      filters: input.filters ? { ...config.filters, ...input.filters } : config.filters,
    });

    if (input.fetchInterval && config.enabled) {
      config.nextRun = new Date(Date.now() + input.fetchInterval * 60000).toISOString();
    }

    return config;
  });

export const deleteAutomationConfig = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const index = automationConfigs.findIndex((c) => c.id === input.id);
    if (index === -1) throw new Error("Automation config not found");
    automationConfigs.splice(index, 1);
    return { success: true };
  });

export const runAutomation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const config = automationConfigs.find((c) => c.id === input.id);
    if (!config) throw new Error("Automation config not found");

    try {
      // Import the news fetcher
      const { fetchNews } = await import("@/backend/services/newsFetcher");
      
      // Get source info to determine API type
      const sourceInfo = await getSourceInfo(config.sourceId);
      
      // Fetch news articles
      const articles = await fetchNews({
        sourceId: config.sourceId,
        sourceName: (config as any).sourceName || sourceInfo.name,
        apiType: (config as any).apiType || sourceInfo.apiType || "googlenews", // Default to Google News (no API key needed)
        feedUrl: (config as any).feedUrl || sourceInfo.feedUrl,
        apiKey: (config as any).apiKey,
        category: config.filters?.categories?.[0],
        keywords: config.filters?.keywords,
        excludeKeywords: config.filters?.excludeKeywords,
      });

      // Filter by trust score if specified
      let filteredArticles = articles;
      if (config.filters?.minTrustScore) {
        filteredArticles = articles.filter(
          (article) => (article.trustScore?.overall || 75) >= config.filters!.minTrustScore!
        );
      }

      // Check for duplicates and add new articles
      const articlesStore = await getArticlesStore();
      const newArticles = filteredArticles.filter(
        (article) => !articlesStore.some((a) => a.canonicalUrl === article.canonicalUrl)
      );

      // Add new articles to store
      if (newArticles.length > 0) {
        addArticlesToStore(newArticles);
      }

      // Update config
      config.lastRun = new Date().toISOString();
      config.nextRun = new Date(Date.now() + config.fetchInterval * 60000).toISOString();
      config.articlesFetched = (config.articlesFetched || 0) + newArticles.length;

      if (newArticles.length > 0 && config.errors) {
        config.errors = [];
      }

      return {
        success: true,
        articlesFetched: newArticles.length,
        articlesAdded: newArticles.length,
        lastRun: config.lastRun,
        articles: newArticles.slice(0, 5), // Return first 5 as preview
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      config.errors = [...(config.errors || []), errorMessage];
      config.lastRun = new Date().toISOString();

      return {
        success: false,
        error: errorMessage,
        articlesFetched: 0,
        lastRun: config.lastRun,
      };
    }
  });

// Helper function to get source info (in production, fetch from database)
async function getSourceInfo(sourceId: string): Promise<{
  name: string;
  feedUrl?: string;
  apiType?: "newsapi" | "rss" | "googlenews" | "newsdata";
}> {
  // Mock source mappings - in production, fetch from database
  const sourceMap: Record<string, any> = {
    techcrunch: {
      name: "TechCrunch",
      feedUrl: "https://techcrunch.com/feed/",
      apiType: "rss",
    },
    bloomberg: {
      name: "Bloomberg",
      feedUrl: "https://www.bloomberg.com/feed/",
      apiType: "rss",
    },
    bbc: {
      name: "BBC News",
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      apiType: "rss",
    },
    general: {
      name: "General News",
      apiType: "googlenews",
    },
  };

  return sourceMap[sourceId] || {
    name: sourceId,
    apiType: "googlenews",
  };
}

// Helper function to get articles store (in production, use database)
async function getArticlesStore(): Promise<Article[]> {
  const { getArticlesStore } = await import("@/backend/trpc/routes/news/articles/route");
  return getArticlesStore();
}

