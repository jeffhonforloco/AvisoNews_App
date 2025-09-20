import React, { useEffect, useState } from "react";
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
  const { sourceId } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSourceInfo();
  }, [sourceId]);

  const loadSourceInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call - in production, fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on sourceId
      const mockSources: Record<string, SourceInfo> = {
        "techcrunch": {
          id: "techcrunch",
          name: "TechCrunch",
          url: "https://techcrunch.com",
          description: "TechCrunch is a leading technology media property, dedicated to obsessively profiling startups, reviewing new Internet products, and breaking tech news.",
          trustScore: 88,
          bias: "Center-Left",
          factualReporting: "High",
          articles: [
            {
              id: "tc1",
              title: "OpenAI Announces GPT-5 with Revolutionary Reasoning",
              url: "https://techcrunch.com/openai-gpt5",
              publishedAt: "2 hours ago",
              trustScore: 85,
              bias: "Center"
            },
            {
              id: "tc2",
              title: "Startup Funding Reaches New Heights in Q1 2025",
              url: "https://techcrunch.com/startup-funding",
              publishedAt: "5 hours ago",
              trustScore: 82,
              bias: "Center-Left"
            },
            {
              id: "tc3",
              title: "Apple's AI Strategy Takes Shape",
              url: "https://techcrunch.com/apple-ai",
              publishedAt: "8 hours ago",
              trustScore: 87,
              bias: "Center"
            }
          ]
        },
        "bloomberg": {
          id: "bloomberg",
          name: "Bloomberg",
          url: "https://bloomberg.com",
          description: "Bloomberg delivers business and markets news, data, analysis, and video to the world, featuring stories from Businessweek and Bloomberg News.",
          trustScore: 92,
          bias: "Center",
          factualReporting: "Very High",
          articles: [
            {
              id: "bb1",
              title: "Apple Stock Hits Record High on Vision Pro Sales",
              url: "https://bloomberg.com/apple-vision",
              publishedAt: "4 hours ago",
              trustScore: 90,
              bias: "Center"
            },
            {
              id: "bb2",
              title: "Fed Signals Rate Cut Timeline",
              url: "https://bloomberg.com/fed-rates",
              publishedAt: "6 hours ago",
              trustScore: 93,
              bias: "Center"
            }
          ]
        },
        "bbc": {
          id: "bbc",
          name: "BBC News",
          url: "https://bbc.com/news",
          description: "BBC News provides trusted World and UK news as well as local and regional perspectives. Also entertainment, business, science, technology and health news.",
          trustScore: 95,
          bias: "Center-Left",
          factualReporting: "Very High",
          articles: [
            {
              id: "bbc1",
              title: "Global Climate Summit Reaches Historic Agreement",
              url: "https://bbc.com/climate-summit",
              publishedAt: "3 hours ago",
              trustScore: 94,
              bias: "Center"
            },
            {
              id: "bbc2",
              title: "UK Economy Shows Signs of Recovery",
              url: "https://bbc.com/uk-economy",
              publishedAt: "7 hours ago",
              trustScore: 92,
              bias: "Center-Left"
            }
          ]
        }
      };
      
      const source = mockSources[sourceId as string];
      if (source) {
        setSourceInfo(source);
      } else {
        setError("Source not found");
      }
    } catch (err) {
      setError("Failed to load source information");
      console.error("Error loading source:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={colors.status.error} />
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            {error || "Source not found"}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadSourceInfo}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Source Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ["#1F2937", "#111827"] : ["#F3F4F6", "#FFFFFF"]}
          style={styles.sourceHeader}
        >
          <View style={styles.sourceIcon}>
            <Globe size={32} color={colors.primary} />
          </View>
          <Text style={[styles.sourceName, { color: colors.text.primary }]}>
            {sourceInfo.name}
          </Text>
          <TouchableOpacity 
            style={styles.websiteButton}
            onPress={() => openArticle(sourceInfo.url)}
          >
            <Text style={[styles.websiteButtonText, { color: colors.primary }]}>Visit Website</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: getTrustColor(sourceInfo.trustScore) + "20" }]}>
              <Shield size={20} color={getTrustColor(sourceInfo.trustScore)} />
            </View>
            <Text style={[styles.metricValue, { color: getTrustColor(sourceInfo.trustScore) }]}>
              {sourceInfo.trustScore}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Trust Score</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: getBiasColor(sourceInfo.bias) + "20" }]}>
              <TrendingUp size={20} color={getBiasColor(sourceInfo.bias)} />
            </View>
            <Text style={[styles.metricValue, { color: getBiasColor(sourceInfo.bias) }]}>
              {sourceInfo.bias}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Political Bias</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.status.success + "20" }]}>
              <AlertCircle size={20} color={colors.status.success} />
            </View>
            <Text style={[styles.metricValue, { color: colors.status.success }]}>
              {sourceInfo.factualReporting}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Factual Reporting</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>About</Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {sourceInfo.description}
          </Text>
        </View>

        <View style={styles.articlesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Articles</Text>
          {sourceInfo.articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={[styles.articleCard, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
              onPress={() => openArticle(article.url)}
            >
              <View style={styles.articleContent}>
                <Text style={[styles.articleTitle, { color: colors.text.primary }]} numberOfLines={2}>
                  {article.title}
                </Text>
                <View style={styles.articleMeta}>
                  <Text style={[styles.articleTime, { color: colors.text.tertiary }]}>
                    {article.publishedAt}
                  </Text>
                  <View style={styles.articleMetrics}>
                    <View style={[styles.trustBadge, { backgroundColor: getTrustColor(article.trustScore) + "20" }]}>
                      <Text style={[styles.trustBadgeText, { color: getTrustColor(article.trustScore) }]}>
                        {article.trustScore}%
                      </Text>
                    </View>
                    <View style={[styles.biasBadge, { backgroundColor: getBiasColor(article.bias) + "20" }]}>
                      <Text style={[styles.biasBadgeText, { color: getBiasColor(article.bias) }]}>
                        {article.bias}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <ExternalLink size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sourceHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  sourceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  sourceName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  websiteButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  metricsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  metricLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  articlesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  articleContent: {
    flex: 1,
    gap: 8,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  articleTime: {
    fontSize: 12,
  },
  articleMetrics: {
    flexDirection: "row",
    gap: 6,
  },
  trustBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  biasBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  biasBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
});