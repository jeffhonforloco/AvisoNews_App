import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AttributionBarProps {
  sourceName: string;
  canonicalUrl?: string; // Made optional since we don't use it anymore
}

export default function AttributionBar({ sourceName }: AttributionBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Source Attribution</Text>
        <Text style={styles.source}>{sourceName}</Text>
        <Text style={styles.disclaimer}>
          Content curated and verified by AvisoNews
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  source: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  disclaimer: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});