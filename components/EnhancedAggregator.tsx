import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  BarChart3,
  Globe,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { Article } from '@/types/news';

interface EnhancedAggregatorProps {
  article: Article;
  compact?: boolean;
}

export default function EnhancedAggregator({ 
  article,
  compact = false
}: EnhancedAggregatorProps) {
  const { colors } = useTheme();
  
  // Return null if no article or aggregator data
  if (!article || !article.aggregatorData) {
    return null;
  }
  
  const {
    totalSources,
    politicalBias,
    averageTrustScore,
    factCheckStatus,
    controversyLevel,
    coverageGaps,
    sourceEvolution
  } = article.aggregatorData;
  
  const sourceEvolutionTimeline = sourceEvolution?.timeline || [];
  const consensusLevel = sourceEvolution?.consensusLevel || 75;

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

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'breaking': return '#EF4444';
      case 'major': return '#F59E0B';
      case 'minor': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const trustColor = getTrustColor(averageTrustScore);
  const factCheckColor = getFactCheckColor(factCheckStatus);
  const FactCheckIcon = getFactCheckIcon(factCheckStatus);
  const controversyColor = getControversyColor(controversyLevel);

  const totalBias = (politicalBias?.left || 0) + (politicalBias?.centerLeft || 0) + (politicalBias?.center || 0) + (politicalBias?.centerRight || 0) + (politicalBias?.right || 0);
  const isBalanced = Math.abs((politicalBias?.left || 0) + (politicalBias?.centerLeft || 0) - (politicalBias?.right || 0) - (politicalBias?.centerRight || 0)) <= 20;

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.background.card + '80', borderColor: colors.border.primary }]}>
        <View style={styles.compactHeader}>
          <View style={styles.compactHeaderLeft}>
            <Target size={14} color={colors.primary} />
            <Text style={[styles.compactTitle, { color: colors.text.primary }]}>Source Intelligence</Text>
            <View style={[styles.compactSourceBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.compactSourceCount, { color: colors.primary }]}>{totalSources}</Text>
            </View>
          </View>
          <View style={styles.compactMetrics}>
            <Text style={[styles.compactMetricValue, { color: getTrustColor(averageTrustScore) }]}>{averageTrustScore}</Text>
            <Text style={[styles.compactMetricLabel, { color: colors.text.tertiary }]}>Trust</Text>
          </View>
        </View>
        
        <View style={styles.compactBiasBar}>
          {totalBias > 0 && (
            <>
              {(politicalBias?.left || 0) > 0 && (
                <View 
                  style={[
                    styles.compactBiasSegment, 
                    { 
                      backgroundColor: getBiasColor('left'),
                      width: `${((politicalBias?.left || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.centerLeft || 0) > 0 && (
                <View 
                  style={[
                    styles.compactBiasSegment, 
                    { 
                      backgroundColor: getBiasColor('centerLeft'),
                      width: `${((politicalBias?.centerLeft || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.center || 0) > 0 && (
                <View 
                  style={[
                    styles.compactBiasSegment, 
                    { 
                      backgroundColor: getBiasColor('center'),
                      width: `${((politicalBias?.center || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.centerRight || 0) > 0 && (
                <View 
                  style={[
                    styles.compactBiasSegment, 
                    { 
                      backgroundColor: getBiasColor('centerRight'),
                      width: `${((politicalBias?.centerRight || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.right || 0) > 0 && (
                <View 
                  style={[
                    styles.compactBiasSegment, 
                    { 
                      backgroundColor: getBiasColor('right'),
                      width: `${((politicalBias?.right || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
      {/* Header with Enhanced Branding */}
      <LinearGradient
        colors={['#FF6B6B20', '#4ECDC420']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Target size={18} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text.primary }]}>Source Intelligence</Text>
          </View>
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
      </LinearGradient>

      {/* Key Metrics Row */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: `${trustColor}20` }]}>
            <Text style={[styles.metricValue, { color: trustColor }]}>{averageTrustScore}</Text>
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Trust Score</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: `${factCheckColor}20` }]}>
            <FactCheckIcon size={16} color={factCheckColor} />
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>
            {factCheckStatus.charAt(0).toUpperCase() + factCheckStatus.slice(1)}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: `${controversyColor}20` }]}>
            <Text style={[styles.metricSmallValue, { color: controversyColor }]}>{controversyLevel}%</Text>
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Controversy</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIcon, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.metricSmallValue, { color: colors.primary }]}>{consensusLevel}%</Text>
          </View>
          <Text style={[styles.metricLabel, { color: colors.text.tertiary }]}>Consensus</Text>
        </View>
      </View>

      {/* Political Bias Spectrum */}
      <View style={styles.biasSection}>
        <View style={styles.biasHeader}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Political Balance</Text>
          <View style={styles.balanceIndicator}>
            <Globe size={12} color={isBalanced ? colors.status.success : colors.status.warning} />
            <Text style={[styles.balanceText, { 
              color: isBalanced ? colors.status.success : colors.status.warning 
            }]}>
              {isBalanced ? 'Balanced' : 'Skewed'}
            </Text>
          </View>
        </View>
        
        <View style={styles.biasBar}>
          {totalBias > 0 && (
            <>
              {(politicalBias?.left || 0) > 0 && (
                <View 
                  style={[
                    styles.biasSegment, 
                    { 
                      backgroundColor: getBiasColor('left'),
                      width: `${((politicalBias?.left || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.centerLeft || 0) > 0 && (
                <View 
                  style={[
                    styles.biasSegment, 
                    { 
                      backgroundColor: getBiasColor('centerLeft'),
                      width: `${((politicalBias?.centerLeft || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.center || 0) > 0 && (
                <View 
                  style={[
                    styles.biasSegment, 
                    { 
                      backgroundColor: getBiasColor('center'),
                      width: `${((politicalBias?.center || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.centerRight || 0) > 0 && (
                <View 
                  style={[
                    styles.biasSegment, 
                    { 
                      backgroundColor: getBiasColor('centerRight'),
                      width: `${((politicalBias?.centerRight || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
              {(politicalBias?.right || 0) > 0 && (
                <View 
                  style={[
                    styles.biasSegment, 
                    { 
                      backgroundColor: getBiasColor('right'),
                      width: `${((politicalBias?.right || 0) / totalBias) * 100}%`
                    }
                  ]} 
                />
              )}
            </>
          )}
        </View>
        
        <View style={styles.biasLabels}>
          <Text style={[styles.biasLabel, { color: getBiasColor('left') }]}>Left</Text>
          <Text style={[styles.biasLabel, { color: getBiasColor('center') }]}>Center</Text>
          <Text style={[styles.biasLabel, { color: getBiasColor('right') }]}>Right</Text>
        </View>
      </View>

      {/* Source Evolution Timeline */}
      {sourceEvolutionTimeline.length > 0 && (
        <View style={styles.evolutionSection}>
          <View style={styles.evolutionHeader}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>Story Evolution</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.evolutionScroll}>
            {sourceEvolutionTimeline.slice(0, 5).map((item) => (
              <TouchableOpacity 
                key={`${item.source}-${item.timestamp}`} 
                style={styles.evolutionItem}
                onPress={() => {
                  const sourceId = item.source.toLowerCase().replace(/\s+/g, '');
                  router.push(`/source/${sourceId}`);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.evolutionDot, { 
                  backgroundColor: getSignificanceColor(item.significance) 
                }]} />
                <Text style={[styles.evolutionSource, { color: colors.text.primary }]}>
                  {item.source}
                </Text>
                <Text style={[styles.evolutionTime, { color: colors.text.tertiary }]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
                <ChevronRight size={10} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Coverage Gaps Alert */}
      {coverageGaps.length > 0 && (
        <View style={[styles.gapsAlert, { 
          backgroundColor: colors.status.info + '20', 
          borderColor: colors.status.info 
        }]}>
          <Eye size={14} color={colors.status.info} />
          <View style={styles.gapsContent}>
            <Text style={[styles.gapsTitle, { color: colors.status.info }]}>
              Missing Perspectives
            </Text>
            <Text style={[styles.gapsText, { color: colors.text.secondary }]}>
              {coverageGaps.slice(0, 2).join(', ')}
              {coverageGaps.length > 2 && ` +${coverageGaps.length - 2} more`}
            </Text>
          </View>
        </View>
      )}

      {/* Enhanced Footer */}
      <TouchableOpacity 
        style={styles.footer}
        onPress={() => router.push(`/article/${article.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.footerContent}>
          <Users size={14} color={colors.primary} />
          <Text style={[styles.footerText, { color: colors.primary }]}>
            View Full Analysis & Source Breakdown
          </Text>
        </View>
        <TrendingUp size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 12,
    overflow: 'hidden',
  },
  compactContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    overflow: 'hidden',
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactSourceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  compactSourceCount: {
    fontSize: 10,
    fontWeight: '700',
  },
  compactMetrics: {
    alignItems: 'center',
  },
  compactMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  compactMetricLabel: {
    fontSize: 8,
    fontWeight: '500',
  },
  compactBiasBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  compactBiasSegment: {
    height: '100%',
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  warningBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricSmallValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  biasSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  biasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  balanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  biasBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
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
  evolutionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  evolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evolutionScroll: {
    flexDirection: 'row',
  },
  evolutionItem: {
    alignItems: 'center',
    marginRight: 16,
    gap: 4,
  },
  evolutionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  evolutionSource: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 60,
    textAlign: 'center',
  },
  evolutionTime: {
    fontSize: 9,
  },
  gapsAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  gapsContent: {
    flex: 1,
    gap: 2,
  },
  gapsTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  gapsText: {
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
  },
});