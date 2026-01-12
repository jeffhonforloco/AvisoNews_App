import { useEffect, useRef } from 'react';
import { Analytics } from '@/services/analytics';

/**
 * Hook to track screen views automatically
 */
export function useScreenView(screenName: string, properties?: Record<string, any>) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      Analytics.trackScreenView(screenName, properties);
      hasTracked.current = true;
    }
  }, [screenName, properties]);
}

/**
 * Hook to track events
 */
export function useTrackEvent() {
  return {
    trackEvent: Analytics.trackEvent.bind(Analytics),
    trackAction: Analytics.trackAction.bind(Analytics),
    trackArticleView: Analytics.trackArticleView.bind(Analytics),
    trackArticleBookmark: Analytics.trackArticleBookmark.bind(Analytics),
    trackArticleShare: Analytics.trackArticleShare.bind(Analytics),
    trackNewsletterSubscription: Analytics.trackNewsletterSubscription.bind(Analytics),
    trackSearch: Analytics.trackSearch.bind(Analytics),
    trackCategoryView: Analytics.trackCategoryView.bind(Analytics),
    trackSettingsChange: Analytics.trackSettingsChange.bind(Analytics),
    trackError: Analytics.trackError.bind(Analytics),
  };
}
