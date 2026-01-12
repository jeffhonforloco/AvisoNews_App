import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ArticleCardSkeleton() {
  return (
    <View style={styles.articleCard}>
      <Skeleton width="100%" height={200} borderRadius={12} style={styles.image} />
      <View style={styles.content}>
        <Skeleton width={80} height={20} borderRadius={10} style={styles.category} />
        <Skeleton width="100%" height={24} style={styles.title} />
        <Skeleton width="100%" height={20} style={styles.line} />
        <Skeleton width="70%" height={20} style={styles.line} />
        <View style={styles.meta}>
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
        </View>
      </View>
    </View>
  );
}

export function ArticleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  articleCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  category: {
    marginBottom: 4,
  },
  title: {
    marginBottom: 4,
  },
  line: {
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
});
