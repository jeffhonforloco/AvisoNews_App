import { Tabs } from "expo-router";
import { Home, Search, Layers, Settings, Headphones, Trophy, Star } from "lucide-react-native";
import { Platform } from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import { useLocalization } from "@/providers/LocalizationProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopWidth: 1,
          borderTopColor: colors.border.primary,
          elevation: 8,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          // Hide tab bar for unauthenticated users
          display: isAuthenticated ? 'flex' : 'none',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('categories'),
          tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('search'),
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: t('audio'),
          tabBarIcon: ({ color, size }) => <Headphones size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sports"
        options={{
          title: t('sports'),
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: t('following'),
          tabBarIcon: ({ color, size }) => <Star size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}