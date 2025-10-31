import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { useAdminAuth } from "@/providers/AdminAuthProvider";

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAdminGroup = segments[0] === "admin";
    const inLogin = segments[1] === "login";

    if (!isAuthenticated && inAdminGroup && !inLogin) {
      router.replace("/admin/login");
    } else if (isAuthenticated && inLogin) {
      router.replace("/admin/(tabs)/dashboard");
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "card",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

