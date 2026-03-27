import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from "react-native";
import { router } from "expo-router";
import { Article } from "@/types/news";
import { useTheme } from "@/providers/ThemeProvider";
import { ArrowRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface RelatedArticlesProps {
  articles: Article[];
}

function RelatedCard({ article }: { article: Article }) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(`/article/${article.id}`);
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.inputBackground }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(article.category) }]} />
          <View style={styles.textContent}>
            <Text style={[styles.category, { color: getCategoryColor(article.category) }]}>
              {article.category.toUpperCase()}
            </Text>
            <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={2}>
              {article.titleAi || article.title}
            </Text>
            <Text style={[styles.source, { color: theme.textTertiary }]}>{article.sourceName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Related Articles</Text>
        <ArrowRight size={18} color={theme.textTertiary} />
      </View>
      {articles.map((article) => (
        <RelatedCard key={article.id} article={article} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  card: {
    flexDirection: "row",
    marginBottom: 14,
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: "#E5E5EA",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
  },
  categoryDot: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  category: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
    marginVertical: 4,
    letterSpacing: -0.1,
  },
  source: {
    fontSize: 11,
    fontWeight: "500",
  },
});
