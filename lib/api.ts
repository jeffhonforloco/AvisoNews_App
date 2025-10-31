// Industry-Standard REST API Client
// Cross-platform compatible for React Native and Web

import { Article, Category, Source } from "@/types/news";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }
  throw new Error("No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL");
};

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "API request failed");
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Articles
  async getArticles(params?: {
    category?: string;
    limit?: number;
    offset?: number;
    featured?: boolean;
    breaking?: boolean;
  }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.offset) query.append("offset", params.offset.toString());
    if (params?.featured) query.append("featured", "true");
    if (params?.breaking) query.append("breaking", "true");

    return this.fetch<Article[]>(`/api/articles?${query.toString()}`);
  }

  async getArticleById(id: string): Promise<Article> {
    return this.fetch<Article>(`/api/articles/${id}`);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.fetch(`/api/articles/${id}/view`, { method: "POST" });
  }

  async searchArticles(query: string, limit = 20): Promise<Article[]> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    return this.fetch<Article[]>(`/api/articles/search?${params.toString()}`);
  }

  async getRelatedArticles(articleId: string, limit = 3): Promise<Article[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    return this.fetch<Article[]>(`/api/articles/${articleId}/related?${params.toString()}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.fetch<Category[]>("/api/categories");
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.fetch<Category>(`/api/categories/${slug}`);
  }

  // Sources
  async getSources(): Promise<Source[]> {
    return this.fetch<Source[]>("/api/sources");
  }

  // Admin
  async forceUpdate(): Promise<{ count: number }> {
    return this.fetch<{ count: number }>("/api/admin/update", { method: "POST" });
  }

  async getStats(): Promise<any> {
    return this.fetch("/api/stats");
  }
}

export const api = new ApiClient();

