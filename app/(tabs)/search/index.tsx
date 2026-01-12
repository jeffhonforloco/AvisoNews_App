import React, { useState, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, TrendingUp, Clock, Sparkles } from "lucide-react-native";
import { useNews } from "@/providers/NewsProvider";
import { useTheme } from "@/providers/ThemeProvider";
import ArticleCard from "@/components/ArticleCard";
import * as Haptics from "expo-haptics";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "AI Technology",
    "Stock Market",
    "Climate Change",
    "Electric Vehicles",
  ]);
  const { articles } = useNews();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return articles.filter(
      article =>
        article.title.toLowerCase().includes(query) ||
        article.tldr?.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery, articles]);

  const trendingTopics = [
    { text: "Artificial Intelligence", emoji: "🤖" },
    { text: "Cryptocurrency", emoji: "💰" },
    { text: "Space Exploration", emoji: "🚀" },
    { text: "Renewable Energy", emoji: "⚡" },
    { text: "Quantum Computing", emoji: "🔮" },
  ];

  const handleSearch = (query: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 3)]);
    }
  };

  const clearSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const removeRecentSearch = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { backgroundColor: theme.backgroundElevated, borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Search</Text>
          <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
            <Search size={20} color={theme.textTertiary} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search news, topics, sources..."
              placeholderTextColor={theme.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={clearSearch} 
                style={[styles.clearButton, { backgroundColor: theme.textQuaternary }]}
              >
                <X size={14} color={theme.backgroundElevated} />
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
              <View style={styles.resultsHeader}>
                <Sparkles size={18} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {searchResults.length} Results
                </Text>
              </View>
              {searchResults.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
              {searchResults.length === 0 && (
                <View style={styles.noResults}>
                  <View style={[styles.noResultsIcon, { backgroundColor: theme.inputBackground }]}>
                    <Search size={32} color={theme.textQuaternary} />
                  </View>
                  <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>No articles found</Text>
                  <Text style={[styles.noResultsSubtext, { color: theme.textTertiary }]}>
                    Try searching for different keywords
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Clock size={18} color={theme.textTertiary} />
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    {recentSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.tag, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}
                        onPress={() => handleSearch(search)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.tagText, { color: theme.text }]}>{search}</Text>
                        <TouchableOpacity 
                          onPress={() => removeRecentSearch(index)}
                          style={styles.tagRemove}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <X size={12} color={theme.textQuaternary} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={18} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Topics</Text>
                </View>
                <View style={styles.trendingContainer}>
                  {trendingTopics.map((topic, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.trendingTag, { backgroundColor: theme.primary + "12" }]}
                      onPress={() => handleSearch(topic.text)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.trendingEmoji}>{topic.emoji}</Text>
                      <Text style={[styles.trendingTagText, { color: theme.primary }]}>{topic.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.suggestionsSection}>
                <Text style={[styles.suggestionsTitle, { color: theme.textQuaternary }]}>
                  💡 Try searching for topics, sources, or keywords
                </Text>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
    letterSpacing: -0.2,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tagRemove: {
    marginLeft: 8,
    padding: 2,
  },
  trendingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trendingTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  trendingTagText: {
    fontWeight: "600",
    fontSize: 14,
  },
  results: {
    padding: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 48,
  },
  noResultsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
  },
  suggestionsSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 40,
  },
  suggestionsTitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
