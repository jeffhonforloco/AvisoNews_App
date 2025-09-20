import React, { useEffect, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text, useColorScheme, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Shield, Globe, TrendingUp } from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slide in animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.logoContainer,
          { transform: [{ scale: pulseAnim }, { translateX: slideAnim }] }
        ]}>
          <View style={styles.logoIcon}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.logoGradient}
            >
              <Text style={styles.logoEmoji}>📰</Text>
            </LinearGradient>
          </View>
          <Text style={[styles.logo, { color: isDark ? "#FFFFFF" : "#0F172A" }]}>AvisoNews</Text>
          <Text style={[styles.tagline, { color: isDark ? "#94A3B8" : "#64748B" }]}>
            Aggregating Truth • Building Trust
          </Text>
        </Animated.View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <View style={styles.loadingDots}>
            <View style={[styles.dot, { backgroundColor: "#FF6B6B" }]} />
            <View style={[styles.dot, { backgroundColor: "#FF8E8E", opacity: 0.7 }]} />
            <View style={[styles.dot, { backgroundColor: "#FFB1B1", opacity: 0.4 }]} />
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Animated.View style={[styles.feature, { opacity: fadeAnim }]}>
            <Shield size={20} color="#10B981" />
            <Text style={[styles.featureText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
              Verifying sources
            </Text>
          </Animated.View>
          <Animated.View style={[styles.feature, { opacity: fadeAnim }]}>
            <Globe size={20} color="#3B82F6" />
            <Text style={[styles.featureText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
              Aggregating perspectives
            </Text>
          </Animated.View>
          <Animated.View style={[styles.feature, { opacity: fadeAnim }]}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={[styles.featureText, { color: isDark ? "#94A3B8" : "#64748B" }]}>
              Analyzing trends
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: '100%',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIcon: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featuresContainer: {
    gap: 16,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
  },
});