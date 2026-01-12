import { Tabs } from "expo-router";
import { Home, Search, Layers, Settings } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <>
      <OfflineIndicator />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.tabBarBorder,
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0.1,
            shadowRadius: 10,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: -2 },
            paddingBottom: Platform.OS === "ios" ? 0 : 5,
            height: Platform.OS === "ios" ? 85 : 60,
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
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}