import { Tabs } from "expo-router";
import { Home, Search, Layers, Settings, Headphones, Trophy, Star } from "lucide-react-native";
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
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          // Hide tab bar for unauthenticated users
          display: isAuthenticated ? 'flex' : 'none',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
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