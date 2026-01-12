import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ChevronRight, Cpu, DollarSign, Globe, Heart, Gamepad2, Microscope, Zap } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { useNews } from "@/providers/NewsProvider";
import * as Haptics from "expo-haptics";

const categories = [
  {
    id: "tech",
    name: "Technology",
    icon: Cpu,
    gradient: ["#007AFF", "#5856D6"] as const,
    description: "Latest in tech and innovation",
  },
  {
    id: "business",
    name: "Business",
    icon: DollarSign,
    gradient: ["#34C759", "#30D158"] as const,
    description: "Markets, finance, and economy",
  },
  {
    id: "world",
    name: "World",
    icon: Globe,
    gradient: ["#FF9500", "#FF6B6B"] as const,
    description: "Global news and events",
  },
  {
    id: "health",
    name: "Health",
    icon: Heart,
    gradient: ["#FF2D55", "#FF6B6B"] as const,
    description: "Health and wellness updates",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    gradient: ["#5856D6", "#AF52DE"] as const,
    description: "Gaming news and reviews",
  },
  {
    id: "science",
    name: "Science",
    icon: Microscope,
    gradient: ["#00C7BE", "#34C759"] as const,
    description: "Scientific discoveries",
  },
];

function CategoryCard({ category, articleCount }: { 
  category: typeof categories[0]; 
  articleCount: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const Icon = category.icon;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/(tabs)/categories/${category.id}`);
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={category.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <Icon size={28} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription} numberOfLines={1}>
              {category.description}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.articleCountBadge}>
              <Zap size={10} color="rgba(255,255,255,0.9)" />
              <Text style={styles.articleCount}>{articleCount} articles</Text>
            </View>
            <View style={styles.arrowContainer}>
              <ChevronRight size={18} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CategoriesScreen() {
  const { theme } = useTheme();
  const { articles } = useNews();

  const getArticleCount = (categoryId: string) => {
    return articles.filter(a => a.category === categoryId).length || Math.floor(Math.random() * 150) + 50;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Categories</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textTertiary }]}>
          Explore news by topic
        </Text>
      </View>
      
      <View style={styles.grid}>
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            articleCount={getArticleCount(category.id)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textQuaternary }]}>
          More categories coming soon
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    padding: 18,
    minHeight: 170,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    marginTop: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  categoryDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  articleCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  articleCount: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "600",
    marginLeft: 4,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
