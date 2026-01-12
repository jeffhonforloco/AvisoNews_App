import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Article } from "@/types/news";
import { useTheme } from "@/providers/ThemeProvider";
import { Clock, TrendingUp } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface ArticleCardProps {
  article: Article;
  variant?: "large" | "small" | "compact";
}

export default function ArticleCard({ article, variant = "small" }: ArticleCardProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/article/${article.id}`);
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      tech: "#007AFF",
      business: "#34C759",
      world: "#FF9500",
      science: "#AF52DE",
      sports: "#FF2D55",
      entertainment: "#5856D6",
    };
    return colors[category] || theme.primary;
  };

  if (variant === "compact") {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={[styles.compactCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]} 
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Image source={{ uri: article.imageUrl }} style={styles.compactImage} />
          <View style={styles.compactContent}>
            <View style={styles.compactHeader}>
              <View style={[styles.compactCategoryDot, { backgroundColor: getCategoryColor(article.category) }]} />
              <Text style={[styles.compactCategory, { color: getCategoryColor(article.category) }]}>
                {article.category.toUpperCase()}
              </Text>
              {article.trending && (
                <TrendingUp size={12} color={theme.primary} style={{ marginLeft: 6 }} />
              )}
            </View>
            <Text style={[styles.compactTitle, { color: theme.text }]} numberOfLines={2}>
              {article.titleAi || article.title}
            </Text>
            <View style={styles.compactMeta}>
              <Text style={[styles.compactSource, { color: theme.textTertiary }]}>{article.sourceName}</Text>
              <View style={styles.compactTimeBadge}>
                <Clock size={10} color={theme.textQuaternary} />
                <Text style={[styles.compactTime, { color: theme.textQuaternary }]}>{article.publishedAt}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const isLarge = variant === "large";

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card, 
          isLarge && styles.largeCard,
          { backgroundColor: theme.cardBackground }
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl }}
            style={[styles.image, isLarge && styles.largeImage]}
          />
          <View style={[styles.categoryOverlay, { backgroundColor: getCategoryColor(article.category) }]}>
            <Text style={styles.categoryOverlayText}>{article.category.toUpperCase()}</Text>
          </View>
          {article.trending && (
            <View style={styles.trendingOverlay}>
              <TrendingUp size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, isLarge && styles.largeTitle, { color: theme.text }]} numberOfLines={2}>
            {article.titleAi || article.title}
          </Text>
          {article.tldr && isLarge && (
            <Text style={[styles.tldr, { color: theme.textTertiary }]} numberOfLines={2}>
              {article.tldr}
            </Text>
          )}
          <View style={styles.meta}>
            <View style={styles.sourceRow}>
              <View style={[styles.sourceDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.source, { color: theme.textTertiary }]}>{article.sourceName}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={12} color={theme.textQuaternary} />
              <Text style={[styles.time, { color: theme.textQuaternary }]}>{article.publishedAt}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  largeCard: {
    width: 320,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#E5E5EA",
  },
  largeImage: {
    height: 190,
  },
  categoryOverlay: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  categoryOverlayText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  trendingOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,107,107,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  largeTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  tldr: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: "400",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 6,
  },
  source: {
    fontSize: 12,
    fontWeight: "600",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "500",
  },
  compactCard: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
  },
  compactImage: {
    width: 110,
    height: 110,
    backgroundColor: "#E5E5EA",
  },
  compactContent: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactCategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  compactCategory: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    marginVertical: 6,
    letterSpacing: -0.2,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compactSource: {
    fontSize: 12,
    fontWeight: "500",
  },
  compactTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactTime: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: "500",
  },
});
