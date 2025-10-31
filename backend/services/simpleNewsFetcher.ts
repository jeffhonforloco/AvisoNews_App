// Simple news fetcher that creates articles from mock-like data but with real timestamps
// This is a fallback when RSS feeds fail
import { Article } from "@/types/news";

/**
 * Generate sample articles with current timestamps
 * This ensures the app always has content to display
 */
export function generateFallbackArticles(): Article[] {
  const now = new Date();
  const categories = ["tech", "world", "business", "science", "health", "sports"];
  const sources = ["BBC News", "TechCrunch", "Reuters", "The Guardian", "CNN", "AP News"];
  
  const sampleTitles = [
    "Tech Industry Sees Record Growth in Q1",
    "Global Markets React to Latest Economic Data",
    "Scientists Discover Breakthrough in Climate Research",
    "Healthcare Innovation Reaches New Milestone",
    "Sports World Celebrates Major Championship Win",
    "International Summit Addresses Key Global Issues",
  ];

  return sampleTitles.map((title, index): Article => {
    const category = categories[index % categories.length];
    const source = sources[index % sources.length];
    const publishedTime = new Date(now.getTime() - (index * 1000 * 60 * 30)); // 30 min apart
    
    return {
      id: `fallback-${Date.now()}-${index}`,
      sourceId: source.toLowerCase().replace(/\s+/g, "-"),
      sourceName: source,
      source: source,
      category: category,
      title: title,
      excerpt: `This is a sample news article about ${category} topics. Real news will appear once the feed initialization completes.`,
      summary: `Sample article: ${title}`,
      canonicalUrl: `https://example.com/article/${index}`,
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=800&h=600&fit=crop`,
      publishedAt: publishedTime.toISOString(),
      importedAt: publishedTime.toISOString(),
      status: "published" as const,
      viewCount: Math.floor(Math.random() * 1000),
      readTime: 3 + Math.floor(Math.random() * 5),
      tags: [category],
      trending: index < 2,
      featured: index === 0,
      breaking: index === 0,
    };
  });
}

