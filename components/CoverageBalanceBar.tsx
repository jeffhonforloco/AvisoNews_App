import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface PoliticalSpectrum {
  left: number;
  centerLeft: number;
  center: number;
  centerRight: number;
  right: number;
}

interface CoverageBalance {
  political: PoliticalSpectrum;
  geographic: { region: string; percentage: number }[];
  demographic: { group: string; representation: number }[];
  totalSources: number;
  diversityScore: number;
}

interface CoverageBalanceBarProps {
  coverage: CoverageBalance;
  onViewDetails?: () => void;
}

export default function CoverageBalanceBar({ coverage, onViewDetails }: CoverageBalanceBarProps) {
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

  const getDiversityColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getDiversityIcon = (score: number) => {
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Minus;
    return TrendingDown;
  };

  const DiversityIcon = getDiversityIcon(coverage.diversityScore);
  const diversityColor = getDiversityColor(coverage.diversityScore);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
      <TouchableOpacity style={styles.header} onPress={onViewDetails} activeOpacity={0.7}>
        <BarChart3 size={16} color={colors.text.secondary} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Coverage Balance</Text>
        <View style={[styles.diversityBadge, { backgroundColor: `${diversityColor}20` }]}>
          <DiversityIcon size={12} color={diversityColor} />
          <Text style={[styles.diversityScore, { color: diversityColor }]}>
            {coverage.diversityScore}%
          </Text>
        </View>
      </TouchableOpacity>

      {/* Political Spectrum Bar */}
      <View style={styles.spectrumContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Political Spectrum</Text>
        <View style={styles.spectrumBar}>
          <View 
            style={[
              styles.spectrumSegment, 
              { 
                backgroundColor: getBiasColor('left'),
                width: `${coverage.political.left}%`
              }
            ]} 
          />
          <View 
            style={[
              styles.spectrumSegment, 
              { 
                backgroundColor: getBiasColor('centerLeft'),
                width: `${coverage.political.centerLeft}%`
              }
            ]} 
          />
          <View 
            style={[
              styles.spectrumSegment, 
              { 
                backgroundColor: getBiasColor('center'),
                width: `${coverage.political.center}%`
              }
            ]} 
          />
          <View 
            style={[
              styles.spectrumSegment, 
              { 
                backgroundColor: getBiasColor('centerRight'),
                width: `${coverage.political.centerRight}%`
              }
            ]} 
          />
          <View 
            style={[
              styles.spectrumSegment, 
              { 
                backgroundColor: getBiasColor('right'),
                width: `${coverage.political.right}%`
              }
            ]} 
          />
        </View>
        
        <View style={styles.spectrumLabels}>
          <Text style={[styles.spectrumLabel, { color: getBiasColor('left') }]}>
            L {coverage.political.left}%
          </Text>
          <Text style={[styles.spectrumLabel, { color: getBiasColor('centerLeft') }]}>
            CL {coverage.political.centerLeft}%
          </Text>
          <Text style={[styles.spectrumLabel, { color: getBiasColor('center') }]}>
            C {coverage.political.center}%
          </Text>
          <Text style={[styles.spectrumLabel, { color: getBiasColor('centerRight') }]}>
            CR {coverage.political.centerRight}%
          </Text>
          <Text style={[styles.spectrumLabel, { color: getBiasColor('right') }]}>
            R {coverage.political.right}%
          </Text>
        </View>
      </View>

      {/* Geographic Coverage */}
      {coverage.geographic.length > 0 && (
        <View style={styles.geographicContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Geographic Coverage</Text>
          <View style={styles.geographicList}>
            {coverage.geographic.slice(0, 4).map((region, index) => (
              <View key={region.region} style={styles.geographicItem}>
                <Text style={[styles.regionName, { color: colors.text.secondary }]}>
                  {region.region}
                </Text>
                <View style={styles.regionBar}>
                  <View 
                    style={[
                      styles.regionFill, 
                      { 
                        width: `${region.percentage}%`,
                        backgroundColor: colors.primary
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.regionPercentage, { color: colors.text.primary }]}>
                  {region.percentage}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Coverage Gaps Alert */}
      {coverage.diversityScore < 60 && (
        <View style={[styles.alertContainer, { backgroundColor: colors.status.warning + '20', borderColor: colors.status.warning }]}>
          <AlertCircle size={14} color={colors.status.warning} />
          <Text style={[styles.alertText, { color: colors.status.warning }]}>
            Low diversity detected. Consider adding more varied sources.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
          Based on {coverage.totalSources} sources
        </Text>
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
  diversityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  diversityScore: {
    fontSize: 12,
    fontWeight: '600',
  },
  spectrumContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  spectrumBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  spectrumSegment: {
    height: '100%',
  },
  spectrumLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  spectrumLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  geographicContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 12,
  },
  geographicList: {
    gap: 6,
  },
  geographicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regionName: {
    fontSize: 12,
    fontWeight: '500',
    width: 60,
  },
  regionBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  regionFill: {
    height: '100%',
    borderRadius: 2,
  },
  regionPercentage: {
    fontSize: 11,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 6,
  },
  alertText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});