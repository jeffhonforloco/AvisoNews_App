import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { ArrowLeft, Filter, Grid, List } from "lucide-react-native";
import { useNews } from "@/providers/NewsProvider";
import ArticleCard from "@/components/ArticleCard";

type ViewMode = "grid" | "list";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const { articles, isLoading, refetch } = useNews();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const categoryArticles = articles.filter(article => article.category === slug);
  
  const categoryName = slug === "tech" ? "Technology" :
                      slug === "business" ? "Business" :
                      slug === "world" ? "World" :
                      slug === "health" ? "Health" :
                      slug === "gaming" ? "Gaming" :
                      slug === "science" ? "Science" :
                      String(slug).charAt(0).toUpperCase() + String(slug).slice(1);

  return (
    <>
      <Stack.Screen 
        options={{
          title: categoryName,
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#1C1C1E" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Filter size={22} color="#1C1C1E" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? (
                  <List size={22} color="#1C1C1E" />
                ) : (
                  <Grid size={22} color="#1C1C1E" />
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {categoryArticles.length} articles in {categoryName}
          </Text>
        </View>
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            viewMode === "grid" && styles.gridContent
          ]}
          showsVerticalScrollIndicator={false}
        >
          {viewMode === "list" ? (
            categoryArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
              />
            ))
          ) : (
            <View style={styles.grid}>
              {categoryArticles.map((article) => (
                <View key={article.id} style={styles.gridItem}>
                  <ArticleCard
                    article={article}
                    variant="small"
                  />
                </View>
              ))}
            </View>
          )}
          
          {categoryArticles.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No articles found</Text>
              <Text style={styles.emptySubtitle}>
                Check back later for new {categoryName.toLowerCase()} articles
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gridContent: {
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#C7C7CC",
    textAlign: "center",
  },
});