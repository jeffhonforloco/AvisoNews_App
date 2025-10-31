import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNews } from "@/providers/NewsProvider";
import HeroSection from "@/components/HeroSection";
import CategoryRail from "@/components/CategoryRail";
import TrendingStrip from "@/components/TrendingStrip";
import NewsletterCTA from "@/components/NewsletterCTA";
import { LinearGradient } from "expo-linear-gradient";
import { Bell } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const { articles, isLoading, refetch } = useNews();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const techArticles = articles.filter(a => a.category === "tech").slice(0, 5);
  const businessArticles = articles.filter(a => a.category === "business").slice(0, 5);
  const worldArticles = articles.filter(a => a.category === "world").slice(0, 5);
  const heroArticles = articles.slice(0, 5);
  const trendingArticles = articles.filter(a => a.trending).slice(0, 10);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.98)", "rgba(255,255,255,0.95)"]}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>AvisoNews</Text>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={22} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF6B6B"
          />
        }
      >
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.mainHeader}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoEmoji}>📢</Text>
              </View>
              <Text style={styles.logo}>AvisoNews</Text>
            </View>
            <Text style={styles.tagline}>Stay informed, stay ahead</Text>
          </View>
        </SafeAreaView>

        {heroArticles.length > 0 && (
          <HeroSection articles={heroArticles} />
        )}

        {trendingArticles.length > 0 && (
          <TrendingStrip articles={trendingArticles} />
        )}

        <View style={styles.railsContainer}>
          {techArticles.length > 0 && (
            <CategoryRail
              title="Technology"
              category="tech"
              articles={techArticles}
              color="#007AFF"
            />
          )}

          {businessArticles.length > 0 && (
            <CategoryRail
              title="Business"
              category="business"
              articles={businessArticles}
              color="#34C759"
            />
          )}

          {worldArticles.length > 0 && (
            <CategoryRail
              title="World"
              category="world"
              articles={worldArticles}
              color="#FF9500"
            />
          )}
        </View>

        <NewsletterCTA />

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 AvisoNews</Text>
          <Text style={styles.footerSubtext}>Curated news, powered by AI</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  notificationButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  safeHeader: {
    backgroundColor: "#FFFFFF",
  },
  mainHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: "#8E8E93",
    marginLeft: 52,
  },
  railsContainer: {
    marginTop: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#C7C7CC",
  },
});