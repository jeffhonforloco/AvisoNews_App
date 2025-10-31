// News configuration constants

/**
 * Auto-refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  // Main articles refresh interval
  ARTICLES: 1000 * 60 * 2, // 2 minutes - optimal balance between freshness and battery/data usage
  
  // Quick refresh for breaking news (if implemented separately)
  BREAKING_NEWS: 1000 * 60 * 1, // 1 minute
  
  // Background refresh (when app is in background)
  BACKGROUND: 1000 * 60 * 5, // 5 minutes - less frequent when not active
  
  // Manual refresh cooldown (to prevent spam)
  MANUAL_REFRESH_COOLDOWN: 1000 * 10, // 10 seconds
} as const;

/**
 * Time frames for "NEW" article badges (in milliseconds)
 */
export const NEW_ARTICLE_TIME_FRAMES = {
  // Very recent (last hour) - bright red badge
  VERY_RECENT: 1000 * 60 * 60, // 1 hour
  
  // Recent (last 3 hours) - orange badge
  RECENT: 1000 * 60 * 60 * 3, // 3 hours
  
  // Today (last 24 hours) - subtle badge
  TODAY: 1000 * 60 * 60 * 24, // 24 hours
} as const;

/**
 * Stale time for cache (in milliseconds)
 * Data older than this will be considered stale and refetched
 */
export const CACHE_STALE_TIME = {
  ARTICLES: 1000 * 60 * 1, // 1 minute
  CATEGORIES: 1000 * 60 * 60, // 1 hour (categories don't change often)
} as const;

/**
 * Maximum number of articles to fetch per request
 */
export const ARTICLE_LIMITS = {
  DEFAULT: 100,
  MAX: 500,
  INITIAL_LOAD: 50,
} as const;

