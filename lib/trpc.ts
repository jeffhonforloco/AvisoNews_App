import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
};

const getAuthHeaders = async () => {
  try {
    // For React Native, use AsyncStorage
    const token = await AsyncStorage.getItem("admin_auth_token");
    if (token) {
      return {
        authorization: `Bearer ${token}`,
      };
    }
  } catch (error) {
    // Fallback for web
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_auth_token");
      if (token) {
        return {
          authorization: `Bearer ${token}`,
        };
      }
    }
  }
  return {};
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,  // Frontend expects /api/trpc (Rork mounts server at /api, then /trpc from server)
      transformer: superjson,
      async headers() {
        return await getAuthHeaders();
      },
      fetch: async (url, options) => {
        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("❌ tRPC fetch error:", error);
          throw error;
        }
      },
    }),
  ],
});