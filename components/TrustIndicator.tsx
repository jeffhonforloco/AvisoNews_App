import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react-native';
import { TrustMetrics } from '@/types/news';
import { useTheme } from '@/providers/ThemeProvider';

interface TrustIndicatorProps {
  trustScore: TrustMetrics;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export default function TrustIndicator({ trustScore, size = 'medium', showDetails = false }: TrustIndicatorProps) {
  const { colors } = useTheme();

  const getTrustColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getTrustIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Shield;
    if (score >= 40) return AlertTriangle;
    return XCircle;
  };

  const getTrustLabel = (score: number) => {
    if (score >= 80) return 'High Trust';
    if (score >= 60) return 'Medium Trust';
    if (score >= 40) return 'Low Trust';
    return 'Very Low Trust';
  };

  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;
  
  const TrustIcon = getTrustIcon(trustScore.overall);
  const trustColor = getTrustColor(trustScore.overall);

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: `${trustColor}20` }]}>
        <TrustIcon size={iconSize} color={trustColor} />
        <Text style={[styles.score, { color: trustColor, fontSize }]}>
          {trustScore.overall}
        </Text>
      </View>
      
      {showDetails && (
        <View style={styles.details}>
          <Text style={[styles.label, { color: colors.text.secondary, fontSize: fontSize - 1 }]}>
            {getTrustLabel(trustScore.overall)}
          </Text>
          <View style={styles.breakdown}>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Source</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{trustScore.sourceCredibility}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Factual</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{trustScore.factualAccuracy}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Editorial</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{trustScore.editorial}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  score: {
    fontWeight: '600',
  },
  details: {
    marginTop: 4,
  },
  label: {
    fontWeight: '500',
    marginBottom: 2,
  },
  breakdown: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: '600',
  },
});