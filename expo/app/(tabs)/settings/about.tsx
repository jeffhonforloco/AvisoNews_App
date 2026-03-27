import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Newspaper, Target, Users, Sparkles } from "lucide-react-native";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About AvisoNews</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Newspaper size={64} color="#FF6B6B" />
          <Text style={styles.appName}>AvisoNews</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.sectionText}>
            AvisoNews delivers curated, high-quality news from trusted sources around the
            world. We combine automated aggregation with human curation to bring you the
            most important stories, summarized for quick consumption.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Features</Text>
          </View>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• AI-powered article summaries (TLDR)</Text>
            <Text style={styles.featureItem}>• Curated news from multiple sources</Text>
            <Text style={styles.featureItem}>• Category-based browsing</Text>
            <Text style={styles.featureItem}>• Personalized recommendations</Text>
            <Text style={styles.featureItem}>• Bookmark your favorite articles</Text>
            <Text style={styles.featureItem}>• Daily newsletter option</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Our Team</Text>
          </View>
          <Text style={styles.sectionText}>
            Built with passion by a team dedicated to making news consumption more
            efficient and enjoyable. We believe in the power of informed citizens and
            strive to make quality journalism accessible to everyone.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 AvisoNews. All rights reserved.</Text>
          <Text style={styles.tagline}>Stay informed. Stay ahead.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 16,
  },
  version: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  copyright: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
    fontStyle: "italic",
  },
});
