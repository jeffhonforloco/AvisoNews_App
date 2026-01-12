import { Article } from '@/types/news';
import { Analytics } from './analytics';

/**
 * News Aggregator Service
 * Uses completely free, open APIs with no authentication required:
 * - Hacker News API (tech news)
 * - Dev.to API (developer content)
 * - Reddit JSON feeds (various categories)
 */

interface HackerNewsStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  text?: string;
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string;
  published_at: string;
  tag_list: string[];
  user: {
    name: string;
    username: string;
  };
  reading_time_minutes: number;
  public_reactions_count: number;
}

interface RedditPost {
  data: {
    title: string;
    url: string;
    selftext: string;
    author: string;
    created_utc: number;
    thumbnail: string;
    preview?: {
      images: Array<{
        source: { url: string };
      }>;
    };
    subreddit: string;
    ups: number;
    num_comments: number;
    permalink: string;
  };
}

class NewsAggregatorService {
  private baseUrls = {
    hackernews: 'https://hacker-news.firebaseio.com/v0',
    devto: 'https://dev.to/api',
    reddit: 'https://www.reddit.com',
  };

  /**
   * Fetch articles from Hacker News (completely free, no auth)
   */
  private async fetchFromHackerNews(count: number = 20): Promise<Article[]> {
    try {
      // Get top stories IDs
      const topStoriesResponse = await fetch(
        `${this.baseUrls.hackernews}/topstories.json`
      );
      const storyIds: number[] = await topStoriesResponse.json();

      // Fetch first 'count' stories
      const stories = await Promise.all(
        storyIds.slice(0, count).map(async (id) => {
          const response = await fetch(
            `${this.baseUrls.hackernews}/item/${id}.json`
          );
          return response.json();
        })
      );

      return stories
        .filter((story: HackerNewsStory) => story && story.url) // Only stories with URLs
        .map((story: HackerNewsStory) => this.transformHackerNewsArticle(story));
    } catch (error) {
      console.error('[NewsAggregator] Hacker News fetch error:', error);
      Analytics.trackError(error as Error, 'hackernews_fetch');
      return [];
    }
  }

  /**
   * Fetch articles from Dev.to (free, no auth required)
   */
  private async fetchFromDevTo(count: number = 20): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.baseUrls.devto}/articles?per_page=${count}&top=7`
      );

      if (!response.ok) throw new Error('Dev.to request failed');

      const articles: DevToArticle[] = await response.json();
      return articles.map((article) => this.transformDevToArticle(article));
    } catch (error) {
      console.error('[NewsAggregator] Dev.to fetch error:', error);
      Analytics.trackError(error as Error, 'devto_fetch');
      return [];
    }
  }

  /**
   * Fetch articles from Reddit (free, no auth for public posts)
   */
  private async fetchFromReddit(subreddit: string, count: number = 20): Promise<Article[]> {
    try {
      const response = await fetch(
        `${this.baseUrls.reddit}/r/${subreddit}/hot.json?limit=${count}`,
        {
          headers: {
            'User-Agent': 'AvisoNews/1.0',
          },
        }
      );

      if (!response.ok) throw new Error('Reddit request failed');

      const data = await response.json();
      const posts = data.data.children;

      return posts
        .filter((post: RedditPost) => !post.data.selftext || post.data.url)
        .map((post: RedditPost) => this.transformRedditPost(post));
    } catch (error) {
      console.error('[NewsAggregator] Reddit fetch error:', error);
      Analytics.trackError(error as Error, 'reddit_fetch');
      return [];
    }
  }

  /**
   * Main method to aggregate articles from all free sources
   */
  async aggregateArticles(category: string = 'general'): Promise<Article[]> {
    try {
      console.log(`[NewsAggregator] Fetching articles for category: ${category}`);

      let sources: Promise<Article[]>[] = [];

      // Map categories to appropriate sources
      switch (category.toLowerCase()) {
        case 'tech':
        case 'technology':
          sources = [
            this.fetchFromHackerNews(15),
            this.fetchFromDevTo(15),
            this.fetchFromReddit('technology', 10),
          ];
          break;

        case 'world':
        case 'news':
          sources = [
            this.fetchFromReddit('worldnews', 15),
            this.fetchFromReddit('news', 15),
          ];
          break;

        case 'business':
          sources = [
            this.fetchFromReddit('business', 15),
            this.fetchFromReddit('Economics', 10),
            this.fetchFromHackerNews(10),
          ];
          break;

        case 'science':
          sources = [
            this.fetchFromReddit('science', 15),
            this.fetchFromReddit('EverythingScience', 10),
          ];
          break;

        case 'sports':
          sources = [
            this.fetchFromReddit('sports', 20),
          ];
          break;

        case 'entertainment':
          sources = [
            this.fetchFromReddit('entertainment', 15),
            this.fetchFromReddit('movies', 10),
          ];
          break;

        default: // 'general' or any other category
          sources = [
            this.fetchFromHackerNews(10),
            this.fetchFromDevTo(10),
            this.fetchFromReddit('worldnews', 10),
            this.fetchFromReddit('technology', 5),
          ];
      }

      // Fetch all sources in parallel
      const results = await Promise.all(sources);
      const allArticles = results.flat();

      console.log(`[NewsAggregator] Fetched ${allArticles.length} articles`);

      // Deduplicate and sort
      const deduplicated = this.deduplicateArticles(allArticles);

      Analytics.trackEvent('articles_aggregated', {
        category,
        count: deduplicated.length,
        sources: sources.length,
      });

      return deduplicated;
    } catch (error) {
      console.error('[NewsAggregator] Aggregation error:', error);
      Analytics.trackError(error as Error, 'news_aggregation');
      return [];
    }
  }

  /**
   * Transform Hacker News story to Article
   */
  private transformHackerNewsArticle(story: HackerNewsStory): Article {
    const publishDate = new Date(story.time * 1000);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));

    return {
      id: `hn-${story.id}`,
      title: story.title,
      titleAi: this.generateAITitle(story.title),
      excerpt: this.generateExcerpt(story.title),
      tldr: this.generateTLDR(story.title),
      imageUrl: this.getPlaceholderImage('tech'),
      canonicalUrl: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      sourceName: 'Hacker News',
      category: 'tech',
      tags: this.extractTags(story.title),
      publishedAt: this.formatRelativeTime(diffHours),
      readTime: this.calculateReadTime(story.title),
      viewCount: Math.max(story.score * 10, 100),
      trending: story.score > 100,
    };
  }

  /**
   * Transform Dev.to article to Article
   */
  private transformDevToArticle(article: DevToArticle): Article {
    const publishDate = new Date(article.published_at);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));

    return {
      id: `devto-${article.id}`,
      title: article.title,
      titleAi: this.generateAITitle(article.title),
      excerpt: article.description || this.generateExcerpt(article.title),
      tldr: this.generateTLDR(article.description || article.title),
      imageUrl: article.cover_image || this.getPlaceholderImage('tech'),
      canonicalUrl: article.url,
      sourceName: 'Dev.to',
      category: 'tech',
      tags: article.tag_list.slice(0, 5),
      publishedAt: this.formatRelativeTime(diffHours),
      readTime: article.reading_time_minutes || 5,
      viewCount: article.public_reactions_count * 5,
      trending: article.public_reactions_count > 50,
    };
  }

  /**
   * Transform Reddit post to Article
   */
  private transformRedditPost(post: RedditPost): Article {
    const publishDate = new Date(post.data.created_utc * 1000);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60));

    let imageUrl = this.getPlaceholderImage(post.data.subreddit);

    if (post.data.preview?.images?.[0]?.source?.url) {
      imageUrl = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');
    } else if (post.data.thumbnail && post.data.thumbnail.startsWith('http')) {
      imageUrl = post.data.thumbnail;
    }

    return {
      id: `reddit-${post.data.permalink}`,
      title: post.data.title,
      titleAi: this.generateAITitle(post.data.title),
      excerpt: post.data.selftext
        ? post.data.selftext.substring(0, 200) + '...'
        : this.generateExcerpt(post.data.title),
      tldr: this.generateTLDR(post.data.selftext || post.data.title),
      imageUrl,
      canonicalUrl: post.data.url,
      sourceName: `Reddit - r/${post.data.subreddit}`,
      category: this.mapSubredditToCategory(post.data.subreddit),
      tags: this.extractTags(post.data.title),
      publishedAt: this.formatRelativeTime(diffHours),
      readTime: this.calculateReadTime(post.data.selftext || post.data.title),
      viewCount: post.data.ups * 2,
      trending: post.data.ups > 1000,
    };
  }

  /**
   * Fetch full article content from URL
   */
  async fetchArticleContent(url: string): Promise<string> {
    try {
      console.log('[NewsAggregator] Fetching article content from:', url);

      // For now, return a placeholder since full content extraction
      // requires web scraping which may violate terms of service
      // In production, you'd use a service like Mercury Parser or similar

      return `Full article content would be fetched here. This requires web scraping or a content extraction service.\n\nArticle URL: ${url}\n\nFor a production app, consider using services like:\n- Mercury Parser API\n- Diffbot Article API\n- Custom web scraping solution`;
    } catch (error) {
      console.error('[NewsAggregator] Content fetch error:', error);
      throw error;
    }
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private deduplicateArticles(articles: Article[]): Article[] {
    const seen = new Map<string, Article>();

    for (const article of articles) {
      const normalizedTitle = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim();

      if (!seen.has(normalizedTitle)) {
        seen.set(normalizedTitle, article);
      }
    }

    return Array.from(seen.values()).sort((a, b) => {
      // Sort by trending first, then by view count
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.viewCount - a.viewCount;
    });
  }

  /**
   * Map subreddit to category
   */
  private mapSubredditToCategory(subreddit: string): string {
    const categoryMap: Record<string, string> = {
      worldnews: 'world',
      news: 'world',
      technology: 'tech',
      business: 'business',
      Economics: 'business',
      science: 'science',
      EverythingScience: 'science',
      sports: 'sports',
      entertainment: 'entertainment',
      movies: 'entertainment',
    };

    return categoryMap[subreddit] || 'general';
  }

  /**
   * Generate AI-enhanced title
   */
  private generateAITitle(originalTitle: string): string {
    // Simple enhancement - in production, use actual AI
    return originalTitle.length > 80
      ? originalTitle.substring(0, 77) + '...'
      : originalTitle;
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string): string {
    const cleaned = content.replace(/\n/g, ' ').trim();
    return cleaned.length > 150
      ? cleaned.substring(0, 147) + '...'
      : cleaned;
  }

  /**
   * Generate TLDR summary
   */
  private generateTLDR(content: string): string {
    // Simple TLDR - in production, use AI summarization
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.length > 0
      ? sentences[0].trim() + '.'
      : content.substring(0, 100) + '...';
  }

  /**
   * Extract relevant tags from text
   */
  private extractTags(text: string): string[] {
    const commonTags = [
      'Technology', 'Business', 'Science', 'AI', 'Web Development',
      'Mobile', 'Security', 'Cloud', 'Data', 'Programming',
    ];

    const textLower = text.toLowerCase();
    const foundTags = commonTags.filter(tag =>
      textLower.includes(tag.toLowerCase())
    );

    return foundTags.slice(0, 5);
  }

  /**
   * Format relative time (e.g., "2h ago", "1d ago")
   */
  private formatRelativeTime(hours: number): string {
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  }

  /**
   * Calculate estimated read time
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(Math.ceil(wordCount / wordsPerMinute), 1);
  }

  /**
   * Get placeholder image based on category
   */
  private getPlaceholderImage(category: string): string {
    const placeholders: Record<string, string> = {
      tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      world: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800',
      worldnews: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800',
      news: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800',
      business: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      entertainment: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800',
    };

    return placeholders[category.toLowerCase()] || placeholders.tech;
  }
}

export const NewsAggregator = new NewsAggregatorService();
