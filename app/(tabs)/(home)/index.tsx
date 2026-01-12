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
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A0A0A",
    letterSpacing: -0.3,
  },
  notificationButton: {
    padding: 10,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  safeHeader: {
    backgroundColor: "#FFFFFF",
  },
  mainHeader: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0A0A0A",
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize: 16,
    color: "#6B6B6B",
    marginLeft: 62,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  railsContainer: {
    marginTop: 24,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8E8E93",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  footerSubtext: {
    fontSize: 13,
    color: "#C7C7CC",
    fontWeight: "500",
  },
});