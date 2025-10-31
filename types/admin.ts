// Admin Panel Types

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: Permission[];
  createdAt: string;
  lastLoginAt?: string;
  active: boolean;
}

export type AdminRole = "super_admin" | "admin" | "editor" | "moderator" | "curator";

export type Permission =
  | "manage_users"
  | "manage_articles"
  | "manage_sources"
  | "manage_categories"
  | "moderate_content"
  | "view_analytics"
  | "manage_automation"
  | "manage_settings"
  | "publish_articles"
  | "delete_articles"
  | "edit_trust_scores";

export interface DashboardStats {
  totalArticles: number;
  totalSources: number;
  totalUsers: number;
  todayArticles: number;
  pendingModeration: number;
  automatedArticles: number;
  curatedArticles: number;
  avgTrustScore: number;
  articlesByCategory: Record<string, number>;
  articlesBySource: Record<string, number>;
  recentActivity: ActivityLog[];
  topTrendingArticles: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: "article" | "source" | "user" | "category" | "setting";
  entityId: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ArticleModeration {
  articleId: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  flaggedBy?: string;
  flaggedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reason?: string;
  notes?: string;
}

export interface AutomationConfig {
  id: string;
  sourceId: string;
  enabled: boolean;
  fetchInterval: number; // minutes
  autoPublish: boolean;
  requireModeration: boolean;
  filters: {
    categories?: string[];
    keywords?: string[];
    excludeKeywords?: string[];
    minTrustScore?: number;
  };
  lastRun?: string;
  nextRun?: string;
  articlesFetched?: number;
  errors?: string[];
}

export interface CuratedArticleSubmission {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  sourceId?: string;
  externalUrl?: string;
  imageUrl?: string;
  tags?: string[];
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface BulkOperation {
  id: string;
  type: "publish" | "delete" | "archive" | "update_category" | "update_trust_score";
  articleIds: string[];
  status: "pending" | "processing" | "completed" | "failed";
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  results?: {
    success: number;
    failed: number;
    errors?: string[];
  };
}

export interface AdminSettings {
  platformName: string;
  defaultTrustScore: number;
  requireModerationForNewSources: boolean;
  autoModerationEnabled: boolean;
  moderationRules: ModerationRule[];
  emailNotifications: {
    onNewSubmission: boolean;
    onModerationNeeded: boolean;
    onError: boolean;
    recipients: string[];
  };
}

export interface ModerationRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    keyword?: string[];
    sourceId?: string[];
    category?: string[];
    minTrustScore?: number;
  };
  action: "auto_approve" | "auto_reject" | "flag_for_review";
}

