import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'premium' | 'pro';
  joinDate: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  sessionStartTime: number;
  articlesRead: number;
  incrementArticlesRead: () => void;
  shouldShowAuthPrompt: boolean;
  dismissAuthPrompt: () => void;
  authPromptDismissedAt: number | null;
}

const STORAGE_KEY = 'aviso_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(Date.now());
  const [articlesRead, setArticlesRead] = useState(0);
  const [authPromptDismissedAt, setAuthPromptDismissedAt] = useState<number | null>(null);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [totalReadingTime, setTotalReadingTime] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, call your API
      if (email && password.length >= 6) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          plan: 'free',
          joinDate: new Date().toISOString(),
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'en',
          },
        };
        
        await saveUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, call your API
      if (email && password.length >= 6 && name.trim()) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: name.trim(),
          plan: 'free',
          joinDate: new Date().toISOString(),
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'en',
          },
        };
        
        await saveUser(userData);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await saveUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
      // In real app, call API to delete account
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  const incrementArticlesRead = () => {
    setArticlesRead(prev => prev + 1);
    // Start tracking reading time when first article is read
    if (!readingStartTime) {
      setReadingStartTime(Date.now());
    }
  };

  // Update total reading time
  useEffect(() => {
    if (readingStartTime && !user) {
      const interval = setInterval(() => {
        setTotalReadingTime(Date.now() - readingStartTime);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [readingStartTime, user]);

  const dismissAuthPrompt = () => {
    setAuthPromptDismissedAt(Date.now());
  };

  // Show auth prompt after 2 minutes of reading OR after reading 3 articles
  // Don't show if already authenticated or recently dismissed (within 10 minutes)
  const shouldShowAuthPrompt = !user && 
    (authPromptDismissedAt === null || Date.now() - authPromptDismissedAt > 600000) && 
    readingStartTime !== null &&
    (totalReadingTime > 120000 || articlesRead >= 3);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    sessionStartTime,
    articlesRead,
    incrementArticlesRead,
    shouldShowAuthPrompt,
    dismissAuthPrompt,
    authPromptDismissedAt,
    totalReadingTime,
  };
});