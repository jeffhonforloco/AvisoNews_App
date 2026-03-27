import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Share,
  Animated,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Share2, Bookmark, Clock, ExternalLink, Eye, Tag } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNews } from "@/providers/NewsProvider";
import { useBookmarks } from "@/providers/BookmarkProvider";
import { useTheme } from "@/providers/ThemeProvider";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import TldrBox from "@/components/TldrBox";
import AttributionBar from "@/components/AttributionBar";
import RelatedArticles from "@/components/RelatedArticles";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams();
  const { articles, incrementViewCount } = useNews();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { theme, isDark } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  const article = articles.find(a => a.id === id);
  const bookmarked = article ? isBookmarked(article.id) : false;

  useEffect(() => {
    if (article) {
      incrementViewCount(article.id);
    }
  }, [article, incrementViewCount]);

  const handleReadFullArticle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (article?.canonicalUrl) {
      Linking.openURL(article.canonicalUrl);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: "clamp",
  });

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

  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.textSecondary }]}>Article not found</Text>
          <TouchableOpacity 
            style={[styles.goBackButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.tldr}\n\nRead more on AvisoNews`,
        url: article.canonicalUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBookmark = async () => {
    if (!article || isTogglingBookmark) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTogglingBookmark(true);
    try {
      await toggleBookmark(article.id);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      Alert.alert("Error", "Failed to update bookmark. Please try again.");
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  const relatedArticles = articles
    .filter(a => 
      a.id !== article.id && 
      (a.category === article.category || 
       a.tags?.some(tag => article.tags?.includes(tag)))
    )
    .slice(0, 3);

  const categoryColor = getCategoryColor(article.category);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={isDark 
            ? ["rgba(28,28,30,0.98)", "rgba(28,28,30,0.92)"] 
            : ["rgba(255,255,255,0.98)", "rgba(255,255,255,0.92)"]}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }} 
              style={[styles.headerButton, { backgroundColor: theme.inputBackground }]}
            >
              <ArrowLeft size={22} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
              {article.sourceName}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.headerButton, { backgroundColor: theme.inputBackground }]}
                onPress={handleBookmark}
                disabled={isTogglingBookmark}
              >
                <Bookmark size={20} color={theme.text} fill={bookmarked ? theme.text : "none"} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: theme.inputBackground, marginLeft: 8 }]} 
                onPress={handleShare}
              >
                <Share2 size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageOverlay}
          />
          <SafeAreaView edges={["top"]} style={styles.floatingHeader}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }} 
              style={styles.floatingButton}
            >
              <ArrowLeft size={22} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.floatingActions}>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleBookmark}
                disabled={isTogglingBookmark}
              >
                <Bookmark size={20} color="#1C1C1E" fill={bookmarked ? "#1C1C1E" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.floatingButton, { marginLeft: 8 }]} onPress={handleShare}>
                <Share2 size={20} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>

        <View style={[styles.content, { backgroundColor: theme.backgroundElevated }]}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>{article.titleAi || article.title}</Text>

          <View style={[styles.metaRow, { borderBottomColor: theme.border }]}>
            <View style={styles.metaItem}>
              <Clock size={14} color={theme.textTertiary} />
              <Text style={[styles.metaText, { color: theme.textTertiary }]}>{article.publishedAt}</Text>
            </View>
            <View style={styles.metaDivider} />
            <Text style={[styles.metaText, { color: theme.textTertiary }]}>{article.readTime} min read</Text>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Eye size={14} color={theme.textTertiary} />
              <Text style={[styles.metaText, { color: theme.textTertiary }]}>{article.viewCount}</Text>
            </View>
          </View>

          {article.tldr && <TldrBox tldr={article.tldr} />}

          <Text style={[styles.excerpt, { color: theme.textSecondary }]}>{article.excerpt}</Text>

          <TouchableOpacity
            style={[styles.readFullButton, { backgroundColor: theme.text }]}
            onPress={handleReadFullArticle}
            activeOpacity={0.8}
          >
            <ExternalLink size={18} color={theme.backgroundElevated} />
            <Text style={[styles.readFullButtonText, { color: theme.backgroundElevated }]}>
              Read Full Article
            </Text>
          </TouchableOpacity>

          <Text style={[styles.sourceHint, { color: theme.textTertiary }]}>
            Opens {article.sourceName} in your browser
          </Text>

          {article.tags && article.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <View style={styles.tagsHeader}>
                <Tag size={16} color={theme.textTertiary} />
                <Text style={[styles.tagsTitle, { color: theme.textSecondary }]}>Related Topics</Text>
              </View>
              <View style={styles.tagsContainer}>
                {article.tags.map((tag, index) => (
                  <View key={index} style={[styles.tag, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
                    <Text style={[styles.tagText, { color: theme.textSecondary }]}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <AttributionBar
            sourceName={article.sourceName}
            canonicalUrl={article.canonicalUrl}
          />

          {relatedArticles.length > 0 && (
            <RelatedArticles articles={relatedArticles} />
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  goBackButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerGradient: {
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: "row",
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingActions: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 380,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#1C1C1E",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  content: {
    padding: 24,
    marginTop: -40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 500,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C7C7CC",
    marginHorizontal: 12,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  readFullButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 10,
    marginBottom: 12,
  },
  readFullButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  sourceHint: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "500",
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tagsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
