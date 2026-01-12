import React, { useState, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { NewsAPI } from "@/services/api";

interface BookmarkContextType {
  bookmarks: string[];
  isBookmarked: (articleId: string) => boolean;
  toggleBookmark: (articleId: string) => Promise<void>;
  isLoading: boolean;
}

export const [BookmarkProvider, useBookmarks] = createContextHook<BookmarkContextType>(() => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await NewsAPI.getBookmarks();
      setBookmarks(savedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarked = (articleId: string): boolean => {
    return bookmarks.includes(articleId);
  };

  const toggleBookmark = async (articleId: string): Promise<void> => {
    try {
      if (bookmarks.includes(articleId)) {
        await NewsAPI.removeBookmark(articleId);
        setBookmarks((prev) => prev.filter((id) => id !== articleId));
      } else {
        await NewsAPI.addBookmark(articleId);
        setBookmarks((prev) => [...prev, articleId]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  };

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    isLoading,
  };
});
