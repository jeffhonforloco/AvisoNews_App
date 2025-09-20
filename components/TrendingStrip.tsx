import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { TrendingUp } from "lucide-react-native";
import { Article } from "@/types/news";
import { router } from "expo-router";

interface TrendingStripProps {
  articles: Article[];
}

export default function TrendingStrip({ articles }: TrendingStripProps) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: false,
      })
    );
    scrollAnimation.start();

    return () => scrollAnimation.stop();
  }, []);

  const handlePress = (articleId: string) => {
    router.push(`/article/${articleId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={18} color="#FF6B6B" />
        <Text style={styles.title}>Trending Now</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {articles.map((article, index) => (
          <TouchableOpacity
            key={article.id}
            style={styles.item}
            onPress={() => handlePress(article.id)}
          >
            <Text style={styles.number}>{index + 1}</Text>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {article.titleAi || article.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5EA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  number: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF6B6B",
    marginRight: 10,
    minWidth: 20,
  },
  itemTitle: {
    fontSize: 14,
    color: "#1C1C1E",
    maxWidth: 250,
  },
});