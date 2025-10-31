import React, { useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { trpc } from "@/lib/trpc";
import { Article, Category } from "@/types/news";
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
  // Fetch articles from API - FORCE fresh data on every mount
  const articlesQuery = trpc.news.articles.list.useQuery(
    { limit: ARTICLE_LIMITS.DEFAULT },
    {
      staleTime: 0, // Always consider stale - force fresh fetch
      gcTime: 0, // Don't cache - always get fresh data
      retry: 3, // Retry more times
      retryDelay: 2000, // Wait 2 seconds between retries
      refetchOnMount: true, // Always refetch on mount
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchInterval: REFRESH_INTERVALS.ARTICLES, // Auto-refresh every 2 minutes
      refetchIntervalInBackground: false, // Only refresh when app is active
    }
  );
  
  // Force a fresh fetch when provider mounts
  useEffect(() => {
    console.log("📰 NewsProvider mounted - forcing fresh data fetch...");
    // Small delay to ensure backend is ready
    const timer = setTimeout(() => {
      articlesQuery.refetch();
    }, 500);
    return () => clearTimeout(timer);
  }, []); // Only on mount

  // Fetch categories from API
  const categoriesQuery = trpc.news.categories.list.useQuery(undefined, {
    staleTime: 0, // Always fresh
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
    refetchOnMount: true,
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

  // Use real articles from API - NO MOCK FALLBACK
  // Backend now always has real data (either from RSS or fallback articles)
  const rawArticles = articlesQuery.data?.articles || [];
  
  // Always use API data - backend handles fallbacks
  const articles = sortArticlesByNewest(rawArticles);
  
  // Log for debugging
  useEffect(() => {
    if (rawArticles.length > 0) {
      const isRealArticle = (a: Article) => {
        const id = a.id.toLowerCase();
        return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-');
      };
      const realCount = rawArticles.filter(isRealArticle).length;
      console.log(`📰 Frontend received ${rawArticles.length} articles (${realCount} real)`);
    }
  }, [rawArticles.length]);
  
  const categories = categoriesQuery.data || [];
  const lastUpdated = articlesQuery.dataUpdatedAt 
    ? new Date(articlesQuery.dataUpdatedAt) 
    : null;

  // Only show error if we have an actual error AND no data AND not loading
  // If we're loading or have mock data, don't show error
  const shouldShowError = articlesQuery.error && 
                          rawArticles.length === 0 && 
                          !articlesQuery.isLoading &&
                          !articlesQuery.isFetching;

  const refetch = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    articlesQuery.refetch();
    categoriesQuery.refetch();
  }, [articlesQuery, categoriesQuery]);

  return {
    articles,
    categories,
    isLoading: articlesQuery.isLoading || categoriesQuery.isLoading,
    error: shouldShowError ? articlesQuery.error : null,
    refetch,
    incrementViewCount,
    lastUpdated,
  };
});