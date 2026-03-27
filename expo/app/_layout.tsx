import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NewsProvider } from "@/providers/NewsProvider";
import { PreferencesProvider } from "@/providers/PreferencesProvider";
import { BookmarkProvider } from "@/providers/BookmarkProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Analytics } from "@/services/analytics";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="article/[id]"
        options={{
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right"
        }}
      />
      <Stack.Screen
        name="auth/sign-in"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom"
        }}
      />
      <Stack.Screen
        name="auth/sign-up"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom"
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize analytics
    Analytics.initialize().catch((error) => {
      console.error('Failed to initialize analytics:', error);
    });

    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <ThemeProvider>
            <AuthProvider>
              <NewsProvider>
                <BookmarkProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                </BookmarkProvider>
              </NewsProvider>
            </AuthProvider>
          </ThemeProvider>
        </PreferencesProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}