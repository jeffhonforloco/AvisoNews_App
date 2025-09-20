import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Subscription } from '@/types/news';

const SUBSCRIPTION_KEY = 'user_subscription';

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (newSubscription: Subscription | null) => {
      if (newSubscription) {
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newSubscription));
      } else {
        await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
      }
      return newSubscription;
    },
    onSuccess: (data) => {
      setSubscription(data);
      queryClient.setQueryData(['subscription'], data);
    }
  });

  useEffect(() => {
    if (subscriptionQuery.data !== undefined) {
      setSubscription(subscriptionQuery.data);
    }
  }, [subscriptionQuery.data]);

  const isPremium = subscription?.plan === 'premium' || subscription?.plan === 'pro';
  const isPro = subscription?.plan === 'pro';
  const isActive = subscription?.status === 'active';

  const hasFeature = (feature: keyof Subscription['features']) => {
    return isActive && subscription?.features[feature] === true;
  };

  const upgradeSubscription = (plan: 'premium' | 'pro') => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      userId: 'current_user',
      plan,
      status: 'active',
      startDate: new Date().toISOString(),
      features: {
        audioArticles: true,
        premiumContent: true,
        adFree: plan === 'premium' || plan === 'pro',
        offlineReading: plan === 'pro',
        customNotifications: plan === 'pro'
      }
    };
    updateSubscriptionMutation.mutate(newSubscription);
  };

  const cancelSubscription = () => {
    if (subscription) {
      const cancelledSubscription = {
        ...subscription,
        status: 'cancelled' as const,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      updateSubscriptionMutation.mutate(cancelledSubscription);
    }
  };

  return {
    subscription,
    isPremium,
    isPro,
    isActive,
    hasFeature,
    upgradeSubscription,
    cancelSubscription,
    isLoading: subscriptionQuery.isLoading || updateSubscriptionMutation.isPending
  };
});

export function useSubscriptionFeatures() {
  const { hasFeature, isPremium, isPro, isActive } = useSubscription();
  
  return {
    canAccessAudio: hasFeature('audioArticles'),
    canAccessPremium: hasFeature('premiumContent'),
    isAdFree: hasFeature('adFree'),
    canDownloadOffline: hasFeature('offlineReading'),
    hasCustomNotifications: hasFeature('customNotifications'),
    isPremium,
    isPro,
    isActive
  };
}