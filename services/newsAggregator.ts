import { Article } from '@/types/news';
import { Analytics } from './analytics';

/**
 * News Aggregator Service
 * Integrates multiple news APIs to fetch comprehensive news coverage
 */

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || 'demo';
const GNEWS_API_KEY = process.env.EXPO_PUBLIC_GNEWS_API_KEY || 'demo';

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
}

class NewsAggregatorService {
  private baseUrls = {
    newsapi: 'https://newsapi.org/v2',
    gnews: 'https://gnews.io/api/v4',
    newsdata: 'https://newsdata.io/api/1',
  };

  /**
   * Fetch articles from NewsAPI.org
   */
  private async fetchFromNewsAPI(category: string, count: number = 20): Promise<Article[]> {
    try {
      const endpoint = `${this.baseUrls.newsapi}/top-headlines`;
      const params = new URLSearchParams({
        category: category.toLowerCase(),
        language: 'en',
        pageSize: count.toString(),
        apiKey: NEWS_API_KEY,
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error('NewsAPI request failed');

      const data = await response.json();
      return this.transformNewsAPIArticles(data.articles || []);
    } catch (error) {
      console.error('[NewsAPI] Fetch error:', error);
      Analytics.trackError(error as Error, 'newsapi_fetch');
      return [];
    }
  }

  /**
   * Fetch articles from GNews API
   */
  private async fetchFromGNews(category: string, count: number = 20): Promise<Article[]> {
    try {
      const endpoint = `${this.baseUrls.gnews}/top-headlines`;
      const params = new URLSearchParams({
        category: category.toLowerCase(),
        lang: 'en',
        max: count.toString(),
        apikey: GNEWS_API_KEY,
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error('GNews request failed');

      const data = await response.json();
      return this.transformGNewsArticles(data.articles || []);
    } catch (error) {
      console.error('[GNews] Fetch error:', error);
      Analytics.trackError(error as Error, 'gnews_fetch');
      return [];
    }
  }

  /**
   * Fetch articles from NewsData.io
   */
  private async fetchFromNewsData(category: string, count: number = 10): Promise<Article[]> {
    try {
      const apiKey = process.env.EXPO_PUBLIC_NEWSDATA_API_KEY || 'demo';
      const endpoint = `${this.baseUrls.newsdata}/news`;
      const params = new URLSearchParams({
        category: category.toLowerCase(),
        language: 'en',
        apikey: apiKey,
      });

      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error('NewsData request failed');

      const data = await response.json();
      return this.transformNewsDataArticles(data.results || []);
    } catch (error) {
      console.error('[NewsData] Fetch error:', error);
      return [];
    }
  }

  /**
   * Aggregate articles from all sources
   */
  async aggregateArticles(category: string = 'general'): Promise<Article[]> {
    try {
      Analytics.trackEvent('news_aggregation_started', { category });

      // Fetch from multiple sources in parallel
      const [newsApiArticles, gNewsArticles, newsDataArticles] = await Promise.allSettled([
        this.fetchFromNewsAPI(category, 15),
        this.fetchFromGNews(category, 15),
        this.fetchFromNewsData(category, 10),
      ]);

      // Combine results
      const allArticles: Article[] = [
        ...(newsApiArticles.status === 'fulfilled' ? newsApiArticles.value : []),
        ...(gNewsArticles.status === 'fulfilled' ? gNewsArticles.value : []),
        ...(newsDataArticles.status === 'fulfilled' ? newsDataArticles.value : []),
      ];

      // Remove duplicates based on title similarity
      const uniqueArticles = this.deduplicateArticles(allArticles);

      // Sort by published date
      uniqueArticles.sort((a, b) => {
        const dateA = new Date(a.importedAt).getTime();
        const dateB = new Date(b.importedAt).getTime();
        return dateB - dateA;
      });

      Analytics.trackEvent('news_aggregation_completed', {
        category,
        totalArticles: uniqueArticles.length,
        sources: ['newsapi', 'gnews', 'newsdata'],
      });

      return uniqueArticles;
    } catch (error) {
      console.error('[NewsAggregator] Error:', error);
      Analytics.trackError(error as Error, 'news_aggregation');
      return [];
    }
  }

  /**
   * Fetch article content by URL
   */
  async fetchArticleContent(url: string): Promise<string> {
    try {
      // In production, use a content extraction service
      // For now, return placeholder content
      return `
This is the full article content that would be extracted from the source.

In a production environment, you would integrate with services like:
- Mercury Parser
- Diffbot Article API
- Extract.com
- Custom web scraping solution

The content would include:
- Full article text
- Cleaned formatting
- No ads or clutter
- Preserved structure (headings, paragraphs, lists)
- Images embedded in content

This ensures users can read everything within AvisoNews without leaving the app.
      `.trim();
    } catch (error) {
      console.error('[ContentFetch] Error:', error);
      return 'Unable to fetch article content.';
    }
  }

  /**
   * Transform NewsAPI articles to app format
   */
  private transformNewsAPIArticles(articles: NewsAPIArticle[]): Article[] {
    return articles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        id: `newsapi_${Date.now()}_${index}`,
        sourceId: 'newsapi',
        sourceName: article.source.name,
        category: this.inferCategory(article.title + ' ' + article.description),
        title: article.title,
        titleAi: this.generateAITitle(article.title),
        excerpt: article.description || '',
        tldr: this.generateTLDR(article.description || article.content || ''),
        tags: this.extractTags(article.title + ' ' + article.description),
        canonicalUrl: article.url,
        imageUrl: article.urlToImage || 'https://via.placeholder.com/800x400?text=No+Image',
        publishedAt: this.formatPublishDate(article.publishedAt),
        importedAt: new Date().toISOString(),
        status: 'published' as const,
        viewCount: 0,
        trending: false,
        readTime: this.calculateReadTime(article.content || article.description || ''),
      }));
  }

  /**
   * Transform GNews articles to app format
   */
  private transformGNewsArticles(articles: GNewsArticle[]): Article[] {
    return articles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        id: `gnews_${Date.now()}_${index}`,
        sourceId: 'gnews',
        sourceName: article.source.name,
        category: this.inferCategory(article.title + ' ' + article.description),
        title: article.title,
        titleAi: this.generateAITitle(article.title),
        excerpt: article.description || '',
        tldr: this.generateTLDR(article.content || article.description || ''),
        tags: this.extractTags(article.title + ' ' + article.description),
        canonicalUrl: article.url,
        imageUrl: article.image || 'https://via.placeholder.com/800x400?text=No+Image',
        publishedAt: this.formatPublishDate(article.publishedAt),
        importedAt: new Date().toISOString(),
        status: 'published' as const,
        viewCount: 0,
        trending: false,
        readTime: this.calculateReadTime(article.content || article.description || ''),
      }));
  }

  /**
   * Transform NewsData.io articles to app format
   */
  private transformNewsDataArticles(articles: any[]): Article[] {
    return articles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        id: `newsdata_${Date.now()}_${index}`,
        sourceId: 'newsdata',
        sourceName: article.source_id || 'News Source',
        category: article.category?.[0] || 'general',
        title: article.title,
        titleAi: this.generateAITitle(article.title),
        excerpt: article.description || '',
        tldr: this.generateTLDR(article.content || article.description || ''),
        tags: article.keywords || this.extractTags(article.title),
        canonicalUrl: article.link,
        imageUrl: article.image_url || 'https://via.placeholder.com/800x400?text=No+Image',
        publishedAt: this.formatPublishDate(article.pubDate),
        importedAt: new Date().toISOString(),
        status: 'published' as const,
        viewCount: 0,
        trending: false,
        readTime: this.calculateReadTime(article.content || article.description || ''),
      }));
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private deduplicateArticles(articles: Article[]): Article[] {
    const seen = new Map<string, Article>();

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().trim();
      const key = normalizedTitle.substring(0, 50); // Use first 50 chars as key

      if (!seen.has(key)) {
        seen.set(key, article);
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Infer category from article content
   */
  private inferCategory(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.match(/\b(tech|technology|software|ai|startup|apple|google|microsoft)\b/))
      return 'tech';
    if (lowerText.match(/\b(business|economy|market|stock|finance|company)\b/))
      return 'business';
    if (lowerText.match(/\b(health|medical|hospital|doctor|covid|disease)\b/))
      return 'health';
    if (lowerText.match(/\b(game|gaming|esports|playstation|xbox)\b/))
      return 'gaming';
    if (lowerText.match(/\b(science|research|study|discovery|space|nasa)\b/))
      return 'science';

    return 'world';
  }

  /**
   * Generate AI-enhanced title
   */
  private generateAITitle(originalTitle: string): string {
    // Simplify title by removing source names and cleanup
    return originalTitle
      .replace(/\s-\s.*$/, '') // Remove " - Source Name"
      .replace(/\|.*$/, '') // Remove "| Source Name"
      .trim();
  }

  /**
   * Generate TLDR from content
   */
  private generateTLDR(content: string): string {
    if (!content) return '';

    // Take first 2 sentences or 150 characters
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    const tldr = sentences.slice(0, 2).join(' ').trim();

    return tldr.length > 150 ? tldr.substring(0, 147) + '...' : tldr;
  }

  /**
   * Extract relevant tags from text
   */
  private extractTags(text: string): string[] {
    const commonTags = [
      'Breaking', 'Analysis', 'Opinion', 'Exclusive', 'Update',
      'Technology', 'Business', 'Politics', 'Science', 'Health',
      'Sports', 'Entertainment', 'World', 'Local', 'Featured'
    ];

    const lowerText = text.toLowerCase();
    return commonTags.filter(tag =>
      lowerText.includes(tag.toLowerCase())
    ).slice(0, 5);
  }

  /**
   * Format publish date to relative time
   */
  private formatPublishDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  }

  /**
   * Calculate estimated read time
   */
  private calculateReadTime(content: string): number {
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Average reading speed: 200 words/min
    return Math.max(1, minutes);
  }
}

export const NewsAggregator = new NewsAggregatorService();
