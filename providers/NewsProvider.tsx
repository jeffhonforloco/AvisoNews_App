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

  // Use ONLY real articles from API - NO MOCK, NO FALLBACK
  // Backend must provide real data from RSS feeds
  const rawArticles = articlesQuery.data?.articles || [];
  
  // Filter out any mock/fallback articles that might slip through
  const realArticles = rawArticles.filter((article: Article) => {
    const id = article.id.toLowerCase();
    // Exclude numeric IDs (old mock articles) and fallback articles
    const isNotMock = !/^[0-9]+$/.test(id);
    const isNotFallback = !id.startsWith('fallback-');
    const hasRealUrl = article.canonicalUrl && 
                       !article.canonicalUrl.includes('example.com') &&
                       !article.canonicalUrl.includes('techcrunch.com/openai-gpt5'); // Old mock URL
    
    return isNotMock && isNotFallback && hasRealUrl;
  });
  
  // Always use filtered real articles only
  const articles = sortArticlesByNewest(realArticles);
  
  // Log for debugging
  useEffect(() => {
    if (rawArticles.length > 0) {
      console.log(`📰 Frontend received ${rawArticles.length} total articles, ${realArticles.length} are REAL`);
      if (realArticles.length === 0 && rawArticles.length > 0) {
        console.warn("⚠️ WARNING: All articles were filtered out as mock/fallback. Check backend initialization.");
      }
    } else if (articlesQuery.isSuccess && rawArticles.length === 0) {
      console.warn("⚠️ API returned empty array. Backend may still be initializing.");
    }
  }, [rawArticles.length, realArticles.length]);
  
  const categories = categoriesQuery.data || [];
  const lastUpdated = articlesQuery.dataUpdatedAt 
    ? new Date(articlesQuery.dataUpdatedAt) 
    : null;

  // Only show error if we have an actual error AND no data AND not loading
  // Show error if API failed AND we have no articles (real or otherwise)
  const shouldShowError = articlesQuery.error && 
                          articles.length === 0 && 
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