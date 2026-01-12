import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ExternalLink, CheckCircle } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

interface AttributionBarProps {
  sourceName: string;
  canonicalUrl?: string;
}

export default function AttributionBar({ sourceName, canonicalUrl }: AttributionBarProps) {
  const { theme } = useTheme();

  const handleOpenSource = () => {
    if (canonicalUrl) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(canonicalUrl);
    }
  };

  return (
    <View style={[styles.container, { borderTopColor: theme.border }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <CheckCircle size={14} color={theme.success} />
          <Text style={[styles.label, { color: theme.textTertiary }]}>Source Attribution</Text>
        </View>
        <Text style={[styles.source, { color: theme.text }]}>{sourceName}</Text>
        <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
          Content curated and verified by AvisoNews
        </Text>
      </View>
      {canonicalUrl && (
        <TouchableOpacity 
          style={[styles.visitButton, { backgroundColor: theme.inputBackground }]}
          onPress={handleOpenSource}
          activeOpacity={0.7}
        >
          <ExternalLink size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    marginTop: 8,
    borderTopWidth: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
    marginLeft: 6,
  },
  source: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: "500",
  },
  visitButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
