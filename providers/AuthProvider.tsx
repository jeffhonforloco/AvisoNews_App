import React, { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { AuthAPI, User, SignUpData, SignInData } from '@/services/auth';
import { Analytics } from '@/services/analytics';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<{ success: boolean; message?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedUser = await AuthAPI.getUser();
      const token = await AuthAPI.getToken();

      if (savedUser && token) {
        setUser(savedUser);
        Analytics.identifyUser(savedUser.id, {
          email: savedUser.email,
          name: savedUser.name,
        });
      }
    } catch (error) {
      console.error('[AuthProvider] Initialize error:', error);
      Analytics.trackError(error as Error, 'auth_initialize');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      const response = await AuthAPI.signIn(data);

      if (response.success && response.user) {
        setUser(response.user);
        Analytics.trackEvent('user_signin', { email: data.email });
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('[AuthProvider] Sign in error:', error);
      Analytics.trackError(error as Error, 'auth_signin_provider');
      return { success: false, message: 'An error occurred during sign in' };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await AuthAPI.signUp(data);

      if (response.success && response.user) {
        setUser(response.user);
        Analytics.trackEvent('user_signup', { email: data.email });
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('[AuthProvider] Sign up error:', error);
      Analytics.trackError(error as Error, 'auth_signup_provider');
      return { success: false, message: 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    try {
      await AuthAPI.signOut();
      setUser(null);
      Analytics.trackEvent('user_signout');
    } catch (error) {
      console.error('[AuthProvider] Sign out error:', error);
      Analytics.trackError(error as Error, 'auth_signout_provider');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await AuthAPI.updateProfile(updates);

      if (response.success && response.user) {
        setUser(response.user);
        Analytics.trackEvent('profile_update');
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('[AuthProvider] Update profile error:', error);
      Analytics.trackError(error as Error, 'auth_update_profile_provider');
      return { success: false, message: 'An error occurred updating profile' };
    }
  };

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
});
