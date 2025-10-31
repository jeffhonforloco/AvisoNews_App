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
import {
  login,
  getCurrentAdmin,
  checkPermission,
} from "./routes/admin/auth/route";
import {
  getDashboardStats,
  getActivityLogs,
} from "./routes/admin/dashboard/route";
import {
  getArticlesForAdmin,
  updateArticle,
  deleteArticle,
  moderateArticle,
  bulkOperation,
  getBulkOperations,
} from "./routes/admin/articles/route";
import {
  getAutomationConfigs,
  getAutomationConfig,
  createAutomationConfig,
  updateAutomationConfig,
  deleteAutomationConfig,
  runAutomation,
} from "./routes/admin/automation/route";
import {
  getCuratedSubmissions,
  submitCuratedArticle,
  reviewCuratedSubmission,
  updateCuratedSubmission,
  deleteCuratedSubmission,
} from "./routes/admin/curation/route";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/admin/users/route";
import { testNewsFetch } from "./routes/admin/test-news-fetch";

// Verify procedures before creating router
if (!getArticles) {
  console.error("❌ CRITICAL: getArticles is undefined!");
  throw new Error("getArticles procedure is not exported correctly");
}

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
  admin: createTRPCRouter({
    auth: createTRPCRouter({
      login,
      getCurrent: getCurrentAdmin,
      checkPermission,
    }),
    dashboard: createTRPCRouter({
      stats: getDashboardStats,
      activityLogs: getActivityLogs,
    }),
    articles: createTRPCRouter({
      list: getArticlesForAdmin,
      update: updateArticle,
      delete: deleteArticle,
      moderate: moderateArticle,
      bulk: bulkOperation,
      bulkOperations: getBulkOperations,
    }),
    automation: createTRPCRouter({
      list: getAutomationConfigs,
      get: getAutomationConfig,
      create: createAutomationConfig,
      update: updateAutomationConfig,
      delete: deleteAutomationConfig,
      run: runAutomation,
    }),
    curation: createTRPCRouter({
      list: getCuratedSubmissions,
      submit: submitCuratedArticle,
      review: reviewCuratedSubmission,
      update: updateCuratedSubmission,
      delete: deleteCuratedSubmission,
    }),
    users: createTRPCRouter({
      list: getUsers,
      get: getUser,
      create: createUser,
      update: updateUser,
      delete: deleteUser,
    }),
    testNewsFetch: testNewsFetch,
  }),
});

export type AppRouter = typeof appRouter;