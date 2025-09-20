import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle, Smile } from 'lucide-react-native';
import { FactCheckResult } from '@/types/news';
import { useTheme } from '@/providers/ThemeProvider';

interface FactCheckBadgeProps {
  factCheck: FactCheckResult;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

export default function FactCheckBadge({ factCheck, size = 'medium', onPress }: FactCheckBadgeProps) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'disputed': return '#F59E0B';
      case 'false': return '#EF4444';
      case 'unverified': return '#6B7280';
      case 'satire': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'disputed': return AlertTriangle;
      case 'false': return XCircle;
      case 'unverified': return HelpCircle;
      case 'satire': return Smile;
      default: return HelpCircle;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'disputed': return 'Disputed';
      case 'false': return 'False';
      case 'unverified': return 'Unverified';
      case 'satire': return 'Satire';
      default: return 'Unknown';
    }
  };

  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;
  
  const StatusIcon = getStatusIcon(factCheck.status);
  const statusColor = getStatusColor(factCheck.status);

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={[styles.container, { backgroundColor: `${statusColor}20` }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <StatusIcon size={iconSize} color={statusColor} />
      <Text style={[styles.label, { color: statusColor, fontSize }]}>
        {getStatusLabel(factCheck.status)}
      </Text>
      {factCheck.confidence > 0 && (
        <Text style={[styles.confidence, { color: statusColor, fontSize: fontSize - 2 }]}>
          {Math.round(factCheck.confidence * 100)}%
        </Text>
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
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
  confidence: {
    fontWeight: '500',
    opacity: 0.8,
  },
});