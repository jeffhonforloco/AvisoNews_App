import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

interface AuthPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({ visible, onClose }: AuthPromptModalProps) {
  const { colors } = useTheme();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'prompt' | 'signin' | 'signup'>('prompt');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      onClose();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const success = await register(email, password, name);
    setLoading(false);
    
    if (success) {
      onClose();
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const renderPrompt = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
          <Lock size={32} color={colors.primary} />
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Sign Up to Continue Reading
      </Text>
      
      <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
        You've reached your free reading limit. Create a free account to get unlimited access to all articles and exclusive features.
      </Text>
      
      <View style={styles.benefits}>
        {[
          'Unlimited article access',
          'Personalized news feed',
          'Save articles for later',
          'Follow your favorite topics',
        ].map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
            <Text style={[styles.benefitText, { color: colors.text.primary }]}>
              {benefit}
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          setMode('signup');
          resetForm();
        }}
      >
        <Text style={styles.primaryButtonText}>Create Free Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: colors.border.primary }]}
        onPress={() => {
          setMode('signin');
          resetForm();
        }}
      >
        <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.laterButton}
        onPress={onClose}
      >
        <Text style={[styles.laterButtonText, { color: colors.text.secondary }]}>
          Maybe later
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAuth = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.content}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.authTitle, { color: colors.text.primary }]}>
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </Text>
        
        <Text style={[styles.authSubtitle, { color: colors.text.secondary }]}>
          {mode === 'signin' 
            ? 'Sign in to continue reading' 
            : 'Join millions of readers worldwide'}
        </Text>
        
        {mode === 'signup' && (
          <View style={styles.inputContainer}>
            <User size={20} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text.primary, borderColor: colors.border.primary }]}
              placeholder="Full Name"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.primary }]}
            placeholder="Email"
            placeholderTextColor={colors.text.secondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.text.secondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.border.primary }]}
            placeholder="Password"
            placeholderTextColor={colors.text.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        {error ? (
          <Text style={[styles.errorText, { color: colors.status.error }]}>{error}</Text>
        ) : null}
        
        <TouchableOpacity
          style={[styles.authButton, { backgroundColor: colors.primary }]}
          onPress={mode === 'signin' ? handleSignIn : handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.authButtonText}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
              <ArrowRight size={20} color="#fff" style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            resetForm();
          }}
        >
          <Text style={[styles.switchModeText, { color: colors.text.secondary }]}>
            {mode === 'signin' 
              ? "Don't have an account? " 
              : 'Already have an account? '}
            <Text style={{ color: colors.primary }}>
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setMode('prompt')}
        >
          <Text style={[styles.backButtonText, { color: colors.text.secondary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modal, { backgroundColor: colors.background.card }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          {mode === 'prompt' ? renderPrompt() : renderAuth()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  content: {
    paddingTop: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  benefits: {
    marginBottom: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 15,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  laterButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 14,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  authButton: {
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  switchMode: {
    alignItems: 'center',
    marginBottom: 16,
  },
  switchModeText: {
    fontSize: 14,
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
});