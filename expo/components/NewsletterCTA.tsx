import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Mail, AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NewsAPI } from "@/services/api";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSubscribe = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await NewsAPI.subscribeNewsletter(email.trim());

      if (result.success) {
        setSubscribed(true);
        setEmail("");
      } else {
        setError(result.message || "Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#FF6B6B", "#FF8E53"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>🎉 You're subscribed!</Text>
            <Text style={styles.successText}>
              Check your inbox for our daily digest
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#FF6B6B", "#FF8E53"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Mail size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Stay Informed</Text>
          <Text style={styles.subtitle}>
            Get our daily digest of curated news delivered to your inbox
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              accessibilityLabel="Email input"
            />
            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubscribe}
              disabled={isSubmitting}
              accessibilityLabel="Subscribe to newsletter"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FF6B6B" />
              ) : (
                <Text style={styles.buttonText}>Subscribe</Text>
              )}
            </TouchableOpacity>
          </View>
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color="#FFFFFF" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 32,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  gradient: {
    padding: 24,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 8,
  },
  inputError: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    minWidth: 100,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  successContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 6,
  },
});