import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analytics } from './analytics';

const PUSH_TOKEN_KEY = 'push_notification_token';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationService {
  initialize: () => Promise<void>;
  registerForPushNotifications: () => Promise<string | null>;
  scheduleNotification: (title: string, body: string, trigger?: Notifications.NotificationTriggerInput) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  addNotificationReceivedListener: (listener: (notification: Notifications.Notification) => void) => Notifications.Subscription;
  addNotificationResponseListener: (listener: (response: Notifications.NotificationResponse) => void) => Notifications.Subscription;
  getBadgeCount: () => Promise<number>;
  setBadgeCount: (count: number) => Promise<void>;
}

class PushNotificationServiceImpl implements PushNotificationService {
  private pushToken: string | null = null;

  async initialize(): Promise<void> {
    try {
      // Get stored token
      const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
      if (storedToken) {
        this.pushToken = storedToken;
        console.log('[PushNotifications] Initialized with stored token');
      }

      // Request permissions and register
      await this.registerForPushNotifications();
    } catch (error) {
      console.error('[PushNotifications] Initialize error:', error);
      Analytics.trackError(error as Error, 'push_init');
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Check if running on real device
      if (!Device.isDevice) {
        console.warn('[PushNotifications] Must use physical device for push notifications');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[PushNotifications] Permission not granted');
        Analytics.trackEvent('push_permission_denied');
        return null;
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID || '',
      });

      const token = tokenData.data;
      this.pushToken = token;

      // Store token
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

      // Configure Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6B6B',
        });
      }

      console.log('[PushNotifications] Registered successfully');
      Analytics.trackEvent('push_registered', { token: token.substring(0, 20) });

      return token;
    } catch (error) {
      console.error('[PushNotifications] Registration error:', error);
      Analytics.trackError(error as Error, 'push_register');
      return null;
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null,
      });

      Analytics.trackEvent('notification_scheduled', { title });
      return id;
    } catch (error) {
      console.error('[PushNotifications] Schedule error:', error);
      Analytics.trackError(error as Error, 'push_schedule');
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      Analytics.trackEvent('notification_cancelled');
    } catch (error) {
      console.error('[PushNotifications] Cancel error:', error);
      Analytics.trackError(error as Error, 'push_cancel');
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Analytics.trackEvent('all_notifications_cancelled');
    } catch (error) {
      console.error('[PushNotifications] Cancel all error:', error);
      Analytics.trackError(error as Error, 'push_cancel_all');
    }
  }

  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('[PushNotifications] Get badge error:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('[PushNotifications] Set badge error:', error);
      Analytics.trackError(error as Error, 'push_badge');
    }
  }

  getPushToken(): string | null {
    return this.pushToken;
  }
}

export const PushNotifications = new PushNotificationServiceImpl();

/**
 * Example: Schedule a daily news digest notification
 */
export async function scheduleDailyDigest() {
  const trigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 9, // 9 AM
    minute: 0,
  };

  return await PushNotifications.scheduleNotification(
    'Daily News Digest',
    'Your curated news is ready!',
    trigger
  );
}

/**
 * Example: Schedule breaking news notification
 */
export async function scheduleBreakingNews(headline: string) {
  return await PushNotifications.scheduleNotification(
    'Breaking News',
    headline,
    { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1 }
  );
}
