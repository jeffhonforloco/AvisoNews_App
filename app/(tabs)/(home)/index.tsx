import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  StatusBar,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNews } from "@/providers/NewsProvider";
import { useTheme } from "@/providers/ThemeProvider";
import HeroSection from "@/components/HeroSection";
import CategoryRail from "@/components/CategoryRail";
import TrendingStrip from "@/components/TrendingStrip";
import NewsletterCTA from "@/components/NewsletterCTA";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Newspaper } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const { articles, isLoading, refetch } = useNews();
  const { theme, isDark } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [-10, 0],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refetch();
  }, [refetch]);

  const techArticles = articles.filter(a => a.category === "tech").slice(0, 5);
  const businessArticles = articles.filter(a => a.category === "business").slice(0, 5);
  const worldArticles = articles.filter(a => a.category === "world").slice(0, 5);
  const heroArticles = articles.slice(0, 5);
  const trendingArticles = articles.filter(a => a.trending).slice(0, 10);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <Animated.View 
        style={[
          styles.stickyHeader, 
          { 
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          }
        ]}
      >
        <LinearGradient
          colors={isDark 
            ? ["rgba(28,28,30,0.98)", "rgba(28,28,30,0.92)"] 
            : ["rgba(255,255,255,0.98)", "rgba(255,255,255,0.92)"]}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.headerContent}>
            <View style={styles.headerRow}>
              <View style={styles.headerLogoRow}>
                <View style={[styles.headerLogoIcon, { backgroundColor: theme.primary }]}>
                  <Newspaper size={16} color="#FFFFFF" />
                </View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AvisoNews</Text>
              </View>
              <TouchableOpacity 
                style={[styles.notificationButton, { backgroundColor: theme.inputBackground }]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.7}
              >
                <Bell size={20} color={theme.text} />
                <View style={styles.notificationBadge} />
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
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        <SafeAreaView edges={["top"]} style={[styles.safeHeader, { backgroundColor: theme.backgroundElevated }]}>
          <View style={[styles.mainHeader, { backgroundColor: theme.backgroundElevated }]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Newspaper size={26} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.logo, { color: theme.text }]}>AvisoNews</Text>
                <Text style={[styles.tagline, { color: theme.textTertiary }]}>
                  Stay informed, stay ahead
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.headerNotifBtn, { backgroundColor: theme.inputBackground }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.7}
            >
              <Bell size={22} color={theme.text} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
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
              color={theme.info}
            />
          )}

          {businessArticles.length > 0 && (
            <CategoryRail
              title="Business"
              category="business"
              articles={businessArticles}
              color={theme.success}
            />
          )}

          {worldArticles.length > 0 && (
            <CategoryRail
              title="World"
              category="world"
              articles={worldArticles}
              color={theme.warning}
            />
          )}
        </View>

        <NewsletterCTA />

        <View style={styles.footer}>
          <View style={[styles.footerDivider, { backgroundColor: theme.border }]} />
          <Text style={[styles.footerText, { color: theme.textTertiary }]}>© 2025 AvisoNews</Text>
          <Text style={[styles.footerSubtext, { color: theme.textQuaternary }]}>
            Curated news, powered by AI
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
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
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
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
  headerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  notificationButton: {
    padding: 10,
    borderRadius: 14,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  safeHeader: {},
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
    letterSpacing: -0.1,
  },
  headerNotifBtn: {
    padding: 12,
    borderRadius: 14,
    position: "relative",
  },
  railsContainer: {
    marginTop: 28,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  footerDivider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  footerSubtext: {
    fontSize: 12,
    fontWeight: "500",
  },
});
