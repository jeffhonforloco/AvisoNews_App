import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TrendingUp, Flame } from "lucide-react-native";
import { Article } from "@/types/news";
import { router } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import * as Haptics from "expo-haptics";

interface TrendingStripProps {
  articles: Article[];
}

export default function TrendingStrip({ articles }: TrendingStripProps) {
  const { theme } = useTheme();

  const handlePress = (articleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/article/${articleId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <TrendingUp size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Trending Now</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
      >
        {articles.map((article, index) => (
          <TouchableOpacity
            key={article.id}
            style={[styles.item, { backgroundColor: theme.inputBackground }]}
            onPress={() => handlePress(article.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.numberBadge, index < 3 && styles.topThreeBadge]}>
              {index < 3 ? (
                <Flame size={12} color="#FFFFFF" />
              ) : (
                <Text style={styles.number}>{index + 1}</Text>
              )}
            </View>
            <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1}>
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
    paddingVertical: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,59,48,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF3B30",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  topThreeBadge: {
    backgroundColor: "#FF6B6B",
  },
  number: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: 220,
    letterSpacing: -0.2,
  },
});
