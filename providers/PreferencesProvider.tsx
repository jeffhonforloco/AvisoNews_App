import React, { useState, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Preferences {
  pushNotifications: boolean;
  newsletter: boolean;
  darkMode: boolean;
  language: string;
  followedSources: string[];
  followedTeams: string[];
  favoriteCategories: string[];
  notificationSettings: {
    breaking: boolean;
    daily: boolean;
    weekly: boolean;
    followedSources: boolean;
    followedTeams: boolean;
    trustAlerts: boolean;
    biasAlerts: boolean;
    factCheckAlerts: boolean;
  };
  audioSettings: {
    autoPlay: boolean;
    playbackSpeed: number;
    downloadForOffline: boolean;
  };
  readingPreferences: {
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'auto';
    showImages: boolean;
    showTrustScores: boolean;
    showBiasIndicators: boolean;
    showFactChecks: boolean;
    minimumTrustScore: number;
    balancedPerspectives: boolean;
  };
  trustSettings: {
    hideUnverified: boolean;
    highlightDisputed: boolean;
    preferHighTrust: boolean;
    diversePerspectives: boolean;
  };
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  updatePreferences: (newPreferences: Preferences) => void;
  resetPreferences: () => void;
}

const defaultPreferences: Preferences = {
  pushNotifications: true,
  newsletter: false,
  darkMode: false,
  language: "en",
  followedSources: [],
  followedTeams: [],
  favoriteCategories: [],
  notificationSettings: {
    breaking: true,
    daily: true,
    weekly: false,
    followedSources: true,
    followedTeams: true,
    trustAlerts: true,
    biasAlerts: true,
    factCheckAlerts: true
  },
  audioSettings: {
    autoPlay: false,
    playbackSpeed: 1.0,
    downloadForOffline: false
  },
  readingPreferences: {
    fontSize: 'medium',
    theme: 'auto',
    showImages: true,
    showTrustScores: true,
    showBiasIndicators: true,
    showFactChecks: true,
    minimumTrustScore: 60,
    balancedPerspectives: true
  },
  trustSettings: {
    hideUnverified: false,
    highlightDisputed: true,
    preferHighTrust: true,
    diversePerspectives: true
  }
};

export const [PreferencesProvider, usePreferences] = createContextHook<PreferencesContextType>(() => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem("preferences");
      if (stored) {
        const parsedPreferences = JSON.parse(stored);
        // Deep merge with defaults to ensure all properties exist
        const mergedPreferences: Preferences = {
          ...defaultPreferences,
          ...parsedPreferences,
          notificationSettings: {
            ...defaultPreferences.notificationSettings,
            ...(parsedPreferences.notificationSettings || {})
          },
          audioSettings: {
            ...defaultPreferences.audioSettings,
            ...(parsedPreferences.audioSettings || {})
          },
          readingPreferences: {
            ...defaultPreferences.readingPreferences,
            ...(parsedPreferences.readingPreferences || {})
          },
          trustSettings: {
            ...defaultPreferences.trustSettings,
            ...(parsedPreferences.trustSettings || {})
          }
        };
        setPreferences(mergedPreferences);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      // If there's an error, use default preferences
      setPreferences(defaultPreferences);
    }
  };

  const savePreferences = async (newPreferences: Preferences) => {
    try {
      await AsyncStorage.setItem("preferences", JSON.stringify(newPreferences));
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updatePreferences = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    savePreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };
});