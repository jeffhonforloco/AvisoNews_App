import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Article } from "@/types/news";

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const handlePress = (articleId: string) => {
    router.replace(`/article/${articleId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Related Articles</Text>
      {articles.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.card}
          onPress={() => handlePress(article.id)}
        >
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.category}>{article.category.toUpperCase()}</Text>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {article.titleAi || article.title}
            </Text>
            <Text style={styles.source}>{article.sourceName}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  category: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF6B6B",
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 18,
    marginVertical: 4,
  },
  source: {
    fontSize: 12,
    color: "#8E8E93",
  },
});