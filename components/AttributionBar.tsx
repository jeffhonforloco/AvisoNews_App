import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Linking } from "react-native";
import { ExternalLink } from "lucide-react-native";

interface AttributionBarProps {
  sourceName: string;
  canonicalUrl: string;
}

export default function AttributionBar({ sourceName, canonicalUrl }: AttributionBarProps) {
  const handleOpenSource = () => {
    Linking.openURL(canonicalUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Original Source</Text>
        <Text style={styles.source}>{sourceName}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleOpenSource}>
        <Text style={styles.buttonText}>Read Original</Text>
        <ExternalLink size={14} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginBottom: 2,
  },
  source: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 4,
  },
});