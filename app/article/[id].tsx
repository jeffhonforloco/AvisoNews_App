import React, { useEffect, useRef, useState } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Share2, Bookmark, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNews } from "@/providers/NewsProvider";
import { useBookmarks } from "@/providers/BookmarkProvider";
import { NewsAggregator } from "@/services/newsAggregator";
import TldrBox from "@/components/TldrBox";
import AttributionBar from "@/components/AttributionBar";
import RelatedArticles from "@/components/RelatedArticles";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams();
  const { articles, incrementViewCount } = useNews();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  const [articleContent, setArticleContent] = useState<string>("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const article = articles.find(a => a.id === id);
  const bookmarked = article ? isBookmarked(article.id) : false;

  useEffect(() => {
    if (article) {
      incrementViewCount(article.id);
    }
  }, [article?.id]);

  useEffect(() => {
    const fetchContent = async () => {
      if (article?.canonicalUrl && !articleContent) {
        setIsLoadingContent(true);
        try {
          const content = await NewsAggregator.fetchArticleContent(article.canonicalUrl);
          setArticleContent(content);
        } catch (error) {
          console.error("Error fetching article content:", error);
          // Fallback to excerpt if content fetch fails
          setArticleContent(article.excerpt);
        } finally {
          setIsLoadingContent(false);
        }
      }
    };

    fetchContent();
  }, [article?.canonicalUrl]);

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

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Article not found</Text>
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

  const handleBookmark = async () => {
    if (!article || isTogglingBookmark) return;

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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(255,255,255,0.95)"]}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
              <ArrowLeft size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerAction}
                onPress={handleBookmark}
                disabled={isTogglingBookmark}
                accessibilityLabel={bookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <Bookmark size={22} color="#1C1C1E" fill={bookmarked ? "#1C1C1E" : "none"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={handleShare} accessibilityLabel="Share article">
                <Share2 size={22} color="#1C1C1E" />
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
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={styles.imageOverlay}
          />
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{article.titleAi || article.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.metaText}>{article.publishedAt}</Text>
            </View>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{article.readTime} min read</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{article.viewCount} views</Text>
          </View>

          {article.tldr && <TldrBox tldr={article.tldr} />}

          <Text style={styles.excerpt}>{article.excerpt}</Text>

          <View style={styles.articleContent}>
            {isLoadingContent ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading full article...</Text>
              </View>
            ) : articleContent ? (
              articleContent.split('\n\n').map((paragraph, index) => (
                <Text key={index} style={styles.paragraph}>
                  {paragraph.trim()}
                </Text>
              ))
            ) : (
              <Text style={styles.paragraph}>
                {article.excerpt}
              </Text>
            )}
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

          {relatedArticles.length > 0 && (
            <RelatedArticles articles={relatedArticles} />
          )}
        </View>
      </Animated.ScrollView>

      <SafeAreaView edges={["top"]} style={styles.floatingHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackButton} accessibilityLabel="Go back">
          <View style={styles.floatingButtonBg}>
            <ArrowLeft size={22} color="#1C1C1E" />
          </View>
        </TouchableOpacity>
        <View style={styles.floatingActions}>
          <TouchableOpacity
            style={styles.floatingAction}
            onPress={handleBookmark}
            disabled={isTogglingBookmark}
            accessibilityLabel={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <View style={styles.floatingButtonBg}>
              <Bookmark size={20} color="#1C1C1E" fill={bookmarked ? "#1C1C1E" : "none"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingAction} onPress={handleShare} accessibilityLabel="Share article">
            <View style={styles.floatingButtonBg}>
              <Share2 size={20} color="#1C1C1E" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
  },
  headerAction: {
    padding: 10,
    marginLeft: 8,
    borderRadius: 12,
  },
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 50,
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
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 420,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  content: {
    padding: 24,
    marginTop: -44,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 18,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0A0A0A",
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 6,
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 13,
    color: "#D1D1D6",
    marginHorizontal: 10,
  },
  excerpt: {
    fontSize: 19,
    lineHeight: 30,
    color: "#2C2C2E",
    fontWeight: "600",
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  articleContent: {
    marginBottom: 32,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    color: "#1C1C1E",
    marginBottom: 20,
    fontWeight: "400",
    letterSpacing: -0.1,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 15,
    color: "#8E8E93",
    fontStyle: "italic",
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 28,
    gap: 8,
  },
  tag: {
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E8ED",
  },
  tagText: {
    fontSize: 13,
    color: "#3A3A3C",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});