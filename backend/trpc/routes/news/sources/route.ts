import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { Source } from "@/types/news";

// Mock sources data
const mockSources: Source[] = [
  {
    id: "techcrunch",
    name: "TechCrunch",
    feedUrl: "https://techcrunch.com/feed",
    homepageUrl: "https://techcrunch.com",
    categorySlug: "tech",
    active: true,
    verified: true,
    trustRating: 88,
    biasRating: {
      political: "center-left",
      factual: "high",
      overall: 85,
    },
    factualityScore: 88,
    transparencyScore: 85,
    language: "en",
    country: "US",
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    feedUrl: "https://www.bloomberg.com/feed",
    homepageUrl: "https://www.bloomberg.com",
    categorySlug: "business",
    active: true,
    verified: true,
    trustRating: 92,
    biasRating: {
      political: "center",
      factual: "very-high",
      overall: 90,
    },
    factualityScore: 92,
    transparencyScore: 90,
    language: "en",
    country: "US",
  },
  {
    id: "bbc",
    name: "BBC News",
    feedUrl: "https://feeds.bbci.co.uk/news/rss.xml",
    homepageUrl: "https://www.bbc.com/news",
    categorySlug: "world",
    active: true,
    verified: true,
    trustRating: 88,
    biasRating: {
      political: "center",
      factual: "high",
      overall: 88,
    },
    factualityScore: 88,
    transparencyScore: 90,
    language: "en",
    country: "GB",
  },
];

export const getSources = publicProcedure
  .input(
    z
      .object({
        category: z.string().optional(),
        verified: z.boolean().optional(),
        active: z.boolean().optional().default(true),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...mockSources];

    if (input?.category) {
      filtered = filtered.filter((source) => source.categorySlug === input.category);
    }

    if (input?.verified !== undefined) {
      filtered = filtered.filter((source) => source.verified === input.verified);
    }

    if (input?.active !== undefined) {
      filtered = filtered.filter((source) => source.active === input.active);
    }

    return filtered;
  });

export const getSourceById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const source = mockSources.find((s) => s.id === input.id);
    if (!source) {
      throw new Error("Source not found");
    }
    return source;
  });

