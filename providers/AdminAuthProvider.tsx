import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";
import { AdminUser } from "@/types/admin";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);

  // Load token from storage on mount
  useEffect(() => {
    AsyncStorage.getItem("admin_auth_token").then((token) => {
      if (token) {
        setAuthTokenState(token);
      }
    });
  }, []);

  // Fetch current admin when token changes
  const { data: currentAdmin } = trpc.admin.auth.getCurrent.useQuery(undefined, {
    enabled: !!authToken,
    retry: false,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      // If fetching user fails, clear token
      setAuthToken(null);
    },
  });

  const setAuthToken = async (token: string | null) => {
    setAuthTokenState(token);
    if (token) {
      await AsyncStorage.setItem("admin_auth_token", token);
    } else {
      await AsyncStorage.removeItem("admin_auth_token");
      setUser(null);
    }
  };

  const logout = async () => {
    await setAuthToken(null);
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!authToken && !!user,
        user,
        authToken,
        setAuthToken,
        logout,
        checkPermission,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

