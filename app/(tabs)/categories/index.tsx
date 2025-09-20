import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ChevronRight, Cpu, DollarSign, Globe, Heart, Gamepad2, Microscope } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const categories = [
  {
    id: "tech",
    name: "Technology",
    icon: Cpu,
    gradient: ["#667EEA", "#764BA2"] as const,
    description: "Latest in tech and innovation",
    count: 156,
  },
  {
    id: "business",
    name: "Business",
    icon: DollarSign,
    gradient: ["#F093FB", "#F5576C"] as const,
    description: "Markets, finance, and economy",
    count: 243,
  },
  {
    id: "world",
    name: "World",
    icon: Globe,
    gradient: ["#4FACFE", "#00F2FE"] as const,
    description: "Global news and events",
    count: 189,
  },
  {
    id: "health",
    name: "Health",
    icon: Heart,
    gradient: ["#FA709A", "#FEE140"] as const,
    description: "Health and wellness updates",
    count: 97,
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    gradient: ["#30CFD0", "#330867"] as const,
    description: "Gaming news and reviews",
    count: 64,
  },
  {
    id: "science",
    name: "Science",
    icon: Microscope,
    gradient: ["#A8EDEA", "#FED6E3"] as const,
    description: "Scientific discoveries",
    count: 82,
  },
];

export default function CategoriesScreen() {
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Explore news by topic</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.card}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={category.gradient}
                style={styles.cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.iconContainer}>
                  <Icon size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.articleCount}>{category.count} articles</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 180,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleCount: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
});