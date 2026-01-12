import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analytics } from './analytics';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    categories?: string[];
    language?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || '';

  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          return { success: false, message: error.message || 'Sign up failed' };
        }

        const result = await response.json();

        if (result.token && result.user) {
          await this.saveSession(result.token, result.user);
          Analytics.identifyUser(result.user.id, {
            email: result.user.email,
            name: result.user.name,
          });
        }

        return { success: true, ...result };
      }

      // Mock sign up for development
      console.log('[Auth] Mock sign up:', data.email);

      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
      };

      const mockToken = `mock_token_${Date.now()}`;
      await this.saveSession(mockToken, mockUser);

      Analytics.identifyUser(mockUser.id, {
        email: mockUser.email,
        name: mockUser.name,
      });

      return {
        success: true,
        token: mockToken,
        user: mockUser,
      };
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      Analytics.trackError(error as Error, 'auth_signup');
      return {
        success: false,
        message: 'An error occurred during sign up',
      };
    }
  }

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      if (this.baseUrl) {
        const response = await fetch(`${this.baseUrl}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          return { success: false, message: error.message || 'Sign in failed' };
        }

        const result = await response.json();

        if (result.token && result.user) {
          await this.saveSession(result.token, result.user);
          Analytics.identifyUser(result.user.id, {
            email: result.user.email,
            name: result.user.name,
          });
        }

        return { success: true, ...result };
      }

      // Mock sign in for development
      console.log('[Auth] Mock sign in:', data.email);

      const mockUser: User = {
        id: 'user_mock_123',
        email: data.email,
        name: 'Demo User',
      };

      const mockToken = `mock_token_${Date.now()}`;
      await this.saveSession(mockToken, mockUser);

      Analytics.identifyUser(mockUser.id, {
        email: mockUser.email,
        name: mockUser.name,
      });

      return {
        success: true,
        token: mockToken,
        user: mockUser,
      };
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      Analytics.trackError(error as Error, 'auth_signin');
      return {
        success: false,
        message: 'An error occurred during sign in',
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      Analytics.reset();
      console.log('[Auth] User signed out');
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      Analytics.trackError(error as Error, 'auth_signout');
    }
  }

  /**
   * Get the current auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('[Auth] Get token error:', error);
      return null;
    }
  }

  /**
   * Get the current user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('[Auth] Get user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    try {
      const currentUser = await this.getUser();
      if (!currentUser) {
        return { success: false, message: 'No user logged in' };
      }

      if (this.baseUrl) {
        const token = await this.getToken();
        const response = await fetch(`${this.baseUrl}/auth/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const error = await response.json();
          return { success: false, message: error.message || 'Update failed' };
        }

        const result = await response.json();
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(result.user));

        return { success: true, user: result.user };
      }

      // Mock update for development
      const updatedUser = { ...currentUser, ...updates };
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('[Auth] Update profile error:', error);
      Analytics.trackError(error as Error, 'auth_update_profile');
      return {
        success: false,
        message: 'An error occurred updating profile',
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error('[Auth] Check auth error:', error);
      return false;
    }
  }

  /**
   * Save session data
   */
  private async saveSession(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [AUTH_TOKEN_KEY, token],
        [USER_DATA_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('[Auth] Save session error:', error);
      throw error;
    }
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain an uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain a lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain a number' };
    }

    return { valid: true };
  }
}

export const AuthAPI = new AuthService();
