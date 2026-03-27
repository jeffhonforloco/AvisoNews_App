import { useState, useEffect } from 'react';
import { OfflineManager } from '@/services/offline';
import { useNetworkStatus } from './useNetworkStatus';

export function useOffline() {
  const networkStatus = useNetworkStatus();
  const [queueStatus, setQueueStatus] = useState({ count: 0, isProcessing: false });

  useEffect(() => {
    // Initialize offline manager
    OfflineManager.initialize();

    // Update queue status periodically
    const interval = setInterval(() => {
      setQueueStatus(OfflineManager.getQueueStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Process queue when coming back online
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      OfflineManager.processQueue();
    }
  }, [networkStatus.isConnected, networkStatus.isInternetReachable]);

  return {
    isOnline: networkStatus.isConnected && (networkStatus.isInternetReachable ?? false),
    networkType: networkStatus.type,
    queuedActions: queueStatus.count,
    isProcessingQueue: queueStatus.isProcessing,
    queueAction: OfflineManager.queueAction.bind(OfflineManager),
    processQueue: OfflineManager.processQueue.bind(OfflineManager),
  };
}
