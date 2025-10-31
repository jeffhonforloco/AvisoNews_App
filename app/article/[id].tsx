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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Share2, Bookmark, ExternalLink, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNews } from "@/providers/NewsProvider";
import TldrBox from "@/components/TldrBox";
import AttributionBar from "@/components/AttributionBar";
import RelatedArticles from "@/components/RelatedArticles";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams();
  const { articles, incrementViewCount } = useNews();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const article = articles.find(a => a.id === id);

  useEffect(() => {
    if (article) {
      incrementViewCount(article.id);
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Bookmark size={22} color="#1C1C1E" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
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
            <Text style={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Text style={styles.paragraph}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <Text style={styles.paragraph}>
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

          {relatedArticles.length > 0 && (
            <RelatedArticles articles={relatedArticles} />
          )}
        </View>
      </Animated.ScrollView>

      <SafeAreaView edges={["top"]} style={styles.floatingHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackButton}>
          <View style={styles.floatingButtonBg}>
            <ArrowLeft size={22} color="#1C1C1E" />
          </View>
        </TouchableOpacity>
        <View style={styles.floatingActions}>
          <TouchableOpacity style={styles.floatingAction}>
            <View style={styles.floatingButtonBg}>
              <Bookmark size={20} color="#1C1C1E" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingAction} onPress={handleShare}>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerGradient: {
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    padding: 20,
    marginTop: -40,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    lineHeight: 34,
    marginBottom: 12,
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
    color: "#8E8E93",
    marginLeft: 4,
  },
  metaDot: {
    fontSize: 13,
    color: "#C7C7CC",
    marginHorizontal: 8,
  },
  excerpt: {
    fontSize: 18,
    lineHeight: 26,
    color: "#3C3C43",
    fontWeight: "500",
    marginBottom: 24,
  },
  articleContent: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1C1C1E",
    marginBottom: 16,
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