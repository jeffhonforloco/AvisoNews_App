import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, TrendingUp, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface StoryTimeline {
  timestamp: string;
  source: string;
  headline: string;
  trustScore: number;
  biasRating: string;
  significance: 'breaking' | 'major' | 'minor';
}

interface StoryEvolution {
  originalStory: {
    headline: string;
    source: string;
    timestamp: string;
  };
  timeline: StoryTimeline[];
  consensusLevel: number;
  controversyScore: number;
  factCheckStatus: 'verified' | 'disputed' | 'unverified';
}

interface StoryEvolutionTrackerProps {
  evolution: StoryEvolution;
  onTimelinePress?: (item: StoryTimeline) => void;
}

export default function StoryEvolutionTracker({ evolution, onTimelinePress }: StoryEvolutionTrackerProps) {
  const { colors } = useTheme();

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'breaking': return '#EF4444';
      case 'major': return '#F59E0B';
      case 'minor': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getConsensusColor = (level: number) => {
    if (level >= 80) return '#10B981';
    if (level >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getFactCheckIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'disputed': return AlertTriangle;
      default: return Clock;
    }
  };

  const FactCheckIcon = getFactCheckIcon(evolution.factCheckStatus);
  const consensusColor = getConsensusColor(evolution.consensusLevel);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
      <View style={styles.header}>
        <Clock size={16} color={colors.text.secondary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Story Evolution</Text>
        <View style={styles.badges}>
          <View style={[styles.consensusBadge, { backgroundColor: `${consensusColor}20` }]}>
            <Text style={[styles.consensusText, { color: consensusColor }]}>
              {evolution.consensusLevel}% consensus
            </Text>
          </View>
          <View style={[styles.factCheckBadge, { backgroundColor: `${getFactCheckIcon(evolution.factCheckStatus) === CheckCircle ? '#10B981' : getFactCheckIcon(evolution.factCheckStatus) === AlertTriangle ? '#F59E0B' : '#6B7280'}20` }]}>
            <FactCheckIcon size={12} color={getFactCheckIcon(evolution.factCheckStatus) === CheckCircle ? '#10B981' : getFactCheckIcon(evolution.factCheckStatus) === AlertTriangle ? '#F59E0B' : '#6B7280'} />
          </View>
        </View>
      </View>

      <View style={[styles.originalStory, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.originalLabel, { color: colors.text.secondary }]}>Original Report</Text>
        <Text style={[styles.originalHeadline, { color: colors.text.primary }]} numberOfLines={2}>
          {evolution.originalStory.headline}
        </Text>
        <View style={styles.originalMeta}>
          <Text style={[styles.originalSource, { color: colors.text.secondary }]}>
            {evolution.originalStory.source}
          </Text>
          <Text style={[styles.originalTime, { color: colors.text.tertiary }]}>
            {new Date(evolution.originalStory.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {evolution.timeline.map((item, index) => {
            const significanceColor = getSignificanceColor(item.significance);
            
            return (
              <TouchableOpacity
                key={`${item.source}-${index}`}
                style={styles.timelineItem}
                onPress={() => onTimelinePress?.(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.timelineDot, { backgroundColor: significanceColor }]} />
                <View style={[styles.timelineCard, { backgroundColor: colors.background.primary, borderColor: colors.border.secondary }]}>
                  <View style={styles.timelineHeader}>
                    <Text style={[styles.timelineSource, { color: colors.text.primary }]} numberOfLines={1}>
                      {item.source}
                    </Text>
                    <View style={styles.timelineBadges}>
                      <View style={[styles.trustBadge, { backgroundColor: `${item.trustScore >= 80 ? '#10B981' : item.trustScore >= 60 ? '#F59E0B' : '#EF4444'}20` }]}>
                        <Text style={[styles.trustScore, { color: item.trustScore >= 80 ? '#10B981' : item.trustScore >= 60 ? '#F59E0B' : '#EF4444' }]}>
                          {item.trustScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={[styles.timelineHeadline, { color: colors.text.secondary }]} numberOfLines={3}>
                    {item.headline}
                  </Text>
                  
                  <View style={styles.timelineFooter}>
                    <Text style={[styles.timelineTime, { color: colors.text.tertiary }]}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </Text>
                    <View style={[styles.significanceBadge, { backgroundColor: significanceColor }]}>
                      <Text style={styles.significanceText}>
                        {item.significance.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {index < evolution.timeline.length - 1 && (
                  <View style={[styles.timelineConnector, { backgroundColor: colors.border.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {evolution.controversyScore > 50 && (
        <View style={[styles.controversyAlert, { backgroundColor: colors.status.warning + '20', borderColor: colors.status.warning }]}>
          <AlertTriangle size={14} color={colors.status.warning} />
          <Text style={[styles.controversyText, { color: colors.status.warning }]}>
            High controversy detected ({evolution.controversyScore}% disagreement)
          </Text>
        </View>
      )}

      <View style={styles.summaryStats}>
        <View style={styles.stat}>
          <Users size={14} color={colors.text.secondary} />
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {evolution.timeline.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Reports</Text>
        </View>
        
        <View style={styles.stat}>
          <TrendingUp size={14} color={colors.text.secondary} />
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {evolution.timeline.filter(t => t.significance === 'breaking').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Breaking</Text>
        </View>
        
        <View style={styles.stat}>
          <Globe size={14} color={colors.text.secondary} />
          <Text style={[styles.statValue, { color: colors.text.primary }]}>
            {new Set(evolution.timeline.map(t => t.source)).size}
          </Text>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Sources</Text>
        </View>
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
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  consensusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  consensusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  factCheckBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
  },
  originalStory: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  originalLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  originalHeadline: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6,
  },
  originalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  originalSource: {
    fontSize: 12,
    fontWeight: '500',
  },
  originalTime: {
    fontSize: 11,
  },
  timelineContainer: {
    paddingHorizontal: 16,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 16,
  },
  timelineItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  timelineCard: {
    width: 200,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineSource: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  timelineBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  trustBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trustScore: {
    fontSize: 10,
    fontWeight: '600',
  },
  timelineHeadline: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  timelineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTime: {
    fontSize: 10,
  },
  significanceBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  significanceText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timelineConnector: {
    width: 2,
    height: 20,
    marginTop: 20,
  },
  controversyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 6,
  },
  controversyText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
});