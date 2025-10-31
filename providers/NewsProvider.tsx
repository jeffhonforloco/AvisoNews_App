import React, { useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { trpc } from "@/lib/trpc";
import { Article, Category } from "@/types/news";
import { mockArticles } from "@/mocks/articles";

interface NewsContextType {
  articles: Article[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  incrementViewCount: (articleId: string) => void;
}

export const [NewsProvider, useNews] = createContextHook<NewsContextType>(() => {
  // Fetch articles from API
  const articlesQuery = trpc.news.articles.list.useQuery(
    { limit: 50 },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      retryDelay: 1000,
    }
  );

  // Fetch categories from API
  const categoriesQuery = trpc.news.categories.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 60, // 1 hour (categories don't change often)
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

  // Fallback to mock data if API fails
  const articles =
    articlesQuery.data?.articles || (articlesQuery.error ? mockArticles : []);
  const categories = categoriesQuery.data || [];

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
  };
});