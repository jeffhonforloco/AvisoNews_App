import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { mockArticles } from "@/mocks/articles";
import { Article } from "@/types/news";

// In-memory store (in production, this would be a database)
let articlesStore: Article[] = [...mockArticles];

// Export getter function for use in other modules
export function getArticlesStore(): Article[] {
  return articlesStore;
}

export function addArticlesToStore(articles: Article[]): void {
  articlesStore.push(...articles);
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
  .query(({ input }) => {
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
  .query(({ input }) => {
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
  .query(({ input }) => {
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
  .query(({ input }) => {
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

