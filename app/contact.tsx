import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { ArrowLeft, Mail, MessageCircle, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useLocalization } from '@/providers/LocalizationProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us! We\'ll get back to you within 24 hours.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      value: 'hello@avisonews.com',
      action: () => {}
    },
    {
      icon: MessageCircle,
      title: 'Feedback',
      description: 'Share your thoughts and suggestions',
      value: 'We value your input',
      action: () => {}
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, borderBottomColor: colors.border.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {t('contactUs')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: colors.text.primary }]}>
            Get in Touch
          </Text>
          <Text style={[styles.introText, { color: colors.text.secondary }]}>
            Have a question, suggestion, or feedback? We&apos;d love to hear from you. 
            Our team is here to help and typically responds within 24 hours.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.methodsSection}>
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <View key={index} style={[styles.methodItem, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
                <View style={[styles.methodIcon, { backgroundColor: colors.background.secondary }]}>
                  <Icon size={24} color={colors.primary} />
                </View>
                <View style={styles.methodContent}>
                  <Text style={[styles.methodTitle, { color: colors.text.primary }]}>
                    {method.title}
                  </Text>
                  <Text style={[styles.methodDescription, { color: colors.text.secondary }]}>
                    {method.description}
                  </Text>
                  <Text style={[styles.methodValue, { color: colors.primary }]}>
                    {method.value}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: colors.text.primary }]}>
            Send us a Message
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background.card, borderColor: colors.border.primary, color: colors.text.primary }]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Your full name"
                placeholderTextColor={colors.text.tertiary}
                testID="name-input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Email *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background.card, borderColor: colors.border.primary, color: colors.text.primary }]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                testID="email-input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Subject</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background.card, borderColor: colors.border.primary, color: colors.text.primary }]}
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
                placeholder="What's this about?"
                placeholderTextColor={colors.text.tertiary}
                testID="subject-input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.secondary }]}>Message *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.background.card, borderColor: colors.border.primary, color: colors.text.primary }]}
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
                placeholder="Tell us more about your question or feedback..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                testID="message-input"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary, opacity: isSubmitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              testID="submit-button"
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
            We typically respond within 24 hours
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  introSection: {
    padding: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
  },
  methodsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  methodValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
  },
});