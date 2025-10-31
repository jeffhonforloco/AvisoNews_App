// News Provider using REST API
import React, { useCallback, useEffect, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { api } from "@/lib/api";
import { Article, Category } from "@/types/news";
import { sortArticlesByNewest } from "@/utils/timeUtils";
import { REFRESH_INTERVALS, ARTICLE_LIMITS } from "@/config/newsConfig";

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedArticles = await api.getArticles({
        limit: ARTICLE_LIMITS.DEFAULT,
      });
      
      // Filter out old mock articles (numeric IDs)
      const filteredArticles = fetchedArticles.filter((article: Article) => {
        const id = article.id.toLowerCase();
        return !/^[0-9]+$/.test(id);
      });
      
      const sortedArticles = sortArticlesByNewest(filteredArticles);
      setArticles(sortedArticles);
      setLastUpdated(new Date());
      
      console.log(`✅ Fetched ${sortedArticles.length} articles`);
    } catch (err) {
      console.error("❌ Error fetching articles:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch articles"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    console.log("📰 NewsProvider mounted - fetching data...");
    fetchArticles();
    fetchCategories();

    // Auto-refresh interval
    const interval = setInterval(() => {
      fetchArticles();
    }, REFRESH_INTERVALS.ARTICLES);

    return () => clearInterval(interval);
  }, [fetchArticles, fetchCategories]);

  const refetch = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    fetchArticles();
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  const incrementViewCount = useCallback(async (articleId: string) => {
    try {
      await api.incrementViewCount(articleId);
      // Update local state
      setArticles((prev) =>
        prev.map((article) =>
          article.id === articleId
            ? { ...article, viewCount: article.viewCount + 1 }
            : article
        )
      );
    } catch (err) {
      console.error("❌ Error incrementing view count:", err);
    }
  }, []);

  return {
    articles,
    categories,
    isLoading,
    error,
    refetch,
    incrementViewCount,
    lastUpdated,
  };
});
