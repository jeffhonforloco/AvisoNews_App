import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { Article } from "@/types/news";
import ArticleCard from "./ArticleCard";

interface CategoryRailProps {
  title: string;
  category: string;
  articles: Article[];
  color?: string;
}

export default function CategoryRail({
  title,
  category,
  articles,
  color = "#007AFF",
}: CategoryRailProps) {
  const handleSeeAll = () => {
    router.push(`/category/${category}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.titleDot, { backgroundColor: color }]} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAll}>
          <Text style={[styles.seeAllText, { color }]}>See All</Text>
          <ChevronRight size={16} color={color} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.map((article, index) => (
          <View
            key={article.id}
            style={[
              styles.cardWrapper,
              index === 0 && styles.firstCard,
              index === articles.length - 1 && styles.lastCard,
            ]}
          >
            <ArticleCard
              article={article}
              variant={index === 0 ? "large" : "small"}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleDot: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginRight: 16,
  },
  firstCard: {
    marginRight: 16,
  },
  lastCard: {
    marginRight: 0,
  },
});