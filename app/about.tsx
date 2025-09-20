import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { ArrowLeft, Globe, Users, Award, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useLocalization } from '@/providers/LocalizationProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'News from trusted sources worldwide, curated by AI for accuracy and relevance.',
    },
    {
      icon: Users,
      title: 'Personalized Experience',
      description: 'Follow your favorite sources and teams to get news that matters to you.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'AI-enhanced headlines and TL;DR summaries for quick, informed reading.',
    },
    {
      icon: Heart,
      title: 'Ad-Free Option',
      description: 'Subscribe to AvisoNews+ for an uninterrupted, premium news experience.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {t('aboutAvisoNews')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo and Brand */}
        <View style={styles.brandSection}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={[styles.brandName, { color: colors.text.primary }]}>AvisoNews</Text>
          <Text style={[styles.tagline, { color: colors.text.secondary }]}>
            Apple-style, auto-curated news hub
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Our Mission</Text>
          <Text style={[styles.missionText, { color: colors.text.secondary }]}>
            AvisoNews delivers the world's most important stories through intelligent curation and AI-enhanced summaries. 
            We believe in providing factual, unbiased news that helps you stay informed without information overload.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>What Makes Us Different</Text>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View key={index} style={[styles.featureItem, { borderBottomColor: colors.border.primary }]}>
                <View style={[styles.featureIcon, { backgroundColor: colors.background.secondary }]}>
                  <Icon size={24} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>By the Numbers</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>50+</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Trusted Sources</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Languages</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>24/7</Text>
              <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Live Updates</Text>
            </View>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Our Commitment</Text>
          <Text style={[styles.commitmentText, { color: colors.text.secondary }]}>
            We're committed to editorial independence, factual accuracy, and transparent sourcing. 
            Every story is clearly attributed to its original publisher, and our AI enhancements are designed 
            to inform, not influence.
          </Text>
        </View>

        {/* Contact CTA */}
        <View style={[styles.ctaSection, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.ctaTitle, { color: colors.text.primary }]}>Get in Touch</Text>
          <Text style={[styles.ctaDescription, { color: colors.text.secondary }]}>
            Have feedback or suggestions? We'd love to hear from you.
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/contact')}
            testID="contact-button"
          >
            <Text style={styles.ctaButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
            © 2025 AvisoNews. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  brandSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  commitmentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  ctaSection: {
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
  },
});