import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface SourceCredibility {
  name: string;
  trustScore: number;
  biasRating: 'left' | 'center-left' | 'center' | 'center-right' | 'right';
  factualRating: 'very-high' | 'high' | 'mostly-factual' | 'mixed' | 'low';
  transparency: number;
  methodology: string;
}

interface SourceCredibilityBarProps {
  sources: SourceCredibility[];
  onSourcePress?: (source: SourceCredibility) => void;
}

export default function SourceCredibilityBar({ sources, onSourcePress }: SourceCredibilityBarProps) {
  const { colors } = useTheme();

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return '#3B82F6';
      case 'center-left': return '#60A5FA';
      case 'center': return '#6B7280';
      case 'center-right': return '#F87171';
      case 'right': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrustIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Shield;
    return AlertTriangle;
  };

  const getFactualColor = (rating: string) => {
    switch (rating) {
      case 'very-high': return '#10B981';
      case 'high': return '#34D399';
      case 'mostly-factual': return '#F59E0B';
      case 'mixed': return '#EF4444';
      case 'low': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
      <View style={styles.header}>
        <Info size={16} color={colors.text.secondary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Source Analysis</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>({sources.length} sources)</Text>
      </View>

      <View style={styles.sourcesList}>
        {sources.map((source, index) => {
          const TrustIcon = getTrustIcon(source.trustScore);
          const biasColor = getBiasColor(source.biasRating);
          const factualColor = getFactualColor(source.factualRating);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.sourceItem, { borderBottomColor: colors.border.secondary }]}
              onPress={() => onSourcePress?.(source)}
              activeOpacity={0.7}
            >
              <View style={styles.sourceHeader}>
                <Text style={[styles.sourceName, { color: colors.text.primary }]} numberOfLines={1}>
                  {source.name}
                </Text>
                <View style={styles.badges}>
                  <View style={[styles.trustBadge, { backgroundColor: `${getTrustIcon(source.trustScore) === CheckCircle ? '#10B981' : getTrustIcon(source.trustScore) === Shield ? '#F59E0B' : '#EF4444'}20` }]}>
                    <TrustIcon size={12} color={getTrustIcon(source.trustScore) === CheckCircle ? '#10B981' : getTrustIcon(source.trustScore) === Shield ? '#F59E0B' : '#EF4444'} />
                    <Text style={[styles.trustScore, { color: getTrustIcon(source.trustScore) === CheckCircle ? '#10B981' : getTrustIcon(source.trustScore) === Shield ? '#F59E0B' : '#EF4444' }]}>
                      {source.trustScore}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <View style={[styles.biasIndicator, { backgroundColor: biasColor }]} />
                  <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                    {source.biasRating.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>

                <View style={styles.metric}>
                  <View style={[styles.factualIndicator, { backgroundColor: factualColor }]} />
                  <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                    {source.factualRating.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>

                <View style={styles.transparencyBar}>
                  <View style={[styles.transparencyFill, { width: `${source.transparency}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.transparencyText, { color: colors.text.tertiary }]}>
                  {source.transparency}% transparent
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  sourcesList: {
    paddingHorizontal: 16,
  },
  sourceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  trustScore: {
    fontSize: 11,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  biasIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  factualIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  transparencyBar: {
    width: 40,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  transparencyFill: {
    height: '100%',
    borderRadius: 2,
  },
  transparencyText: {
    fontSize: 9,
    marginLeft: 4,
  },
});