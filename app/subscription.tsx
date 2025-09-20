import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Crown, 
  Headphones, 
  Download, 
  Zap, 
  Shield, 
  Star,
  Check,
  X
} from 'lucide-react-native';
import { useSubscription } from '@/providers/SubscriptionProvider';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#6B7280',
    features: [
      { name: 'Basic news articles', included: true },
      { name: 'Limited categories', included: true },
      { name: 'Ads supported', included: true },
      { name: 'Audio articles', included: false },
      { name: 'Premium content', included: false },
      { name: 'Offline reading', included: false },
      { name: 'Custom notifications', included: false },
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    color: '#FF6B6B',
    popular: true,
    features: [
      { name: 'All news articles', included: true },
      { name: 'All categories', included: true },
      { name: 'Ad-free experience', included: true },
      { name: 'Audio articles', included: true },
      { name: 'Premium content', included: true },
      { name: 'Basic notifications', included: true },
      { name: 'Offline reading', included: false },
      { name: 'Custom notifications', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: 'month',
    color: '#FFD700',
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'Offline reading', included: true },
      { name: 'Custom notifications', included: true },
      { name: 'Priority support', included: true },
      { name: 'Early access features', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Team collaboration', included: true },
    ]
  }
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const { subscription, upgradeSubscription, cancelSubscription, isPremium, isPro } = useSubscription();

  const currentPlan = subscription?.plan || 'free';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Crown size={32} color="#FFD700" />
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          Unlock premium features and get the best news experience
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Features Highlight */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Headphones size={24} color="#FF6B6B" />
            <Text style={styles.featureTitle}>Audio Articles</Text>
            <Text style={styles.featureDescription}>
              Listen to AI-narrated news while commuting or exercising
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Download size={24} color="#4CAF50" />
            <Text style={styles.featureTitle}>Offline Reading</Text>
            <Text style={styles.featureDescription}>
              Download articles for offline reading anywhere
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Zap size={24} color="#9C27B0" />
            <Text style={styles.featureTitle}>Ad-Free</Text>
            <Text style={styles.featureDescription}>
              Enjoy distraction-free reading experience
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Shield size={24} color="#FF9800" />
            <Text style={styles.featureTitle}>Premium Content</Text>
            <Text style={styles.featureDescription}>
              Access exclusive articles and in-depth analysis
            </Text>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Choose Your Plan</Text>
          
          {plans.map((plan) => (
            <View 
              key={plan.id} 
              style={[
                styles.planCard,
                plan.popular && styles.popularPlan,
                currentPlan === plan.id && styles.currentPlan
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Star size={16} color="#FFFFFF" />
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: plan.color }]}>
                  {plan.name}
                </Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>/{plan.period}</Text>
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeature}>
                    {feature.included ? (
                      <Check size={16} color="#4CAF50" />
                    ) : (
                      <X size={16} color="#E0E0E0" />
                    )}
                    <Text 
                      style={[
                        styles.planFeatureText,
                        !feature.included && styles.planFeatureTextDisabled
                      ]}
                    >
                      {feature.name}
                    </Text>
                  </View>
                ))}
              </View>

              {currentPlan === plan.id ? (
                <View style={styles.currentPlanButton}>
                  <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                </View>
              ) : plan.id === 'free' ? (
                <TouchableOpacity 
                  style={styles.downgradePlanButton}
                  onPress={cancelSubscription}
                >
                  <Text style={styles.downgradePlanButtonText}>
                    {subscription ? 'Cancel Subscription' : 'Current Plan'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.selectPlanButton, { backgroundColor: plan.color }]}
                  onPress={() => upgradeSubscription(plan.id as 'premium' | 'pro')}
                >
                  <Text style={styles.selectPlanButtonText}>
                    {currentPlan === 'free' ? 'Upgrade Now' : 'Switch Plan'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Current Subscription Info */}
        {subscription && (
          <View style={styles.subscriptionInfo}>
            <Text style={styles.subscriptionInfoTitle}>Current Subscription</Text>
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionPlan}>
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
              </Text>
              <Text style={styles.subscriptionStatus}>
                Status: {subscription.status}
              </Text>
              <Text style={styles.subscriptionDate}>
                Started: {new Date(subscription.startDate).toLocaleDateString()}
              </Text>
              {subscription.endDate && (
                <Text style={styles.subscriptionDate}>
                  Ends: {new Date(subscription.endDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* FAQ */}
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept all major credit cards, PayPal, and Apple Pay/Google Pay through your app store.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a free trial?</Text>
            <Text style={styles.faqAnswer}>
              Yes! New users get a 7-day free trial of Premium features. No commitment required.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  plansTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  currentPlan: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666',
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  planFeatureTextDisabled: {
    color: '#999',
  },
  selectPlanButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  currentPlanButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  currentPlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  downgradePlanButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  downgradePlanButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionInfo: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  subscriptionInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subscriptionDetails: {
    gap: 4,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subscriptionStatus: {
    fontSize: 14,
    color: '#666',
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#666',
  },
  faqContainer: {
    padding: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});