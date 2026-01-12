import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Article } from "@/types/news";
import { useTheme } from "@/providers/ThemeProvider";
import { Clock, Eye } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const { width: screenWidth } = Dimensions.get("window");

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const { theme, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % articles.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, articles.length]);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (slideIndex !== activeIndex) {
      setActiveIndex(slideIndex);
      Haptics.selectionAsync();
    }
  };

  const handlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
      router.push(`/article/${articleId}`);
    });
  };

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

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {articles.map((article, index) => (
          <TouchableOpacity
            key={article.id}
            style={styles.slide}
            onPress={() => handlePress(article.id)}
            activeOpacity={0.95}
          >
            <Image source={{ uri: article.imageUrl }} style={styles.image} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]}
              locations={[0, 0.5, 1]}
              style={styles.gradient}
            >
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
                    <Text style={styles.categoryText}>
                      {article.category.toUpperCase()}
                    </Text>
                  </View>
                  {article.trending && (
                    <View style={styles.trendingBadge}>
                      <Text style={styles.trendingText}>🔥 TRENDING</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title} numberOfLines={3}>
                  {article.titleAi || article.title}
                </Text>
                <View style={styles.meta}>
                  <View style={styles.sourceContainer}>
                    <View style={styles.sourceDot} />
                    <Text style={styles.source}>{article.sourceName}</Text>
                  </View>
                  <View style={styles.metaRight}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.metaText}>{article.publishedAt}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Eye size={12} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.metaText}>{article.viewCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.paginationContainer}>
        <View style={[styles.paginationBg, { backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.3)" }]}>
          {articles.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                Haptics.selectionAsync();
                scrollViewRef.current?.scrollTo({
                  x: index * screenWidth,
                  animated: true,
                });
              }}
              style={styles.paginationTouchable}
            >
              <View
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 420,
  },
  slide: {
    width: screenWidth,
    height: 420,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1C1C1E",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    justifyContent: "flex-end",
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  trendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  trendingText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 32,
    marginBottom: 16,
    letterSpacing: -0.3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B6B",
    marginRight: 8,
  },
  source: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  metaText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
    fontWeight: "500",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  paginationBg: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  paginationTouchable: {
    padding: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: "#FFFFFF",
  },
});
