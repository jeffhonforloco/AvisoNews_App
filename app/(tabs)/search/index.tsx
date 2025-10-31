import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, TrendingUp, Clock } from "lucide-react-native";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import { Article } from "@/types/news";
import { useTheme } from "@/providers/ThemeProvider";
import ArticleCard from "@/components/ArticleCard";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "AI Technology",
    "Stock Market",
    "Climate Change",
    "Electric Vehicles",
  ]);
  const { colors } = useTheme();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Search when query changes
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      setIsSearching(true);
      api.searchArticles(debouncedSearchQuery, 50)
        .then((results) => {
          setSearchResults(results);
          setIsSearching(false);
        })
        .catch((err) => {
          console.error("Search error:", err);
          setIsSearching(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const trendingTopics = [
    "Artificial Intelligence",
    "Cryptocurrency",
    "Space Exploration",
    "Renewable Energy",
    "Quantum Computing",
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 3)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>
          <View style={styles.searchContainer}>
            <Search size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search news, topics, sources..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={18} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {searchQuery.length > 0 ? (
            <View style={styles.results}>
              {searchQueryResult.isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                    Searching...
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    {searchQueryResult.data?.total || 0} Results for "{searchQuery}"
                  </Text>
                  {searchResults.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                  {searchResults.length === 0 && !searchQueryResult.isLoading && (
                    <View style={styles.noResults}>
                      <Text style={[styles.noResultsText, { color: colors.text.secondary }]}>
                        No articles found
                      </Text>
                      <Text style={[styles.noResultsSubtext, { color: colors.text.tertiary }]}>
                        Try searching for different keywords
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Clock size={18} color="#8E8E93" />
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    {recentSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.tag}
                        onPress={() => handleSearch(search)}
                      >
                        <Text style={styles.tagText}>{search}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={18} color="#FF6B6B" />
                  <Text style={styles.sectionTitle}>Trending Topics</Text>
                </View>
                <View style={styles.tagContainer}>
                  {trendingTopics.map((topic, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.tag, styles.trendingTag]}
                      onPress={() => handleSearch(topic)}
                    >
                      <Text style={styles.trendingTagText}>{topic}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  tagText: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  trendingTag: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FFE5E5",
  },
  trendingTagText: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  results: {
    padding: 20,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#C7C7CC",
  },
});