export interface Article {
  id: string;
  sourceId: string;
  sourceName: string;
  category: string;
  title: string;
  titleAi?: string;
  excerpt: string;
  tldr?: string;
  tags?: string[];
  canonicalUrl: string;
  imageUrl: string;
  publishedAt: string;
  importedAt: string;
  status: "published" | "draft";
  viewCount: number;
  trending?: boolean;
  readTime?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
  feedUrl: string;
  homepageUrl?: string;
  categorySlug: string;
  allowlist?: string[];
  blocklist?: string[];
  active: boolean;
}