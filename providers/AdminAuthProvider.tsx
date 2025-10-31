// Admin Auth Provider - Updated for REST API
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/lib/api";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  authToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on mount
  useEffect(() => {
    loadAuthToken();
  }, []);

  const loadAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("admin_auth_token");
      if (token) {
        setAuthTokenState(token);
        // TODO: Fetch admin user from API
        // For now, use mock admin
        setAdmin({
          id: "1",
          email: "admin@avisonews.com",
          name: "Admin User",
          role: "admin",
          permissions: ["all"],
        });
      }
    } catch (error) {
      console.error("Error loading auth token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthToken = async (token: string | null) => {
    try {
      if (token) {
        await AsyncStorage.setItem("admin_auth_token", token);
        setAuthTokenState(token);
        // TODO: Fetch admin user from API with token
        setAdmin({
          id: "1",
          email: "admin@avisonews.com",
          name: "Admin User",
          role: "admin",
          permissions: ["all"],
        });
      } else {
        await AsyncStorage.removeItem("admin_auth_token");
        setAuthTokenState(null);
        setAdmin(null);
      }
    } catch (error) {
      console.error("Error setting auth token:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("admin_auth_token");
      setAuthTokenState(null);
      setAdmin(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.permissions.includes("all")) return true;
    return admin.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        authToken,
        isLoading,
        isAuthenticated: !!admin && !!authToken,
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
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
