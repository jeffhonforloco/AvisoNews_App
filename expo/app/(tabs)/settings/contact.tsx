import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Mail, MessageCircle, Send } from "lucide-react-native";

export default function ContactScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Contact form submitted:", { name, email, message });

      Alert.alert(
        "Message Sent",
        "Thank you for contacting us! We'll get back to you soon.",
        [
          {
            text: "OK",
            onPress: () => {
              setName("");
              setEmail("");
              setMessage("");
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <ArrowLeft size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <MessageCircle size={48} color="#FF6B6B" />
            <Text style={styles.introTitle}>Get in Touch</Text>
            <Text style={styles.introText}>
              Have a question, suggestion, or feedback? We'd love to hear from you!
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formField}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                editable={!isSubmitting}
                accessibilityLabel="Name input"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                accessibilityLabel="Email input"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us what's on your mind..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                editable={!isSubmitting}
                accessibilityLabel="Message input"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityLabel="Send message"
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.alternativeContact}>
            <Text style={styles.alternativeTitle}>Other Ways to Reach Us</Text>
            <View style={styles.contactMethod}>
              <Mail size={20} color="#FF6B6B" />
              <Text style={styles.contactText}>support@avisonews.com</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  placeholder: {
    width: 32,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  intro: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3C3C43",
    textAlign: "center",
  },
  form: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    padding: 20,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  alternativeContact: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    padding: 20,
    marginBottom: 20,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#FF6B6B",
    marginLeft: 12,
  },
});
