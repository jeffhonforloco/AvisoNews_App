import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { DashboardStats, ActivityLog } from "@/types/admin";
import { mockArticles } from "@/mocks/articles";

let activityLogs: ActivityLog[] = [
  {
    id: "log-1",
    userId: "admin-1",
    userName: "Super Admin",
    action: "published_article",
    entityType: "article",
    entityId: "1",
    timestamp: new Date().toISOString(),
  },
  {
    id: "log-2",
    userId: "editor-1",
    userName: "News Editor",
    action: "approved_article",
    entityType: "article",
    entityId: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const getDashboardStats = protectedProcedure.query(() => {
  const articles = mockArticles;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayArticles = articles.filter((article) => {
    const articleDate = new Date(article.importedAt || article.publishedAt);
    return articleDate >= today;
  });

  const automatedArticles = articles.filter((a) => !a.isPremium).length;
  const curatedArticles = articles.filter((a) => a.isPremium).length;

  const avgTrustScore =
    articles.reduce((sum, a) => sum + (a.trustScore?.overall || 75), 0) /
    articles.length;

  const articlesByCategory: Record<string, number> = {};
  articles.forEach((article) => {
    const cat = article.category || "uncategorized";
    articlesByCategory[cat] = (articlesByCategory[cat] || 0) + 1;
  });

  const articlesBySource: Record<string, number> = {};
  articles.forEach((article) => {
    const source = article.sourceName || "unknown";
    articlesBySource[source] = (articlesBySource[source] || 0) + 1;
  });

  const topTrendingArticles = articles
    .filter((a) => a.trending)
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
    .map((a) => a.id);

  const stats: DashboardStats = {
    totalArticles: articles.length,
    totalSources: new Set(articles.map((a) => a.sourceId)).size,
    totalUsers: 1250, // Mock user count
    todayArticles: todayArticles.length,
    pendingModeration: 3, // Mock pending count
    automatedArticles,
    curatedArticles,
    avgTrustScore: Math.round(avgTrustScore),
    articlesByCategory,
    articlesBySource,
    recentActivity: activityLogs.slice(0, 10),
    topTrendingArticles,
  };

  return stats;
});

export const getActivityLogs = protectedProcedure
  .input(
    z
      .object({
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
        entityType: z
          .enum(["article", "source", "user", "category", "setting"])
          .optional(),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...activityLogs];

    if (input?.entityType) {
      filtered = filtered.filter((log) => log.entityType === input.entityType);
    }

    const total = filtered.length;
    const logs = filtered.slice(
      input?.offset || 0,
      (input?.offset || 0) + (input?.limit || 20)
    );

    return {
      logs,
      total,
      hasMore: (input?.offset || 0) + logs.length < total,
    };
  });

