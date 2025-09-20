export interface Article {
  id: string;
  sourceId: string;
  sourceName: string;
  source?: string; // Alias for sourceName
  category: string;
  title: string;
  titleAi?: string;
  excerpt: string;
  summary?: string; // Short summary for display
  tldr?: string;
  tags?: string[];
  canonicalUrl: string;
  imageUrl: string;
  publishedAt: string;
  importedAt: string;
  status: "published" | "draft";
  viewCount: number;
  trending?: boolean;
  featured?: boolean; // Featured article flag
  breaking?: boolean; // Breaking news flag
  readTime?: number;
  audioUrl?: string;
  audioTranscript?: string;
  isPremium?: boolean;
  duration?: number;
  narrator?: string;
  trustScore?: TrustMetrics;
  biasAnalysis?: BiasAnalysis;
  factCheck?: FactCheckResult;
  relatedArticles?: string[];
  coverage?: CoverageAnalysis;
  sentiment?: SentimentAnalysis;
  aggregatorData?: AggregatorData;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isPremium?: boolean;
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
  logoUrl?: string;
  verified?: boolean;
  isPremium?: boolean;
  followers?: number;
  trustRating?: number;
  biasRating?: BiasRating;
  factualityScore?: number;
  transparencyScore?: number;
  ownership?: SourceOwnership;
  funding?: string[];
  country?: string;
  language?: string;
  established?: string;
}

export interface UserPreferences {
  followedSources: string[];
  followedTeams: string[];
  favoriteCategories: string[];
  notificationSettings: {
    breaking: boolean;
    daily: boolean;
    weekly: boolean;
    followedSources: boolean;
    followedTeams: boolean;
    trustAlerts: boolean;
    biasAlerts: boolean;
    factCheckAlerts: boolean;
  };
  audioSettings: {
    autoPlay: boolean;
    playbackSpeed: number;
    downloadForOffline: boolean;
  };
  readingPreferences: {
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'auto';
    showImages: boolean;
    showTrustScores: boolean;
    showBiasIndicators: boolean;
    showFactChecks: boolean;
    minimumTrustScore: number;
    balancedPerspectives: boolean;
  };
  trustSettings: {
    hideUnverified: boolean;
    highlightDisputed: boolean;
    preferHighTrust: boolean;
    diversePerspectives: boolean;
  };
}

export interface SportsTeam {
  id: string;
  name: string;
  sport: string;
  league: string;
  logoUrl?: string;
  city: string;
  country: string;
  followers?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  features: {
    audioArticles: boolean;
    premiumContent: boolean;
    adFree: boolean;
    offlineReading: boolean;
    customNotifications: boolean;
    advancedTrustMetrics: boolean;
    biasAnalysis: boolean;
    factChecking: boolean;
    coverageAnalysis: boolean;
    sourceTransparency: boolean;
    personalizedInsights: boolean;
  };
}

export interface TrendingTopic {
  id: string;
  name: string;
  articleCount: number;
  trend: 'up' | 'down' | 'stable';
  category?: string;
}

export interface PersonalizedFeed {
  articles: Article[];
  trending: TrendingTopic[];
  followedSourcesUpdates: Article[];
  followedTeamsUpdates: Article[];
  recommendedArticles: Article[];
  trustInsights?: TrustInsights;
  biasBreakdown?: BiasBreakdown;
  coverageGaps?: CoverageGap[];
}

export interface TrustMetrics {
  overall: number; // 0-100
  sourceCredibility: number;
  factualAccuracy: number;
  transparency: number;
  editorial: number;
  lastUpdated: string;
}

export interface BiasAnalysis {
  political: BiasScore;
  emotional: BiasScore;
  factual: BiasScore;
  overall: 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'mixed';
  confidence: number;
}

export interface BiasScore {
  score: number; // -100 to 100
  label: string;
  confidence: number;
}

export interface BiasRating {
  political: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  factual: 'very-high' | 'high' | 'mostly-factual' | 'mixed' | 'low';
  overall: number; // 0-100
}

export interface FactCheckResult {
  status: 'verified' | 'disputed' | 'false' | 'unverified' | 'satire';
  confidence: number;
  sources: string[];
  lastChecked: string;
  details?: string;
}

export interface CoverageAnalysis {
  perspectives: number; // How many different viewpoints
  sources: number; // How many sources covering this story
  geographic: string[]; // Geographic coverage
  political: string[]; // Political spectrum coverage
  completeness: number; // 0-100
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  emotions: {
    anger: number;
    fear: number;
    joy: number;
    sadness: number;
    surprise: number;
  };
}

export interface SourceOwnership {
  type: 'public' | 'private' | 'government' | 'nonprofit' | 'cooperative';
  parent?: string;
  subsidiaries?: string[];
  investors?: string[];
}

export interface TrustInsights {
  averageTrust: number;
  sourceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  biasBalance: {
    left: number;
    center: number;
    right: number;
  };
  factualityBreakdown: {
    verified: number;
    disputed: number;
    unverified: number;
  };
}

export interface BiasBreakdown {
  political: Record<string, number>;
  geographic: Record<string, number>;
  sources: Record<string, number>;
}

export interface CoverageGap {
  topic: string;
  missingPerspectives: string[];
  suggestedSources: string[];
  importance: number;
}

export interface AggregatorData {
  totalSources: number;
  politicalBias: {
    left: number;
    centerLeft: number;
    center: number;
    centerRight: number;
    right: number;
  };
  averageTrustScore: number;
  factCheckStatus: 'verified' | 'disputed' | 'mixed' | 'unverified';
  controversyLevel: number;
  coverageGaps: string[];
  sourceEvolution?: {
    timeline: {
      timestamp: string;
      source: string;
      headline: string;
      trustScore: number;
      significance: 'breaking' | 'major' | 'minor';
    }[];
    consensusLevel: number;
  };
}