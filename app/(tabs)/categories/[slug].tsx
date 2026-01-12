import React, { useMemo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNews } from "@/providers/NewsProvider";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types/news";
import { Analytics } from "@/services/analytics";

const categoryGradients: Record<string, readonly [string, string]> = {
  tech: ["#667EEA", "#764BA2"],
  business: ["#F093FB", "#F5576C"],
  world: ["#4FACFE", "#00F2FE"],
  health: ["#FA709A", "#FEE140"],
  gaming: ["#30CFD0", "#330867"],
  science: ["#A8EDEA", "#FED6E3"],
};

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { articles, categories } = useNews();

  const category = categories.find((c) => c.slug === slug);
  const categoryArticles = useMemo(
    () => articles.filter((a) => a.category === slug),
    [articles, slug]
  );

  const gradient = categoryGradients[slug || "tech"] || ["#667EEA", "#764BA2"];

  useEffect(() => {
    if (category && categoryArticles) {
      Analytics.trackCategoryView(category.name, categoryArticles.length);
    }
  }, [category, categoryArticles.length]);

  const renderArticle = ({ item }: { item: Article }) => (
    <ArticleCard article={item} variant="small" />
  );

  const renderHeader = () => (
    <View style={styles.headerInfo}>
      <Text style={styles.categoryName}>{category?.name || "Category"}</Text>
      <Text style={styles.articleCount}>
        {categoryArticles.length} {categoryArticles.length === 1 ? "article" : "articles"}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No articles found in this category</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradient} style={styles.header}>
        <SafeAreaView edges={["top"]} style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <View style={styles.backButtonBg}>
              <ArrowLeft size={22} color="#1C1C1E" />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <FlatList
        data={categoryArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonBg: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginTop: -30,
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  categoryName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
});
