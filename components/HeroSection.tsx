import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Article } from "@/types/news";

const { width: screenWidth } = Dimensions.get("window");

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(slideIndex);
  };

  const handlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.slide}
            onPress={() => handlePress(article.id)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: article.imageUrl }} style={styles.image} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradient}
            >
              <View style={styles.content}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {article.category.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.title} numberOfLines={3}>
                  {article.titleAi || article.title}
                </Text>
                <View style={styles.meta}>
                  <Text style={styles.source}>{article.sourceName}</Text>
                  <Text style={styles.time}>{article.publishedAt}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {articles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 450,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    width: screenWidth,
    height: 450,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    justifyContent: "flex-end",
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 32,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  source: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  time: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: "#FFFFFF",
  },
});