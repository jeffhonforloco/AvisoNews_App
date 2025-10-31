import React, { useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { trpc } from "@/lib/trpc";
import { Article, Category } from "@/types/news";
import { mockArticles } from "@/mocks/articles";
import { sortArticlesByNewest } from "@/utils/timeUtils";
import { REFRESH_INTERVALS, CACHE_STALE_TIME, ARTICLE_LIMITS } from "@/config/newsConfig";

interface NewsContextType {
  articles: Article[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  incrementViewCount: (articleId: string) => void;
  lastUpdated: Date | null;
}

export const [NewsProvider, useNews] = createContextHook<NewsContextType>(() => {
  // Fetch articles from API with shorter stale time for real-time updates
  const articlesQuery = trpc.news.articles.list.useQuery(
    { limit: ARTICLE_LIMITS.DEFAULT },
    {
      staleTime: CACHE_STALE_TIME.ARTICLES,
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      retryDelay: 1000,
      refetchInterval: REFRESH_INTERVALS.ARTICLES, // Auto-refresh every 2 minutes
      refetchIntervalInBackground: false, // Only refresh when app is active
    }
  );

  // Fetch categories from API
  const categoriesQuery = trpc.news.categories.list.useQuery(undefined, {
    staleTime: CACHE_STALE_TIME.CATEGORIES,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });

  // Mutation for incrementing view count
  const incrementViewMutation = trpc.news.articles.incrementView.useMutation({
    onSuccess: () => {
      // Invalidate articles query to refetch with updated view count
      articlesQuery.refetch();
    },
  });

  const incrementViewCount = useCallback(
    (articleId: string) => {
      incrementViewMutation.mutate({ id: articleId });
    },
    [incrementViewMutation]
  );

  // Use real articles from API (no mock fallback - let initialization handle it)
  const rawArticles = articlesQuery.data?.articles || [];
  
  // Sort articles by newest first (using importedAt or publishedAt)
  const articles = sortArticlesByNewest(rawArticles);
  
  const categories = categoriesQuery.data || [];
  const lastUpdated = articlesQuery.dataUpdatedAt 
    ? new Date(articlesQuery.dataUpdatedAt) 
    : null;

  return {
    articles,
    categories,
    isLoading: articlesQuery.isLoading || categoriesQuery.isLoading,
    error: articlesQuery.error || categoriesQuery.error || null,
    refetch: () => {
      articlesQuery.refetch();
      categoriesQuery.refetch();
    },
    incrementViewCount,
    lastUpdated,
  };
});