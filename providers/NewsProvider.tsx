import React, { useState, useEffect, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Article, Category } from "@/types/news";
import { NewsAPI } from "@/services/api";
import { NewsAggregator } from "@/services/newsAggregator";
import { Analytics } from "@/services/analytics";

interface NewsContextType {
  articles: Article[];
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  incrementViewCount: (articleId: string) => void;
}

export const [NewsProvider, useNews] = createContextHook<NewsContextType>(() => {
  const [articles, setArticles] = useState<Article[]>([]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => NewsAPI.getCategories(),
  });

  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const useRealAPIs = process.env.EXPO_PUBLIC_USE_REAL_NEWS_APIS === 'true';

      if (useRealAPIs) {
        // Aggregate from all news sources
        const articles = await NewsAggregator.aggregateArticles('general');
        Analytics.trackEvent('articles_fetched_real_apis', { count: articles.length });
        return articles;
      } else {
        // Fallback to local API/mock data
        return await NewsAPI.getArticles();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  const updateArticlesMutation = useMutation({
    mutationFn: async (updatedArticles: Article[]) => {
      for (const article of updatedArticles) {
        await NewsAPI.updateArticle(article);
      }
      return updatedArticles;
    },
    onSuccess: (data) => {
      setArticles(data);
    },
  });

  useEffect(() => {
    if (articlesQuery.data) {
      setArticles(articlesQuery.data);
    }
  }, [articlesQuery.data]);

  const incrementViewCount = useCallback((articleId: string) => {
    const updatedArticles = articles.map(article =>
      article.id === articleId
        ? { ...article, viewCount: article.viewCount + 1 }
        : article
    );
    updateArticlesMutation.mutate(updatedArticles);
  }, [articles]);

  return {
    articles,
    categories: categoriesQuery.data || [],
    isLoading: articlesQuery.isLoading || categoriesQuery.isLoading,
    error: articlesQuery.error || categoriesQuery.error,
    refetch: () => {
      articlesQuery.refetch();
      categoriesQuery.refetch();
    },
    incrementViewCount,
  };
});