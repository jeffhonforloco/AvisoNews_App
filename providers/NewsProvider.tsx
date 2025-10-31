import React, { useState, useEffect, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [articles, setArticles] = useState<Article[]>([]);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem("categories");
      if (stored) return JSON.parse(stored);
      
      const defaultCategories: Category[] = [
        { id: "tech", name: "Technology", slug: "tech" },
        { id: "business", name: "Business", slug: "business" },
        { id: "world", name: "World", slug: "world" },
        { id: "health", name: "Health", slug: "health" },
        { id: "gaming", name: "Gaming", slug: "gaming" },
        { id: "science", name: "Science", slug: "science" },
      ];
      
      await AsyncStorage.setItem("categories", JSON.stringify(defaultCategories));
      return defaultCategories;
    },
  });

  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem("articles");
      if (stored) {
        const parsedArticles = JSON.parse(stored);
        if (parsedArticles.length > 0) return parsedArticles;
      }
      
      await AsyncStorage.setItem("articles", JSON.stringify(mockArticles));
      return mockArticles;
    },
  });

  const updateArticlesMutation = useMutation({
    mutationFn: async (updatedArticles: Article[]) => {
      await AsyncStorage.setItem("articles", JSON.stringify(updatedArticles));
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