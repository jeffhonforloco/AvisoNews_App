import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react-native";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Shield size={48} color="#FF6B6B" />
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            We are committed to protecting your privacy and ensuring transparency in how
            we handle your data.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: January 12, 2026</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Information We Collect</Text>
          </View>
          <Text style={styles.sectionText}>
            We collect minimal information to provide you with a personalized news
            experience:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Reading preferences and browsing history
            </Text>
            <Text style={styles.bulletItem}>
              • Email address (only if you subscribe to our newsletter)
            </Text>
            <Text style={styles.bulletItem}>
              • Device information for app optimization
            </Text>
            <Text style={styles.bulletItem}>
              • Bookmarked articles and saved preferences
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>How We Use Your Data</Text>
          </View>
          <Text style={styles.sectionText}>
            Your data helps us improve your experience:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Personalize content recommendations
            </Text>
            <Text style={styles.bulletItem}>
              • Send you our daily newsletter (if opted in)
            </Text>
            <Text style={styles.bulletItem}>
              • Analyze app performance and fix issues
            </Text>
            <Text style={styles.bulletItem}>
              • Improve our content curation algorithms
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Data Security</Text>
          </View>
          <Text style={styles.sectionText}>
            We implement industry-standard security measures to protect your data:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • All data is stored locally on your device
            </Text>
            <Text style={styles.bulletItem}>
              • We do not sell your data to third parties
            </Text>
            <Text style={styles.bulletItem}>
              • Communications are encrypted in transit
            </Text>
            <Text style={styles.bulletItem}>
              • You can delete your data at any time
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to access, modify, or delete your personal data at any
            time. You can also opt out of data collection features in the app settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have questions about our privacy policy, please contact us through the
            Contact Us page in settings.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using AvisoNews, you agree to this privacy policy.
          </Text>
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
  intro: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
    textAlign: "center",
  },
  lastUpdated: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 12,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 8,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
    marginBottom: 8,
  },
  bulletList: {
    gap: 6,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
  },
  footer: {
    alignItems: "center",
    padding: 32,
  },
  footerText: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
    fontStyle: "italic",
  },
});
