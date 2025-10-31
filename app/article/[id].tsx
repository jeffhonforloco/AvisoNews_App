import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Share2, Bookmark, ExternalLink, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { trpc } from "@/lib/trpc";
import { useNews } from "@/providers/NewsProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import TldrBox from "@/components/TldrBox";
import AttributionBar from "@/components/AttributionBar";
import RelatedArticles from "@/components/RelatedArticles";
import EnhancedAggregator from "@/components/EnhancedAggregator";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { articles, incrementViewCount } = useNews();
  const { incrementArticlesRead } = useAuth();
  const { colors, isDark } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Fetch article from API if not in local list
  const articleQuery = trpc.news.articles.byId.useQuery(
    { id: id || "" },
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    }
  );

  // Get related articles from API
  const relatedArticlesQuery = trpc.news.articles.related.useQuery(
    { articleId: id || "", limit: 3 },
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    }
  );
  
  // Use article from API query if available, otherwise fall back to local list
  const article = articleQuery.data || articles.find(a => a.id === id);
  const relatedArticles = relatedArticlesQuery.data?.articles || [];

  useEffect(() => {
    if (article) {
      incrementViewCount(article.id);
      // Track article read for auth prompt
      incrementArticlesRead();
    }
  }, [article?.id]);

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

  if (articleQuery.isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading article...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text.primary }]}>
            Article not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
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


  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <BlurView intensity={95} tint={isDark ? "dark" : "light"} style={styles.headerBlur}>
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Bookmark size={22} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
                <Share2 size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BlurView>
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
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
        </Animated.View>

        <View style={[styles.content, { backgroundColor: colors.background.primary }]}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.categories[article.category.toLowerCase() as keyof typeof colors.categories] || colors.primary }]}>
            <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text.primary }]}>{article.titleAi || article.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>{article.publishedAt}</Text>
            </View>
            <Text style={[styles.metaDot, { color: colors.text.tertiary }]}>•</Text>
            <Text style={[styles.metaText, { color: colors.text.secondary }]}>{article.readTime || 5} min read</Text>
            <Text style={[styles.metaDot, { color: colors.text.tertiary }]}>•</Text>
            <Text style={[styles.metaText, { color: colors.text.secondary }]}>{article.viewCount} views</Text>
          </View>

          {article.tldr && <TldrBox tldr={article.tldr} />}

          {/* Enhanced Aggregator */}
          <EnhancedAggregator article={article} />



          <Text style={[styles.excerpt, { color: colors.text.secondary }]}>{article.excerpt}</Text>

          <View style={styles.articleContent}>
            <Text style={[styles.paragraph, { color: colors.text.primary }]}>
              {article.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Text style={[styles.paragraph, { color: colors.text.primary }]}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text style={[styles.paragraph, { color: colors.text.primary }]}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
              architecto beatae vitae dicta sunt explicabo.
            </Text>
          </View>

          {article.tags && article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {article.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <AttributionBar
            sourceName={article.sourceName}
            canonicalUrl={article.canonicalUrl}
          />

          {relatedArticles && relatedArticles.length > 0 && (
            <RelatedArticles articles={relatedArticles} />
          )}
        </View>
      </Animated.ScrollView>

      <SafeAreaView edges={["top"]} style={styles.floatingHeader}>
        <BlurView intensity={95} tint={isDark ? "dark" : "light"} style={styles.floatingHeaderBlur}>
          <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackButton}>
            <View style={[styles.floatingButtonBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]}>
              <ArrowLeft size={22} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.floatingAction}>
              <View style={[styles.floatingButtonBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]}>
                <Bookmark size={20} color={colors.text.primary} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingAction} onPress={handleShare}>
              <View style={[styles.floatingButtonBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }]}>
                <Share2 size={20} color={colors.text.primary} />
              </View>
            </TouchableOpacity>
          </View>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBlur: {
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  floatingHeaderBlur: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  floatingBackButton: {
    padding: 4,
  },
  floatingActions: {
    flexDirection: "row",
  },
  floatingAction: {
    padding: 4,
    marginLeft: 8,
  },
  floatingButtonBg: {
    borderRadius: 22,
    padding: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 400,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  content: {
    padding: 24,
    marginTop: -40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
  metaDot: {
    fontSize: 13,
    marginHorizontal: 10,
    fontWeight: "300",
  },
  excerpt: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "500",
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  articleContent: {
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 20,
    letterSpacing: -0.1,
    fontWeight: "400",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  tag: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#1C1C1E",
    fontWeight: "500",
  },
});