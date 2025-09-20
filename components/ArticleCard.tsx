import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Article } from "@/types/news";
import { Clock, Play, Headphones } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { usePreferences } from "@/providers/PreferencesProvider";
import TrustIndicator from "./TrustIndicator";
import BiasIndicator from "./BiasIndicator";
import FactCheckBadge from "./FactCheckBadge";
import AdvancedAggregator from "./AdvancedAggregator";

interface ArticleCardProps {
  article: Article;
  variant?: "large" | "small" | "compact";
  showTrustMetrics?: boolean;
}

export default function ArticleCard({ article, variant = "small", showTrustMetrics = true }: ArticleCardProps) {
  const { colors } = useTheme();
  const { preferences } = usePreferences();
  
  const handlePress = () => {
    router.push(`/article/${article.id}`);
  };

  const shouldShowTrustMetrics = showTrustMetrics && preferences.readingPreferences.showTrustScores;
  const shouldShowBiasIndicators = preferences.readingPreferences.showBiasIndicators;
  const shouldShowFactChecks = preferences.readingPreferences.showFactChecks;

  if (variant === "compact") {
    return (
      <TouchableOpacity style={[styles.compactCard, { backgroundColor: colors.background.card }]} onPress={handlePress}>
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.compactImage} />
          {article.audioUrl && (
            <View style={styles.audioOverlay}>
              <Headphones size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={[styles.compactCategory, { color: colors.primary }]}>{article.category.toUpperCase()}</Text>
            {article.isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={[styles.compactTitle, { color: colors.text.primary }]} numberOfLines={2}>
            {article.titleAi || article.title}
          </Text>
          
          {/* Trust and Bias Indicators */}
          {(shouldShowTrustMetrics || shouldShowBiasIndicators || shouldShowFactChecks) && (
            <View style={styles.compactIndicators}>
              {shouldShowTrustMetrics && article.trustScore && (
                <TrustIndicator trustScore={article.trustScore} size="small" />
              )}
              {shouldShowBiasIndicators && article.biasAnalysis && (
                <BiasIndicator biasAnalysis={article.biasAnalysis} size="small" />
              )}
              {shouldShowFactChecks && article.factCheck && (
                <FactCheckBadge factCheck={article.factCheck} size="small" />
              )}
            </View>
          )}
          
          <View style={styles.compactMeta}>
            <Text style={[styles.compactSource, { color: colors.text.secondary }]}>{article.sourceName}</Text>
            <Text style={[styles.compactTime, { color: colors.text.tertiary }]}>{article.publishedAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const isLarge = variant === "large";

  return (
    <TouchableOpacity
      style={[styles.card, isLarge && styles.largeCard, { backgroundColor: colors.background.card, shadowColor: colors.shadow }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: article.imageUrl }}
          style={[styles.image, isLarge && styles.largeImage]}
        />
        {article.audioUrl && (
          <View style={styles.audioOverlay}>
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
        {article.isPremium && (
          <View style={[styles.premiumOverlay, { backgroundColor: colors.primary }]}>
            <Text style={styles.premiumOverlayText}>PRO</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.category, { color: colors.primary }]}>{article.category.toUpperCase()}</Text>
          {article.trending && (
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingText}>🔥 TRENDING</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.title, isLarge && styles.largeTitle, { color: colors.text.primary }]} numberOfLines={2}>
          {article.titleAi || article.title}
        </Text>
        
        {article.tldr && isLarge && (
          <Text style={[styles.tldr, { color: colors.text.secondary }]} numberOfLines={2}>
            {article.tldr}
          </Text>
        )}
        
        {/* Advanced Aggregator for Large Cards */}
        {isLarge && article.aggregatorData && (
          <AdvancedAggregator
            storyId={article.id}
            totalSources={article.aggregatorData.totalSources}
            politicalBias={article.aggregatorData.politicalBias}
            averageTrustScore={article.aggregatorData.averageTrustScore}
            factCheckStatus={article.aggregatorData.factCheckStatus}
            controversyLevel={article.aggregatorData.controversyLevel}
            coverageGaps={article.aggregatorData.coverageGaps}
            onViewFullAnalysis={() => router.push(`/article/${article.id}?tab=analysis`)}
          />
        )}
        
        {/* Trust and Accountability Indicators for Small Cards */}
        {!isLarge && (shouldShowTrustMetrics || shouldShowBiasIndicators || shouldShowFactChecks) && (
          <View style={styles.indicators}>
            {shouldShowTrustMetrics && article.trustScore && (
              <TrustIndicator trustScore={article.trustScore} size="small" />
            )}
            {shouldShowBiasIndicators && article.biasAnalysis && (
              <BiasIndicator biasAnalysis={article.biasAnalysis} size="small" />
            )}
            {shouldShowFactChecks && article.factCheck && (
              <FactCheckBadge factCheck={article.factCheck} size="small" />
            )}
          </View>
        )}
        
        <View style={styles.meta}>
          <Text style={[styles.source, { color: colors.text.secondary }]}>{article.sourceName}</Text>
          <View style={styles.metaRight}>
            {article.readTime && (
              <View style={styles.timeContainer}>
                <Clock size={12} color={colors.text.tertiary} />
                <Text style={[styles.time, { color: colors.text.tertiary }]}>{article.readTime}m</Text>
              </View>
            )}
            <Text style={[styles.time, { color: colors.text.tertiary }]}>{article.publishedAt}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: 16,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  largeCard: {
    width: 320,
  },
  image: {
    width: "100%",
    height: 160,
  },
  largeImage: {
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  tldr: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  indicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  audioOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 6,
  },
  premiumOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumOverlayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trendingBadge: {
    backgroundColor: '#FF6B6B20',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendingText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  source: {
    fontSize: 13,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    marginLeft: 4,
  },
  compactCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactImageContainer: {
    position: 'relative',
  },
  compactImage: {
    width: 100,
    height: 100,
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactCategory: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  premiumBadge: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19,
    marginVertical: 4,
  },
  compactIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginVertical: 4,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactSource: {
    fontSize: 12,
    fontWeight: "500",
  },
  compactTime: {
    fontSize: 11,
    marginLeft: 8,
  },
});