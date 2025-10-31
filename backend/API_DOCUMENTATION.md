# AvisoNews Backend API Documentation

## Overview

The backend is built with **Hono** and **tRPC**, providing type-safe API endpoints for the AvisoNews application.

## Architecture

- **Framework**: Hono (lightweight web framework)
- **API Layer**: tRPC (end-to-end typesafe APIs)
- **Data Layer**: In-memory store (can be replaced with database)
- **Server**: Expo Server (via `expo-server`)

## API Endpoints

### Base URL
The API base URL is configured via `EXPO_PUBLIC_RORK_API_BASE_URL` environment variable.

Default for local development: `http://localhost:3000`

### tRPC Endpoints

All endpoints are available at: `{BASE_URL}/api/trpc`

#### News Articles

**List Articles**
```typescript
trpc.news.articles.list.useQuery({
  category?: string,      // Filter by category (optional)
  limit?: number,         // Number of articles (default: 20, max: 100)
  offset?: number,        // Pagination offset (default: 0)
  featured?: boolean,     // Filter featured articles
  breaking?: boolean,     // Filter breaking news
  trending?: boolean,     // Filter trending articles
})
```

**Get Article by ID**
```typescript
trpc.news.articles.byId.useQuery({
  id: string
})
```

**Search Articles**
```typescript
trpc.news.articles.search.useQuery({
  query: string,         // Search query (min 1 char)
  limit?: number,        // Results limit (default: 20, max: 100)
  offset?: number,       // Pagination offset
})
```

**Get Related Articles**
```typescript
trpc.news.articles.related.useQuery({
  articleId: string,     // ID of the article
  limit?: number,        // Number of related articles (default: 3, max: 10)
})
```

**Increment View Count**
```typescript
trpc.news.articles.incrementView.useMutation({
  id: string
})
```

#### Categories

**List Categories**
```typescript
trpc.news.categories.list.useQuery()
```

**Get Category by Slug**
```typescript
trpc.news.categories.bySlug.useQuery({
  slug: string
})
```

#### Sources

**List Sources**
```typescript
trpc.news.sources.list.useQuery({
  category?: string,     // Filter by category
  verified?: boolean,    // Filter verified sources
  active?: boolean,      // Filter active sources (default: true)
})
```

**Get Source by ID**
```typescript
trpc.news.sources.byId.useQuery({
  id: string
})
```

## Usage in Frontend

### Example: Fetching Articles

```typescript
import { trpc } from "@/lib/trpc";

// In a component
const articlesQuery = trpc.news.articles.list.useQuery(
  { limit: 50, category: "tech" },
  {
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  }
);

const articles = articlesQuery.data?.articles || [];
```

### Example: Searching Articles

```typescript
const searchQuery = trpc.news.articles.search.useQuery(
  { query: "AI technology", limit: 20 },
  {
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 2,
  }
);
```

### Example: Incrementing View Count

```typescript
const incrementViewMutation = trpc.news.articles.incrementView.useMutation({
  onSuccess: () => {
    // Refetch articles to get updated view count
    articlesQuery.refetch();
  },
});

// Call it
incrementViewMutation.mutate({ id: articleId });
```

## Error Handling

All queries include:
- Automatic retries (configurable)
- Error fallbacks to mock data
- Loading states
- Type-safe error handling

## Data Structure

### Article
See `types/news.ts` for complete Article interface.

Key fields:
- `id`: Unique identifier
- `title`: Article title
- `excerpt`: Short description
- `category`: Article category
- `sourceId`: Source identifier
- `publishedAt`: Publication date
- `viewCount`: View count
- `trustScore`: Trust metrics
- `biasAnalysis`: Bias information
- `aggregatorData`: Source aggregation data

### Category
- `id`: Unique identifier
- `slug`: URL-friendly identifier
- `name`: Display name
- `color`: Category color (optional)

### Source
- `id`: Unique identifier
- `name`: Source name
- `trustRating`: Trust score (0-100)
- `biasRating`: Political bias information
- `factualityScore`: Factual reporting score

## Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3000
```

For production:
```bash
EXPO_PUBLIC_RORK_API_BASE_URL=https://api.avisonews.com
```

### Local Development

1. Make sure the backend server is running
2. Set `EXPO_PUBLIC_RORK_API_BASE_URL` to your local server URL
3. The frontend will automatically connect to the backend

## Future Enhancements

- [ ] Replace in-memory store with database (PostgreSQL/MongoDB)
- [ ] Add authentication endpoints
- [ ] Add user preferences endpoints
- [ ] Add bookmarking functionality
- [ ] Add real-time news updates via WebSockets
- [ ] Add caching layer (Redis)
- [ ] Add rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)

## Notes

- All endpoints are currently public (no authentication)
- Data is stored in-memory (will be reset on server restart)
- In production, replace with persistent database storage
- Consider adding caching for better performance

