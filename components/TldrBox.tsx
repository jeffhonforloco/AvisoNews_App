import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Zap } from "lucide-react-native";

interface TldrBoxProps {
  tldr: string;
}

export default function TldrBox({ tldr }: TldrBoxProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Zap size={16} color="#FF6B6B" />
        <Text style={styles.title}>TL;DR</Text>
      </View>
      <Text style={styles.content}>{tldr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B6B",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1C1C1E",
  },
});