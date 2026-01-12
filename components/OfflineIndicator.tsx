import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTheme } from '@/providers/ThemeProvider';

export function OfflineIndicator() {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const { theme } = useTheme();
  const isOffline = !isConnected || isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.warning }]}>
      <WifiOff size={16} color="#FFFFFF" />
      <Text style={styles.text}>
        {!isConnected ? 'No internet connection' : 'Connection unstable'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
