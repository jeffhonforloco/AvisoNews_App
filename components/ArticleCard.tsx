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
import { Clock } from "lucide-react-native";

interface ArticleCardProps {
  article: Article;
  variant?: "large" | "small" | "compact";
}

export default function ArticleCard({ article, variant = "small" }: ArticleCardProps) {
  const handlePress = () => {
    router.push(`/article/${article.id}`);
  };

  if (variant === "compact") {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <Image source={{ uri: article.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactCategory}>{article.category.toUpperCase()}</Text>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.titleAi || article.title}
          </Text>
          <View style={styles.compactMeta}>
            <Text style={styles.compactSource}>{article.sourceName}</Text>
            <Text style={styles.compactTime}>{article.publishedAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const isLarge = variant === "large";

  return (
    <TouchableOpacity
      style={[styles.card, isLarge && styles.largeCard]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: article.imageUrl }}
        style={[styles.image, isLarge && styles.largeImage]}
      />
      <View style={styles.content}>
        <Text style={styles.category}>{article.category.toUpperCase()}</Text>
        <Text style={[styles.title, isLarge && styles.largeTitle]} numberOfLines={2}>
          {article.titleAi || article.title}
        </Text>
        {article.tldr && isLarge && (
          <Text style={styles.tldr} numberOfLines={2}>
            {article.tldr}
          </Text>
        )}
        <View style={styles.meta}>
          <Text style={styles.source}>{article.sourceName}</Text>
          <View style={styles.timeContainer}>
            <Clock size={12} color="#8E8E93" />
            <Text style={styles.time}>{article.publishedAt}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF6B6B",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    lineHeight: 20,
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  tldr: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 18,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  source: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
  },
  compactCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  compactCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF6B6B",
    letterSpacing: 0.5,
  },
  compactTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 19,
    marginVertical: 4,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactSource: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  compactTime: {
    fontSize: 11,
    color: "#C7C7CC",
    marginLeft: 8,
  },
});