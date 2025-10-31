// Test script to verify RSS fetching works
// Run this to debug RSS feed issues

import { fetchNews } from "./newsFetcher";

async function testRSSFetch() {
  console.log("🧪 Testing RSS feed fetching...\n");
  
  const testSources = [
    {
      sourceId: "bbc-test",
      sourceName: "BBC News",
      apiType: "rss" as const,
      feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
      category: "world",
    },
    {
      sourceId: "techcrunch-test",
      sourceName: "TechCrunch",
      apiType: "rss" as const,
      feedUrl: "https://techcrunch.com/feed/",
      category: "tech",
    },
  ];

  for (const source of testSources) {
    try {
      console.log(`\n📡 Fetching from ${source.sourceName}...`);
      const articles = await fetchNews(source);
      console.log(`✅ ${source.sourceName}: ${articles.length} articles fetched`);
      
      if (articles.length > 0) {
        console.log(`   First article: "${articles[0].title}"`);
        console.log(`   URL: ${articles[0].canonicalUrl}`);
        console.log(`   Image: ${articles[0].imageUrl || 'none'}`);
      }
    } catch (error) {
      console.error(`❌ ${source.sourceName}: Error -`, error);
    }
  }
}

// Export for use in testing
export { testRSSFetch };

