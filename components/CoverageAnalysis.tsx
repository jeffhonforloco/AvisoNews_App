import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Globe, Users, BarChart3, Eye } from 'lucide-react-native';
import { CoverageAnalysis as CoverageAnalysisType } from '@/types/news';
import { useTheme } from '@/providers/ThemeProvider';

interface CoverageAnalysisProps {
  coverage: CoverageAnalysisType;
  showDetails?: boolean;
}

export default function CoverageAnalysis({ coverage, showDetails = false }: CoverageAnalysisProps) {
  const { colors } = useTheme();

  const getCompletenessColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#EF4444';
    return '#6B7280';
  };

  const completenessColor = getCompletenessColor(coverage.completeness);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
      <View style={styles.header}>
        <Eye size={16} color={colors.text.secondary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Coverage Analysis</Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <View style={styles.metricHeader}>
            <BarChart3 size={14} color={colors.text.secondary} />
            <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>Completeness</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: completenessColor,
                  width: `${coverage.completeness}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.metricValue, { color: completenessColor }]}>
            {coverage.completeness}%
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Users size={14} color={colors.text.secondary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{coverage.perspectives}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Perspectives</Text>
          </View>
          
          <View style={styles.stat}>
            <Globe size={14} color={colors.text.secondary} />
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{coverage.sources}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Sources</Text>
          </View>
        </View>
      </View>

      {showDetails && (
        <View style={styles.details}>
          {coverage.geographic.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={[styles.detailTitle, { color: colors.text.primary }]}>Geographic Coverage</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tags}>
                  {coverage.geographic.map((region, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.tagText, { color: colors.text.secondary }]}>{region}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {coverage.political.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={[styles.detailTitle, { color: colors.text.primary }]}>Political Spectrum</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tags}>
                  {coverage.political.map((perspective, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.tagText, { color: colors.text.secondary }]}>{perspective}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  metrics: {
    gap: 8,
  },
  metric: {
    gap: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  detailSection: {
    gap: 4,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
});