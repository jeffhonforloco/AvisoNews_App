import AsyncStorage from '@react-native-async-storage/async-storage';

class SafeStorageService {
  private memoryCache: Map<string, string> = new Map();
  private storageAvailable: boolean | null = null;

  private async isStorageAvailable(): Promise<boolean> {
    if (this.storageAvailable !== null) {
      return this.storageAvailable;
    }

    try {
      const testKey = '__storage_test__';
      await AsyncStorage.setItem(testKey, 'test');
      await AsyncStorage.removeItem(testKey);
      this.storageAvailable = true;
      return true;
    } catch (error) {
      console.warn('[SafeStorage] Storage not available, using memory fallback:', error);
      this.storageAvailable = false;
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        return this.memoryCache.get(key) ?? null;
      }

      return await AsyncStorage.getItem(key);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on getItem, using memory cache');
        return this.memoryCache.get(key) ?? null;
      }
      console.error('[SafeStorage] getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        this.memoryCache.set(key, value);
        return;
      }

      await AsyncStorage.setItem(key, value);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on setItem, using memory cache');
        this.memoryCache.set(key, value);
        return;
      }
      console.error('[SafeStorage] setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        this.memoryCache.delete(key);
        return;
      }

      await AsyncStorage.removeItem(key);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on removeItem, using memory cache');
        this.memoryCache.delete(key);
        return;
      }
      console.error('[SafeStorage] removeItem error:', error);
    }
  }

  async multiGet(keys: string[]): Promise<readonly [string, string | null][]> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        return keys.map(key => [key, this.memoryCache.get(key) ?? null] as [string, string | null]);
      }

      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on multiGet, using memory cache');
        return keys.map(key => [key, this.memoryCache.get(key) ?? null] as [string, string | null]);
      }
      console.error('[SafeStorage] multiGet error:', error);
      return keys.map(key => [key, null] as [string, string | null]);
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        keyValuePairs.forEach(([key, value]) => {
          this.memoryCache.set(key, value);
        });
        return;
      }

      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on multiSet, using memory cache');
        keyValuePairs.forEach(([key, value]) => {
          this.memoryCache.set(key, value);
        });
        return;
      }
      console.error('[SafeStorage] multiSet error:', error);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      const isAvailable = await this.isStorageAvailable();
      
      if (!isAvailable) {
        keys.forEach(key => {
          this.memoryCache.delete(key);
        });
        return;
      }

      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      if (this.isSecurityError(error)) {
        console.warn('[SafeStorage] SecurityError on multiRemove, using memory cache');
        keys.forEach(key => {
          this.memoryCache.delete(key);
        });
        return;
      }
      console.error('[SafeStorage] multiRemove error:', error);
    }
  }

  private isSecurityError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.name === 'SecurityError' || 
             error.message.includes('SecurityError') ||
             error.message.includes('operation is insecure');
    }
    return false;
  }
}

export const SafeStorage = new SafeStorageService();
