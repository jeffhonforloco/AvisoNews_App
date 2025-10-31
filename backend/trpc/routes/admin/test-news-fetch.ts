// Test endpoint to manually trigger news fetch and see what happens
import { protectedProcedure } from "@/backend/trpc/create-context";
import { fetchNews } from "@/backend/services/newsFetcher";
import { addArticlesToStore, getArticlesStore } from "@/backend/trpc/routes/news/articles/route";

export const testNewsFetch = protectedProcedure.mutation(async () => {
  console.log("🧪 Manual news fetch test triggered");
  
  const results: any[] = [];
  
  // Test BBC RSS
  try {
    console.log("Testing BBC RSS...");
    const bbcArticles = await fetchNews({
      sourceId: "bbc-test",
      sourceName: "BBC News",
      apiType: "rss",
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      category: "world",
    });
    results.push({
      source: "BBC News",
      success: true,
      count: bbcArticles.length,
      sample: bbcArticles[0] ? {
        title: bbcArticles[0].title,
        url: bbcArticles[0].canonicalUrl,
      } : null,
    });
  } catch (error) {
    results.push({
      source: "BBC News",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
  
  // Test TechCrunch RSS
  try {
    console.log("Testing TechCrunch RSS...");
    const tcArticles = await fetchNews({
      sourceId: "techcrunch-test",
      sourceName: "TechCrunch",
      apiType: "rss",
      feedUrl: "https://techcrunch.com/feed/",
      category: "tech",
    });
    results.push({
      source: "TechCrunch",
      success: true,
      count: tcArticles.length,
      sample: tcArticles[0] ? {
        title: tcArticles[0].title,
        url: tcArticles[0].canonicalUrl,
      } : null,
    });
  } catch (error) {
    results.push({
      source: "TechCrunch",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
  
  // Check current store
  const storeArticles = getArticlesStore();
  const realArticles = storeArticles.filter(a => {
    const id = a.id.toLowerCase();
    return !/^[0-9]+$/.test(id) && !id.startsWith('fallback-');
  });
  
  return {
    testResults: results,
    storeStatus: {
      total: storeArticles.length,
      real: realArticles.length,
      mock: storeArticles.length - realArticles.length,
    },
    message: realArticles.length > 0 
      ? "✅ Real articles found in store" 
      : "⚠️ Only mock/fallback articles in store",
  };
});

