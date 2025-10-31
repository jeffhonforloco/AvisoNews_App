# News API Integration Setup Guide

## Overview

AvisoNews supports multiple news APIs and RSS feeds for automated news aggregation. This guide explains how to set them up.

## Supported News Sources

### 1. NewsAPI.org (Recommended)
- **Website**: https://newsapi.org/
- **Free Tier**: 100 requests/day
- **Sources**: 80,000+ news sources
- **Setup**:
  1. Sign up at https://newsapi.org/register
  2. Get your free API key
  3. Set environment variable: `NEWSAPI_KEY=your_api_key_here`

### 2. Google News RSS (No API Key Required)
- **Type**: RSS Feed
- **Free**: Yes, unlimited
- **Sources**: All Google News indexed sources
- **Setup**: No configuration needed, works out of the box

### 3. NewsData.io
- **Website**: https://newsdata.io/
- **Free Tier**: 200 requests/day
- **Sources**: 85,000+ sources across 206 countries
- **Setup**:
  1. Sign up at https://newsdata.io/
  2. Get your free API key
  3. Set environment variable: `NEWSDATA_KEY=your_api_key_here`

### 4. RSS Feeds (Universal)
- **Type**: RSS/Atom feeds
- **Free**: Yes, unlimited
- **Sources**: Any website with RSS feed
- **Setup**: Just provide the RSS feed URL

## Configuration

### Environment Variables

Create a `.env` file or set these in your environment:

```bash
# NewsAPI.org (optional but recommended)
NEWSAPI_KEY=your_newsapi_key_here

# NewsData.io (optional)
NEWSDATA_KEY=your_newsdata_key_here
```

### Default Behavior

If no API keys are configured, the system will:
- Use Google News RSS by default (no key needed)
- Fall back to RSS feeds if provided
- Work with any RSS feed URL

## Popular RSS Feed URLs

Here are some popular news RSS feeds you can use:

- **TechCrunch**: https://techcrunch.com/feed/
- **Bloomberg**: https://www.bloomberg.com/feed/topics/technology
- **BBC News**: https://feeds.bbci.co.uk/news/rss.xml
- **Reuters**: https://www.reuters.com/rssFeed/worldNews
- **The Verge**: https://www.theverge.com/rss/index.xml
- **Wired**: https://www.wired.com/feed/rss
- **Ars Technica**: https://feeds.arstechnica.com/arstechnica/index

## Using in Automation

### Via Admin Panel
1. Go to Admin Panel → Automation
2. Create new automation config
3. Select source and API type
4. Configure filters and intervals
5. Run automation manually or let it run automatically

### Via API
```typescript
// Create automation with NewsAPI
trpc.admin.automation.create.useMutation({
  sourceId: "techcrunch",
  apiType: "newsapi",
  fetchInterval: 60,
  filters: {
    categories: ["technology"],
    keywords: ["AI", "technology"],
  }
})

// Create automation with RSS feed
trpc.admin.automation.create.useMutation({
  sourceId: "custom-source",
  apiType: "rss",
  feedUrl: "https://techcrunch.com/feed/",
  fetchInterval: 30,
})

// Create automation with Google News
trpc.admin.automation.create.useMutation({
  sourceId: "general-news",
  apiType: "googlenews",
  category: "technology",
  fetchInterval: 60,
})
```

## API Rate Limits

- **NewsAPI.org**: 100 requests/day (free tier)
- **NewsData.io**: 200 requests/day (free tier)
- **Google News RSS**: No limit (free)
- **RSS Feeds**: Varies by source

## Best Practices

1. **Use Google News RSS** for general news (no API key needed)
2. **Use NewsAPI** for specific sources (requires API key)
3. **Use RSS feeds** for individual websites
4. **Set appropriate fetch intervals** (don't exceed rate limits)
5. **Use filters** to get relevant articles
6. **Monitor errors** in automation logs

## Troubleshooting

### No articles fetched
- Check API key is set correctly
- Verify RSS feed URL is accessible
- Check network connectivity
- Review error logs in automation config

### Rate limit errors
- Increase fetch interval
- Use multiple API keys (rotate them)
- Use RSS feeds for additional sources

### Missing images
- Some APIs don't provide images
- RSS feeds may have images in enclosures
- Consider image extraction services

## Testing

Test your automation:
1. Create automation config in admin panel
2. Click "Run Now" to test immediately
3. Check articles in Articles Management
4. Review automation logs for errors

## Production Recommendations

1. **Database Storage**: Replace in-memory storage with database
2. **Queue System**: Use job queue (Bull, Agenda.js) for scheduled fetches
3. **Error Handling**: Implement retry logic and alerting
4. **Deduplication**: Ensure articles aren't duplicated
5. **Image Processing**: Download and process images
6. **Content Extraction**: Use services like Readability API
7. **Caching**: Cache API responses to reduce calls
8. **Monitoring**: Track API usage and costs

