import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { BiasAnalysis } from '@/types/news';
import { useTheme } from '@/providers/ThemeProvider';

interface BiasIndicatorProps {
  biasAnalysis: BiasAnalysis;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export default function BiasIndicator({ biasAnalysis, size = 'medium', showDetails = false }: BiasIndicatorProps) {
  const { colors } = useTheme();

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return '#3B82F6';
      case 'center-left': return '#60A5FA';
      case 'center': return '#6B7280';
      case 'center-right': return '#F87171';
      case 'right': return '#EF4444';
      case 'mixed': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getBiasIcon = (bias: string) => {
    if (bias.includes('left')) return TrendingDown;
    if (bias.includes('right')) return TrendingUp;
    return Minus;
  };

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'left': return 'Left';
      case 'center-left': return 'Center-Left';
      case 'center': return 'Center';
      case 'center-right': return 'Center-Right';
      case 'right': return 'Right';
      case 'mixed': return 'Mixed';
      default: return 'Unknown';
    }
  };

  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;
  
  const BiasIcon = getBiasIcon(biasAnalysis.overall);
  const biasColor = getBiasColor(biasAnalysis.overall);

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: `${biasColor}20` }]}>
        <BiasIcon size={iconSize} color={biasColor} />
        <Text style={[styles.label, { color: biasColor, fontSize }]}>
          {getBiasLabel(biasAnalysis.overall)}
        </Text>
      </View>
      
      {showDetails && (
        <View style={styles.details}>
          <Text style={[styles.confidence, { color: colors.text.secondary, fontSize: fontSize - 1 }]}>
            {Math.round(biasAnalysis.confidence * 100)}% confidence
          </Text>
          <View style={styles.breakdown}>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Political</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{biasAnalysis.political.score}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Emotional</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{biasAnalysis.emotional.score}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Factual</Text>
              <Text style={[styles.metricValue, { color: colors.text.secondary }]}>{biasAnalysis.factual.score}</Text>
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
  label: {
    fontWeight: '600',
  },
  details: {
    marginTop: 4,
  },
  confidence: {
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