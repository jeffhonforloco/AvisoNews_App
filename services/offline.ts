import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const OFFLINE_QUEUE_KEY = 'offline_queue';
const LAST_SYNC_KEY = 'last_sync_timestamp';

interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

class OfflineService {
  private queue: QueuedAction[] = [];
  private isProcessing = false;

  /**
   * Initialize offline service
   */
  async initialize() {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }

      // Listen for network changes
      NetInfo.addEventListener(state => {
        if (state.isConnected && state.isInternetReachable) {
          this.processQueue();
        }
      });
    } catch (error) {
      console.error('[Offline] Failed to initialize:', error);
    }
  }

  /**
   * Add action to offline queue
   */
  async queueAction(type: string, payload: any): Promise<void> {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
    };

    this.queue.push(action);
    await this.saveQueue();
  }

  /**
   * Process queued actions when online
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected || !netState.isInternetReachable) {
        this.isProcessing = false;
        return;
      }

      while (this.queue.length > 0) {
        const action = this.queue[0];

        try {
          await this.executeAction(action);
          this.queue.shift(); // Remove processed action
          await this.saveQueue();
        } catch (error) {
          console.error('[Offline] Failed to process action:', error);
          // Keep action in queue for retry
          break;
        }
      }

      // Update last sync timestamp
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } catch (error) {
      console.error('[Offline] Failed to process queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Execute a queued action
   */
  private async executeAction(action: QueuedAction): Promise<void> {
    // TODO: Implement actual API calls based on action type
    console.log('[Offline] Executing action:', action.type, action.payload);

    switch (action.type) {
      case 'bookmark':
        // await API.updateBookmark(action.payload);
        break;
      case 'newsletter':
        // await API.subscribeNewsletter(action.payload);
        break;
      case 'view_count':
        // await API.incrementViewCount(action.payload);
        break;
      default:
        console.warn('[Offline] Unknown action type:', action.type);
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[Offline] Failed to save queue:', error);
    }
  }

  /**
   * Clear the queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      count: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }

  /**
   * Get last sync timestamp
   */
  async getLastSync(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('[Offline] Failed to get last sync:', error);
      return null;
    }
  }

  /**
   * Check if device is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const netState = await NetInfo.fetch();
      return netState.isConnected && (netState.isInternetReachable ?? false);
    } catch (error) {
      console.error('[Offline] Failed to check online status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const OfflineManager = new OfflineService();
