import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import {
  getArticles,
  getArticleById,
  incrementViewCount,
  searchArticles,
  getRelatedArticles,
} from "./routes/news/articles/route";
import {
  getCategories,
  getCategoryBySlug,
} from "./routes/news/categories/route";
import {
  getSources,
  getSourceById,
} from "./routes/news/sources/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  news: createTRPCRouter({
    articles: createTRPCRouter({
      list: getArticles,
      byId: getArticleById,
      incrementView: incrementViewCount,
      search: searchArticles,
      related: getRelatedArticles,
    }),
    categories: createTRPCRouter({
      list: getCategories,
      bySlug: getCategoryBySlug,
    }),
    sources: createTRPCRouter({
      list: getSources,
      byId: getSourceById,
    }),
  }),
});

export type AppRouter = typeof appRouter;