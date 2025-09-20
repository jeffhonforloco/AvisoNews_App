import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Shield, TrendingUp, Eye, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { TrustInsights, BiasBreakdown, CoverageGap } from '@/types/news';

interface TrustDashboardProps {
  trustInsights: TrustInsights;
  biasBreakdown: BiasBreakdown;
  coverageGaps: CoverageGap[];
  onViewDetails?: (section: string) => void;
}

export default function TrustDashboard({ 
  trustInsights, 
  biasBreakdown, 
  coverageGaps, 
  onViewDetails 
}: TrustDashboardProps) {
  const { colors } = useTheme();

  const getTrustColor = (score: number) => {
    if (score >= 80) return colors.status.success;
    if (score >= 60) return colors.status.warning;
    return colors.status.error;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.secondary }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Shield size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Trust & Accountability</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          Your news quality insights
        </Text>
      </View>

      {/* Trust Overview */}
      <View style={[styles.section, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
        <View style={styles.sectionHeader}>
          <CheckCircle size={20} color={colors.status.success} />
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Trust Overview</Text>
        </View>
        
        <View style={styles.trustOverview}>
          <View style={styles.trustMetric}>
            <Text style={[styles.trustScore, { color: getTrustColor(trustInsights.averageTrust) }]}>
              {Math.round(trustInsights.averageTrust)}
            </Text>
            <Text style={[styles.trustLabel, { color: colors.text.secondary }]}>Average Trust</Text>
          </View>
          
          <View style={styles.trustDistribution}>
            <Text style={[styles.distributionTitle, { color: colors.text.primary }]}>Source Distribution</Text>
            <View style={styles.distributionBars}>
              <View style={styles.distributionItem}>
                <View style={[styles.distributionBar, { backgroundColor: colors.status.success }]}>
                  <View 
                    style={[
                      styles.distributionFill, 
                      { 
                        backgroundColor: colors.status.success,
                        width: `${trustInsights.sourceDistribution.high}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.distributionLabel, { color: colors.text.secondary }]}>
                  High ({trustInsights.sourceDistribution.high}%)
                </Text>
              </View>
              
              <View style={styles.distributionItem}>
                <View style={[styles.distributionBar, { backgroundColor: colors.status.warning + '30' }]}>
                  <View 
                    style={[
                      styles.distributionFill, 
                      { 
                        backgroundColor: colors.status.warning,
                        width: `${trustInsights.sourceDistribution.medium}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.distributionLabel, { color: colors.text.secondary }]}>
                  Medium ({trustInsights.sourceDistribution.medium}%)
                </Text>
              </View>
              
              <View style={styles.distributionItem}>
                <View style={[styles.distributionBar, { backgroundColor: colors.status.error + '30' }]}>
                  <View 
                    style={[
                      styles.distributionFill, 
                      { 
                        backgroundColor: colors.status.error,
                        width: `${trustInsights.sourceDistribution.low}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.distributionLabel, { color: colors.text.secondary }]}>
                  Low ({trustInsights.sourceDistribution.low}%)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bias Balance */}
      <View style={[styles.section, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Bias Balance</Text>
        </View>
        
        <View style={styles.biasBalance}>
          <View style={styles.biasItem}>
            <View style={[styles.biasIndicator, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.biasLabel, { color: colors.text.secondary }]}>Left</Text>
            <Text style={[styles.biasValue, { color: colors.text.primary }]}>
              {trustInsights.biasBalance.left}%
            </Text>
          </View>
          
          <View style={styles.biasItem}>
            <View style={[styles.biasIndicator, { backgroundColor: '#6B7280' }]} />
            <Text style={[styles.biasLabel, { color: colors.text.secondary }]}>Center</Text>
            <Text style={[styles.biasValue, { color: colors.text.primary }]}>
              {trustInsights.biasBalance.center}%
            </Text>
          </View>
          
          <View style={styles.biasItem}>
            <View style={[styles.biasIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={[styles.biasLabel, { color: colors.text.secondary }]}>Right</Text>
            <Text style={[styles.biasValue, { color: colors.text.primary }]}>
              {trustInsights.biasBalance.right}%
            </Text>
          </View>
        </View>
      </View>

      {/* Fact-Check Status */}
      <View style={[styles.section, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
        <View style={styles.sectionHeader}>
          <AlertTriangle size={20} color={colors.status.warning} />
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Fact-Check Status</Text>
        </View>
        
        <View style={styles.factCheckGrid}>
          <View style={styles.factCheckItem}>
            <CheckCircle size={16} color={colors.status.success} />
            <Text style={[styles.factCheckValue, { color: colors.text.primary }]}>
              {trustInsights.factualityBreakdown.verified}%
            </Text>
            <Text style={[styles.factCheckLabel, { color: colors.text.secondary }]}>Verified</Text>
          </View>
          
          <View style={styles.factCheckItem}>
            <AlertTriangle size={16} color={colors.status.warning} />
            <Text style={[styles.factCheckValue, { color: colors.text.primary }]}>
              {trustInsights.factualityBreakdown.disputed}%
            </Text>
            <Text style={[styles.factCheckLabel, { color: colors.text.secondary }]}>Disputed</Text>
          </View>
          
          <View style={styles.factCheckItem}>
            <Eye size={16} color={colors.text.tertiary} />
            <Text style={[styles.factCheckValue, { color: colors.text.primary }]}>
              {trustInsights.factualityBreakdown.unverified}%
            </Text>
            <Text style={[styles.factCheckLabel, { color: colors.text.secondary }]}>Unverified</Text>
          </View>
        </View>
      </View>

      {/* Coverage Gaps */}
      {coverageGaps.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={20} color={colors.secondary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Coverage Gaps</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
              Missing perspectives in your feed
            </Text>
          </View>
          
          {coverageGaps.slice(0, 3).map((gap, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.gapItem, { borderBottomColor: colors.border.primary }]}
              onPress={() => onViewDetails?.('coverage-gap')}
            >
              <View style={styles.gapHeader}>
                <Text style={[styles.gapTopic, { color: colors.text.primary }]}>{gap.topic}</Text>
                <View style={[styles.importanceBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.importanceText, { color: colors.primary }]}>
                    {Math.round(gap.importance * 100)}% important
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.gapDescription, { color: colors.text.secondary }]}>
                Missing: {gap.missingPerspectives.join(', ')}
              </Text>
              
              <Text style={[styles.gapSuggestion, { color: colors.accent }]}>
                Suggested: {gap.suggestedSources.slice(0, 2).join(', ')}
                {gap.suggestedSources.length > 2 && ` +${gap.suggestedSources.length - 2} more`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => onViewDetails?.('trust-settings')}
        >
          <Shield size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Trust Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
          onPress={() => onViewDetails?.('source-analysis')}
        >
          <BarChart3 size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Source Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  trustOverview: {
    flexDirection: 'row',
    gap: 20,
  },
  trustMetric: {
    alignItems: 'center',
  },
  trustScore: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  trustLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  trustDistribution: {
    flex: 1,
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  distributionBars: {
    gap: 6,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distributionBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 3,
  },
  distributionLabel: {
    fontSize: 11,
    flex: 1,
  },
  biasBalance: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  biasItem: {
    alignItems: 'center',
    gap: 4,
  },
  biasIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  biasLabel: {
    fontSize: 12,
  },
  biasValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  factCheckGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  factCheckItem: {
    alignItems: 'center',
    gap: 4,
  },
  factCheckValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  factCheckLabel: {
    fontSize: 11,
  },
  gapItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  gapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  gapTopic: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  importanceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  gapDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  gapSuggestion: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});