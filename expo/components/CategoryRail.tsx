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
import { useTheme } from "@/providers/ThemeProvider";
import ArticleCard from "./ArticleCard";
import * as Haptics from "expo-haptics";

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
  const { theme } = useTheme();

  const handleSeeAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(tabs)/categories/${category}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.titleDot, { backgroundColor: color }]} />
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.seeAllButton, { backgroundColor: color + "15" }]} 
          onPress={handleSeeAll}
          activeOpacity={0.7}
        >
          <Text style={[styles.seeAllText, { color }]}>See All</Text>
          <ChevronRight size={14} color={color} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
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
    height: 22,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
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
