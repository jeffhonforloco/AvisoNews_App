import React, { useState, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { NewsAPI } from "@/services/api";
import { Analytics } from "@/services/analytics";

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
      const wasBookmarked = bookmarks.includes(articleId);

      if (wasBookmarked) {
        await NewsAPI.removeBookmark(articleId);
        setBookmarks((prev) => prev.filter((id) => id !== articleId));
        Analytics.trackArticleBookmark(articleId, 'remove');
      } else {
        await NewsAPI.addBookmark(articleId);
        setBookmarks((prev) => [...prev, articleId]);
        Analytics.trackArticleBookmark(articleId, 'add');
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Analytics.trackError(error as Error, 'bookmark_toggle');
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
