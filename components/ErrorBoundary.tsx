import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReportIssue = () => {
    const errorInfo = this.state.error ? encodeURIComponent(this.state.error.message) : '';
    Linking.openURL(`mailto:support@avisonews.com?subject=Error Report&body=Error: ${errorInfo}`);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const isDark = false; // Default to light theme in error state

      return (
        <LinearGradient
          colors={isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F8FAFC']}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.errorIcon}>
              <LinearGradient
                colors={['#FEE2E2', '#FECACA']}
                style={styles.iconGradient}
              >
                <AlertTriangle size={32} color="#DC2626" />
              </LinearGradient>
            </View>
            
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Oops! Something went wrong
            </Text>
            <Text style={[styles.message, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {this.state.error?.message || "We encountered an unexpected error. Please try again."}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={this.handleReset}>
                <RefreshCw size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={this.handleReportIssue}>
                <Bug size={18} color="#FF6B6B" />
                <Text style={styles.secondaryButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && this.state.error && (
              <View style={[styles.debugContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <View style={styles.debugHeader}>
                  <Bug size={16} color="#FF6B6B" />
                  <Text style={[styles.debugTitle, { color: isDark ? '#F87171' : '#DC2626' }]}>
                    Debug Information
                  </Text>
                </View>
                <ScrollView style={styles.debugScroll} horizontal>
                  <Text style={[styles.debugText, { color: isDark ? '#94A3B8' : '#475569' }]}>
                    {this.state.error.stack}
                  </Text>
                </ScrollView>
              </View>
            )}

            <View style={styles.helpSection}>
              <Text style={[styles.helpTitle, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                Need help?
              </Text>
              <Text style={[styles.helpText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                If this problem persists, please contact our support team
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorIcon: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
    width: "100%",
    maxWidth: 280,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  debugContainer: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 340,
  },
  debugHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  debugScroll: {
    maxHeight: 120,
  },
  debugText: {
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  helpSection: {
    marginTop: 40,
    alignItems: "center",
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
  },
});