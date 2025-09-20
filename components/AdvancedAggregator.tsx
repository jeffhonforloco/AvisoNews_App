import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Eye, BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface PoliticalBiasBar {
  left: number;
  centerLeft: number;
  center: number;
  centerRight: number;
  right: number;
}

interface AdvancedAggregatorProps {
  storyId: string;
  totalSources: number;
  politicalBias: PoliticalBiasBar;
  averageTrustScore: number;
  factCheckStatus: 'verified' | 'disputed' | 'mixed' | 'unverified';
  controversyLevel: number;
  coverageGaps: string[];
  onViewFullAnalysis?: () => void;
}

export default function AdvancedAggregator({ 
  storyId,
  totalSources,
  politicalBias,
  averageTrustScore,
  factCheckStatus,
  controversyLevel,
  coverageGaps,
  onViewFullAnalysis
}: AdvancedAggregatorProps) {
  const { colors } = useTheme();

  const getBiasColor = (position: string) => {
    switch (position) {
      case 'left': return '#3B82F6';
      case 'centerLeft': return '#60A5FA';
      case 'center': return '#6B7280';
      case 'centerRight': return '#F87171';
      case 'right': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getFactCheckColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'disputed': return '#F59E0B';
      case 'mixed': return '#8B5CF6';
      case 'unverified': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getFactCheckIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'disputed': return AlertTriangle;
      case 'mixed': return BarChart3;
      case 'unverified': return Eye;
      default: return Eye;
    }
  };

  const getControversyColor = (level: number) => {
    if (level >= 70) return '#EF4444';
    if (level >= 40) return '#F59E0B';
    return '#10B981';
  };

  const trustColor = getTrustColor(averageTrustScore);
  const factCheckColor = getFactCheckColor(factCheckStatus);
  const FactCheckIcon = getFactCheckIcon(factCheckStatus);
  const controversyColor = getControversyColor(controversyLevel);

  const totalBias = politicalBias.left + politicalBias.centerLeft + politicalBias.center + politicalBias.centerRight + politicalBias.right;
  const isBalanced = Math.abs(politicalBias.left + politicalBias.centerLeft - politicalBias.right - politicalBias.centerRight) <= 20;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}
      onPress={onViewFullAnalysis}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <Target size={16} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Source Analysis</Text>
        <View style={styles.headerBadges}>
          <View style={[styles.sourceBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.sourceCount, { color: colors.primary }]}>{totalSources}</Text>
          </View>
          {!isBalanced && (
            <View style={[styles.warningBadge, { backgroundColor: colors.status.warning + '20' }]}>
              <AlertTriangle size={12} color={colors.status.warning} />
            </View>
          )}
        </View>
      </View>

      {/* Political Bias Spectrum */}
      <View style={styles.biasSection}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Political Balance</Text>
        <View style={styles.biasBar}>
          {totalBias > 0 && (
            <>
              <View 
                style={[
                  styles.biasSegment, 
                  { 
                    backgroundColor: getBiasColor('left'),
                    width: `${(politicalBias.left / totalBias) * 100}%`
                  }
                ]} 
              />
              <View 
                style={[
                  styles.biasSegment, 
                  { 
                    backgroundColor: getBiasColor('centerLeft'),
                    width: `${(politicalBias.centerLeft / totalBias) * 100}%`
                  }
                ]} 
              />
              <View 
                style={[
                  styles.biasSegment, 
                  { 
                    backgroundColor: getBiasColor('center'),
                    width: `${(politicalBias.center / totalBias) * 100}%`
                  }
                ]} 
              />
              <View 
                style={[
                  styles.biasSegment, 
                  { 
                    backgroundColor: getBiasColor('centerRight'),
                    width: `${(politicalBias.centerRight / totalBias) * 100}%`
                  }
                ]} 
              />
              <View 
                style={[
                  styles.biasSegment, 
                  { 
                    backgroundColor: getBiasColor('right'),
                    width: `${(politicalBias.right / totalBias) * 100}%`
                  }
                ]} 
              />
            </>
          )}
        </View>
        <View style={styles.biasLabels}>
          <Text style={[styles.biasLabel, { color: getBiasColor('left') }]}>L</Text>
          <Text style={[styles.biasLabel, { color: getBiasColor('center') }]}>C</Text>
          <Text style={[styles.biasLabel, { color: getBiasColor('right') }]}>R</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Trust Score */}
        <View style={styles.metric}>
          <View style={[styles.metricBadge, { backgroundColor: `${trustColor}20` }]}>
            <Text style={[styles.metricValue, { color: trustColor }]}>{averageTrustScore}</Text>
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Trust</Text>
        </View>

        {/* Fact Check Status */}
        <View style={styles.metric}>
          <View style={[styles.metricBadge, { backgroundColor: `${factCheckColor}20` }]}>
            <FactCheckIcon size={14} color={factCheckColor} />
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>
            {factCheckStatus.charAt(0).toUpperCase() + factCheckStatus.slice(1)}
          </Text>
        </View>

        {/* Controversy Level */}
        <View style={styles.metric}>
          <View style={[styles.metricBadge, { backgroundColor: `${controversyColor}20` }]}>
            <Text style={[styles.metricValue, { color: controversyColor }]}>{controversyLevel}%</Text>
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Controversy</Text>
        </View>
      </View>

      {/* Coverage Gaps Alert */}
      {coverageGaps.length > 0 && (
        <View style={[styles.gapsAlert, { backgroundColor: colors.status.info + '20', borderColor: colors.status.info }]}>
          <Eye size={12} color={colors.status.info} />
          <Text style={[styles.gapsText, { color: colors.status.info }]}>
            Missing: {coverageGaps.slice(0, 2).join(', ')}
            {coverageGaps.length > 2 && ` +${coverageGaps.length - 2} more`}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
          Tap for detailed analysis
        </Text>
        <TrendingUp size={12} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  warningBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  biasSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  biasBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  biasSegment: {
    height: '100%',
  },
  biasLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  biasLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  gapsAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  gapsText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },
});