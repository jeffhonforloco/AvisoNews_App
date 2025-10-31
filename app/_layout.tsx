import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NewsProvider } from "@/providers/NewsProvider";
import { PreferencesProvider } from "@/providers/PreferencesProvider";
import { SubscriptionProvider } from "@/providers/SubscriptionProvider";
import { FollowingProvider } from "@/providers/FollowingProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LocalizationProvider } from "@/providers/LocalizationProvider";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { AdminAuthProvider } from "@/providers/AdminAuthProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import AuthPromptModal from "@/components/AuthPromptModal";


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
        name="category/[slug]" 
        options={{ 
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="subscription" 
        options={{ 
          headerShown: false,
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="language-selection" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="contact" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false,
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="source/[sourceId]" 
        options={{ 
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="admin" 
        options={{ 
          headerShown: false,
          presentation: "card"
        }} 
      />
    </Stack>
  );
}

function AppWithAuth() {
  const { shouldShowAuthPrompt, dismissAuthPrompt } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (shouldShowAuthPrompt) {
      setModalVisible(true);
    }
  }, [shouldShowAuthPrompt]);

  const handleCloseModal = () => {
    setModalVisible(false);
    dismissAuthPrompt();
  };

  return (
    <>
      <RootLayoutNav />
      <AuthPromptModal 
        visible={modalVisible} 
        onClose={handleCloseModal}
      />
    </>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Promise.all([
          new Promise(resolve => setTimeout(resolve, 300)),
        ]);
      } catch (e) {
        console.error('Failed to prepare app:', e);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (err) {
          console.log('Splash already hidden or failed to hide:', err);
        }
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return null; // Keep splash screen visible
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
        <PreferencesProvider>
          <ThemeProvider>
            <LocalizationProvider>
              <AdminAuthProvider>
                <AuthProvider>
                  <SubscriptionProvider>
                    <FollowingProvider>
                      <NewsProvider>
                        <GestureHandlerRootView style={styles.container}>
                          <AppWithAuth />
                        </GestureHandlerRootView>
                      </NewsProvider>
                    </FollowingProvider>
                  </SubscriptionProvider>
                </AuthProvider>
              </AdminAuthProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </PreferencesProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});