// Industry-Standard REST API Client
// Cross-platform compatible for React Native and Web

import { Article, Category, Source } from "@/types/news";

const getBaseUrl = () => {
  // Rork automatically sets this - check if it's available
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
    console.log("🌐 API Base URL:", baseUrl);
    return baseUrl;
  }
  
  // Fallback for development
  if (typeof window !== "undefined") {
    const baseUrl = window.location.origin;
    console.log("🌐 Using window.location.origin as base URL:", baseUrl);
    return baseUrl;
  }
  
  throw new Error("No base url found - Rork should set EXPO_PUBLIC_RORK_API_BASE_URL automatically");
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
    console.log("🔧 ApiClient initialized with base URL:", this.baseUrl);
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;
    
    console.log(`🌐 Making request to: ${url}`);
    
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

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response URL: ${response.url}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`❌ HTTP ${response.status} Error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "API request failed");
      }

      console.log(`✅ API request successful, returning data`);
      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`❌ API Error [${cleanEndpoint}]:`, error);
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

    const queryString = query.toString();
    const endpoint = `/api/articles${queryString ? `?${queryString}` : ""}`;
    console.log(`📰 Fetching articles from: ${endpoint}`);
    return this.fetch<Article[]>(endpoint);
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
    console.log("📂 Fetching categories from: /api/categories");
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
