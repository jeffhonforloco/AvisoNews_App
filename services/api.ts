import { SafeStorage } from "@/services/safeStorage";
import { Article, Category } from "@/types/news";
import { mockArticles } from "@/mocks/articles";

const STORAGE_KEYS = {
  ARTICLES: "articles",
  CATEGORIES: "categories",
  BOOKMARKS: "bookmarks",
};

export class NewsAPI {
  private static baseUrl = process.env.EXPO_PUBLIC_API_URL || "";

  static async getArticles(): Promise<Article[]> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/articles`);
        if (!response.ok) throw new Error("Failed to fetch articles");
        return await response.json();
      }

      const stored = await SafeStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) {
        const parsedArticles = JSON.parse(stored);
        if (parsedArticles.length > 0) return parsedArticles;
      }

      await SafeStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(mockArticles));
      return mockArticles;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return mockArticles;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        return await response.json();
      }

      const stored = await SafeStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) return JSON.parse(stored);

      const defaultCategories: Category[] = [
        { id: "tech", name: "Technology", slug: "tech" },
        { id: "business", name: "Business", slug: "business" },
        { id: "world", name: "World", slug: "world" },
        { id: "health", name: "Health", slug: "health" },
        { id: "gaming", name: "Gaming", slug: "gaming" },
        { id: "science", name: "Science", slug: "science" },
      ];

      await SafeStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
      return defaultCategories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async getArticleById(id: string): Promise<Article | null> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/articles/${id}`);
        if (!response.ok) return null;
        return await response.json();
      }

      const articles = await this.getArticles();
      return articles.find((a) => a.id === id) || null;
    } catch (error) {
      console.error("Error fetching article:", error);
      return null;
    }
  }

  static async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/articles?category=${categorySlug}`);
        if (!response.ok) throw new Error("Failed to fetch category articles");
        return await response.json();
      }

      const articles = await this.getArticles();
      return articles.filter((a) => a.category === categorySlug);
    } catch (error) {
      console.error("Error fetching category articles:", error);
      return [];
    }
  }

  static async updateArticle(article: Article): Promise<void> {
    try {
      const articles = await this.getArticles();
      const updatedArticles = articles.map((a) =>
        a.id === article.id ? article : a
      );
      await SafeStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updatedArticles));
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  }

  static async incrementViewCount(articleId: string): Promise<void> {
    try {
      const articles = await this.getArticles();
      const updatedArticles = articles.map((a) =>
        a.id === articleId ? { ...a, viewCount: a.viewCount + 1 } : a
      );
      await SafeStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updatedArticles));
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }

  static async getBookmarks(): Promise<string[]> {
    try {
      const stored = await SafeStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      return [];
    }
  }

  static async addBookmark(articleId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      if (!bookmarks.includes(articleId)) {
        bookmarks.push(articleId);
        await SafeStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  }

  static async removeBookmark(articleId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks();
      const filtered = bookmarks.filter((id) => id !== articleId);
      await SafeStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  }

  static async isBookmarked(articleId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getBookmarks();
      return bookmarks.includes(articleId);
    } catch (error) {
      console.error("Error checking bookmark:", error);
      return false;
    }
  }

  static async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/newsletter/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        return await response.json();
      }

      console.log("Newsletter subscription (mock):", email);
      return { success: true, message: "Successfully subscribed to newsletter!" };
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return { success: false, message: "Failed to subscribe. Please try again." };
    }
  }
}
