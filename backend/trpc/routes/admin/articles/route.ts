import { z } from "zod";
import { protectedProcedure } from "@/backend/trpc/create-context";
import { Article } from "@/types/news";
import { ArticleModeration, BulkOperation } from "@/types/admin";
import { mockArticles } from "@/mocks/articles";

// In-memory stores
let articlesStore: Article[] = [...mockArticles];
let moderationStore: Map<string, ArticleModeration> = new Map();
let bulkOperations: BulkOperation[] = [];

export const getArticlesForAdmin = protectedProcedure
  .input(
    z
      .object({
        status: z.enum(["all", "published", "draft", "pending", "flagged"]).optional().default("all"),
        category: z.string().optional(),
        sourceId: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...articlesStore];

    if (input?.status && input.status !== "all") {
      if (input.status === "pending" || input.status === "flagged") {
        const moderatedIds = Array.from(moderationStore.keys());
        filtered = filtered.filter((a) => {
          const mod = moderationStore.get(a.id);
          if (input.status === "pending") {
            return mod?.status === "pending";
          }
          if (input.status === "flagged") {
            return mod?.status === "flagged";
          }
          return true;
        });
      } else {
        filtered = filtered.filter((a) => a.status === input.status);
      }
    }

    if (input?.category) {
      filtered = filtered.filter((a) => a.category === input.category);
    }

    if (input?.sourceId) {
      filtered = filtered.filter((a) => a.sourceId === input.sourceId);
    }

    if (input?.search) {
      const searchLower = input.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.excerpt?.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const articles = filtered.slice(
      input?.offset || 0,
      (input?.offset || 0) + (input?.limit || 20)
    );

    // Add moderation status
    const articlesWithModeration = articles.map((article) => ({
      ...article,
      moderation: moderationStore.get(article.id),
    }));

    return {
      articles: articlesWithModeration,
      total,
      hasMore: (input?.offset || 0) + articles.length < total,
    };
  });

export const updateArticle = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      excerpt: z.string().optional(),
      category: z.string().optional(),
      featured: z.boolean().optional(),
      breaking: z.boolean().optional(),
      trending: z.boolean().optional(),
      status: z.enum(["published", "draft"]).optional(),
      trustScore: z
        .object({
          overall: z.number(),
          sourceCredibility: z.number(),
          factualAccuracy: z.number(),
          transparency: z.number(),
          editorial: z.number(),
        })
        .optional(),
    })
  )
  .mutation(({ input, ctx }) => {
    const article = articlesStore.find((a) => a.id === input.id);
    if (!article) throw new Error("Article not found");

    // Update article
    Object.assign(article, {
      ...input,
      trustScore: input.trustScore ? { ...article.trustScore, ...input.trustScore } : article.trustScore,
    });

    return { success: true, article };
  });

export const deleteArticle = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ input }) => {
    const index = articlesStore.findIndex((a) => a.id === input.id);
    if (index === -1) throw new Error("Article not found");
    articlesStore.splice(index, 1);
    return { success: true };
  });

export const moderateArticle = protectedProcedure
  .input(
    z.object({
      articleId: z.string(),
      status: z.enum(["approved", "rejected", "flagged"]),
      reason: z.string().optional(),
      notes: z.string().optional(),
    })
  )
  .mutation(({ input, ctx }) => {
    const moderation: ArticleModeration = {
      articleId: input.articleId,
      status: input.status === "approved" ? "approved" : input.status === "rejected" ? "rejected" : "flagged",
      reviewedBy: ctx.userId,
      reviewedAt: new Date().toISOString(),
      reason: input.reason,
      notes: input.notes,
    };

    moderationStore.set(input.articleId, moderation);

    // If approved, publish the article
    if (input.status === "approved") {
      const article = articlesStore.find((a) => a.id === input.articleId);
      if (article) {
        article.status = "published";
      }
    }

    return { success: true, moderation };
  });

export const bulkOperation = protectedProcedure
  .input(
    z.object({
      type: z.enum(["publish", "delete", "archive", "update_category", "update_trust_score"]),
      articleIds: z.array(z.string()),
      category: z.string().optional(),
      trustScore: z.number().optional(),
    })
  )
  .mutation(({ input, ctx }) => {
    const operation: BulkOperation = {
      id: `bulk-${Date.now()}`,
      type: input.type,
      articleIds: input.articleIds,
      status: "processing",
      createdBy: ctx.userId || "unknown",
      createdAt: new Date().toISOString(),
    };

    bulkOperations.push(operation);

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    input.articleIds.forEach((articleId) => {
      const article = articlesStore.find((a) => a.id === articleId);
      if (!article) {
        failed++;
        errors.push(`Article ${articleId} not found`);
        return;
      }

      try {
        switch (input.type) {
          case "publish":
            article.status = "published";
            break;
          case "delete":
            const index = articlesStore.findIndex((a) => a.id === articleId);
            if (index !== -1) articlesStore.splice(index, 1);
            break;
          case "archive":
            article.status = "draft";
            break;
          case "update_category":
            if (input.category) article.category = input.category;
            break;
          case "update_trust_score":
            if (input.trustScore) {
              article.trustScore = {
                ...article.trustScore,
                overall: input.trustScore,
              };
            }
            break;
        }
        success++;
      } catch (error) {
        failed++;
        errors.push(`Error processing ${articleId}: ${error}`);
      }
    });

    operation.status = failed === 0 ? "completed" : "failed";
    operation.completedAt = new Date().toISOString();
    operation.results = { success, failed, errors };

    return operation;
  });

export const getBulkOperations = protectedProcedure.query(() => {
  return bulkOperations.slice(-20); // Last 20 operations
});

