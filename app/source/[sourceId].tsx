import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, ExternalLink, AlertCircle, Globe, Shield, TrendingUp } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/providers/ThemeProvider";

interface SourceArticle {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  trustScore: number;
  bias: string;
}

interface SourceInfo {
  id: string;
  name: string;
  url: string;
  description: string;
  trustScore: number;
  bias: string;
  factualReporting: string;
  articles: SourceArticle[];
}

export default function SourceScreen() {
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const { colors, isDark } = useTheme();
  
  // Fetch source from API
  const sourceQuery = trpc.news.sources.byId.useQuery(
    { id: sourceId || "" },
    {
      enabled: !!sourceId,
      staleTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    }
  );

  // Fetch articles from this source
  const articlesQuery = trpc.news.articles.list.useQuery(
    { limit: 50 },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const source = sourceQuery.data;
  const isLoading = sourceQuery.isLoading || articlesQuery.isLoading;
  const error = sourceQuery.error;

  // Filter articles by source
  const sourceArticles = articlesQuery.data?.articles.filter(
    (article) => article.sourceId === sourceId
  ) || [];

  // Transform to SourceArticle format
  const transformedArticles: SourceArticle[] = sourceArticles.map((article) => ({
    id: article.id,
    title: article.title,
    url: article.canonicalUrl,
    publishedAt: article.publishedAt,
    trustScore: article.trustScore?.overall || 75,
    bias: article.biasAnalysis?.overall || "center",
  }));

  // Transform source to SourceInfo format
  const sourceInfo: SourceInfo | null = source
    ? {
        id: source.id,
        name: source.name,
        url: source.homepageUrl || "",
        description: `${source.name} is a trusted news source with ${source.factualityScore || 85}% factual reporting.`,
        trustScore: source.trustRating || 85,
        bias: source.biasRating?.political || "center",
        factualReporting: source.factualityScore
          ? `${source.factualityScore}%`
          : "High",
        articles: transformedArticles,
      }
    : null;

  const openArticle = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Cannot open URL:", url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getBiasColor = (bias: string) => {
    const biasLower = bias.toLowerCase();
    if (biasLower.includes("left")) return "#3B82F6";
    if (biasLower.includes("right")) return "#EF4444";
    return "#6B7280";
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading source...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !sourceInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.status.error} />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            {error?.message || "Source not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Source Header */}
        <View style={[styles.sourceHeader, { backgroundColor: colors.background.card }]}>
          <LinearGradient
            colors={isDark ? ["#1C1C1E", "#2C2C2E"] : ["#F5F5F7", "#FFFFFF"]}
            style={styles.sourceHeaderGradient}
          >
            <View style={styles.sourceInfo}>
              <View style={styles.sourceTitleRow}>
                <Globe size={32} color={colors.primary} />
                <View style={styles.sourceTitle}>
                  <Text style={[styles.sourceName, { color: colors.text.primary }]}>
                    {sourceInfo.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => openArticle(sourceInfo.url)}
                    style={styles.sourceUrlButton}
                  >
                    <Text style={[styles.sourceUrl, { color: colors.primary }]}>
                      {sourceInfo.url.replace(/^https?:\/\//, "")}
                    </Text>
                    <ExternalLink size={14} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.sourceDescription, { color: colors.text.secondary }]}>
                {sourceInfo.description}
              </Text>

              {/* Trust Metrics */}
              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <Shield size={18} color={getTrustColor(sourceInfo.trustScore)} />
                  <View style={styles.metricInfo}>
                    <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                      Trust Score
                    </Text>
                    <Text
                      style={[styles.metricValue, { color: getTrustColor(sourceInfo.trustScore) }]}
                    >
                      {sourceInfo.trustScore}/100
                    </Text>
                  </View>
                </View>

                <View style={styles.metric}>
                  <TrendingUp size={18} color={getBiasColor(sourceInfo.bias)} />
                  <View style={styles.metricInfo}>
                    <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                      Political Bias
                    </Text>
                    <Text
                      style={[styles.metricValue, { color: getBiasColor(sourceInfo.bias) }]}
                    >
                      {sourceInfo.bias}
                    </Text>
                  </View>
                </View>

                <View style={styles.metric}>
                  <AlertCircle size={18} color={colors.status.success} />
                  <View style={styles.metricInfo}>
                    <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                      Factual Reporting
                    </Text>
                    <Text style={[styles.metricValue, { color: colors.status.success }]}>
                      {sourceInfo.factualReporting}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Articles List */}
        <View style={styles.articlesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Latest Articles ({sourceInfo.articles.length})
          </Text>

          {sourceInfo.articles.length === 0 ? (
            <View style={styles.noArticles}>
              <Text style={[styles.noArticlesText, { color: colors.text.secondary }]}>
                No articles found from this source
              </Text>
            </View>
          ) : (
            sourceInfo.articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleCard, { backgroundColor: colors.background.card }]}
                onPress={() => router.push(`/article/${article.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.articleHeader}>
                  <Text style={[styles.articleTitle, { color: colors.text.primary }]} numberOfLines={2}>
                    {article.title}
                  </Text>
                </View>

                <View style={styles.articleFooter}>
                  <View style={styles.articleMeta}>
                    <Text style={[styles.articleTime, { color: colors.text.secondary }]}>
                      {article.publishedAt}
                    </Text>
                    <Text style={[styles.articleDot, { color: colors.text.tertiary }]}>•</Text>
                    <View style={[styles.trustBadge, { backgroundColor: `${getTrustColor(article.trustScore)}20` }]}>
                      <Text style={[styles.trustBadgeText, { color: getTrustColor(article.trustScore) }]}>
                        Trust: {article.trustScore}
                      </Text>
                    </View>
                  </View>
                  <ExternalLink size={16} color={colors.text.tertiary} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  sourceHeader: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sourceHeaderGradient: {
    padding: 24,
  },
  sourceInfo: {
    gap: 16,
  },
  sourceTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sourceTitle: {
    flex: 1,
    gap: 6,
  },
  sourceName: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  sourceUrlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sourceUrl: {
    fontSize: 14,
    fontWeight: "500",
  },
  sourceDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  metricsContainer: {
    gap: 12,
    marginTop: 8,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  articlesSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  articleCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  articleHeader: {
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  articleTime: {
    fontSize: 13,
  },
  articleDot: {
    fontSize: 13,
  },
  trustBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  noArticles: {
    paddingVertical: 40,
    alignItems: "center",
  },
  noArticlesText: {
    fontSize: 16,
    textAlign: "center",
  },
});
