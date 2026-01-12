import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Zap } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";

interface TldrBoxProps {
  tldr: string;
}

export default function TldrBox({ tldr }: TldrBoxProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + "10", borderColor: theme.primary + "25" }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <Zap size={14} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: theme.primary }]}>TL;DR</Text>
      </View>
      <Text style={[styles.content, { color: theme.text }]}>{tldr}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 10,
    letterSpacing: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
});
