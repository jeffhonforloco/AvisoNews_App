// Time utility functions for news articles

import { NEW_ARTICLE_TIME_FRAMES } from "@/config/newsConfig";

export interface TimeFrameConfig {
  // Time in milliseconds
  justNow: number; // < 5 minutes
  minutesAgo: number; // < 60 minutes
  hoursAgo: number; // < 24 hours
  daysAgo: number; // < 7 days
  weeksAgo: number; // < 4 weeks
}

export const DEFAULT_TIME_FRAME: TimeFrameConfig = {
  justNow: 1000 * 60 * 5, // 5 minutes
  minutesAgo: 1000 * 60 * 60, // 1 hour
  hoursAgo: 1000 * 60 * 60 * 24, // 24 hours
  daysAgo: 1000 * 60 * 60 * 24 * 7, // 7 days
  weeksAgo: 1000 * 60 * 60 * 24 * 7 * 4, // 4 weeks
};

// Re-export for backward compatibility
export { NEW_ARTICLE_TIME_FRAMES };

/**
 * Check if an article is "new" based on published or imported time
 */
export function isNewArticle(
  article: { publishedAt: string; importedAt?: string },
  timeFrame: number = NEW_ARTICLE_TIME_FRAMES.TODAY
): boolean {
  const articleTime = new Date(article.importedAt || article.publishedAt).getTime();
  const now = Date.now();
  const diff = now - articleTime;
  
  return diff <= timeFrame;
}

/**
 * Get the appropriate "new" badge level
 */
export function getNewBadgeLevel(
  article: { publishedAt: string; importedAt?: string }
): "very-recent" | "recent" | "today" | null {
  const articleTime = new Date(article.importedAt || article.publishedAt).getTime();
  const now = Date.now();
  const diff = now - articleTime;

  if (diff <= NEW_ARTICLE_TIME_FRAMES.VERY_RECENT) {
    return "very-recent";
  }
  if (diff <= NEW_ARTICLE_TIME_FRAMES.RECENT) {
    return "recent";
  }
  if (diff <= NEW_ARTICLE_TIME_FRAMES.TODAY) {
    return "today";
  }
  return null;
}

/**
 * Format time difference in human-readable format
 * Examples: "Just now", "2m ago", "1h ago", "3d ago"
 */
export function formatTimeAgo(date: string | Date): string {
  const articleDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - articleDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  }
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }
  
  // Fallback to formatted date
  return articleDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: articleDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Get relative time description
 */
export function getRelativeTime(date: string | Date): {
  label: string;
  isToday: boolean;
  isYesterday: boolean;
  isThisWeek: boolean;
} {
  const articleDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const articleDay = new Date(
    articleDate.getFullYear(),
    articleDate.getMonth(),
    articleDate.getDate()
  );
  
  const diffDays = Math.floor(
    (today.getTime() - articleDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return { label: "Today", isToday: true, isYesterday: false, isThisWeek: true };
  }
  if (diffDays === 1) {
    return { label: "Yesterday", isToday: false, isYesterday: true, isThisWeek: true };
  }
  if (diffDays < 7) {
    return { label: articleDate.toLocaleDateString("en-US", { weekday: "long" }), isToday: false, isYesterday: false, isThisWeek: true };
  }

  return {
    label: articleDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    isToday: false,
    isYesterday: false,
    isThisWeek: false,
  };
}

/**
 * Sort articles by newest first (using importedAt or publishedAt)
 */
export function sortArticlesByNewest<T extends { importedAt?: string; publishedAt: string }>(
  articles: T[]
): T[] {
  return [...articles].sort((a, b) => {
    const timeA = new Date(a.importedAt || a.publishedAt).getTime();
    const timeB = new Date(b.importedAt || b.publishedAt).getTime();
    return timeB - timeA; // Newest first
  });
}

/**
 * Get articles published/imported within a specific time frame
 */
export function getArticlesInTimeFrame<T extends { importedAt?: string; publishedAt: string }>(
  articles: T[],
  timeFrameMs: number
): T[] {
  const now = Date.now();
  return articles.filter((article) => {
    const articleTime = new Date(article.importedAt || article.publishedAt).getTime();
    return now - articleTime <= timeFrameMs;
  });
}

