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

  // Get articles from API
  const rawArticles = articlesQuery.data?.articles || [];
  
  // Filter out ONLY old mock articles (numeric IDs) - allow fallback articles temporarily
  // This ensures users see content while real RSS feeds are loading
  const articles = sortArticlesByNewest(
    rawArticles.filter((article: Article) => {
      const id = article.id.toLowerCase();
      // Only filter out old mock articles with simple numeric IDs
      // Allow fallback articles and any real articles
      const isNotOldMock = !/^[0-9]+$/.test(id);
      return isNotOldMock;
    })
  );
  
  // Log for debugging
  useEffect(() => {
    if (rawArticles.length > 0) {
      const realCount = rawArticles.filter((a: Article) => {
        const id = a.id.toLowerCase();
        return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-');
      }).length;
      const fallbackCount = rawArticles.filter((a: Article) => a.id.toLowerCase().startsWith('fallback-')).length;
      console.log(`📰 Frontend: ${rawArticles.length} total (${realCount} real, ${fallbackCount} fallback)`);
    } else if (articlesQuery.isSuccess && rawArticles.length === 0) {
      console.warn("⚠️ API returned empty array. Backend may still be initializing.");
    }
    if (articlesQuery.error) {
      console.error("❌ Articles query error:", articlesQuery.error);
    }
  }, [rawArticles.length, articlesQuery.error, articlesQuery.isSuccess]);
  
  const categories = categoriesQuery.data || [];
  const lastUpdated = articlesQuery.dataUpdatedAt 
    ? new Date(articlesQuery.dataUpdatedAt) 
    : null;

  // Show error if API failed AND we have no articles AND not currently loading/fetching
  // Also show error if query failed and we're not retrying
  const shouldShowError = articlesQuery.error && 
                          articles.length === 0 && 
                          !articlesQuery.isLoading &&
                          !articlesQuery.isFetching &&
                          articlesQuery.failureCount >= 2; // Only show after retries fail

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