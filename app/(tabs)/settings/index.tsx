import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Info,
  Mail,
  ChevronRight,
  LogOut,
  User,
  Crown,
  LogIn,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocalization } from "@/providers/LocalizationProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsScreen() {
  const { preferences, updatePreference } = usePreferences();
  const { colors } = useTheme();
  const { t, currentLanguage } = useLocalization();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  const settingsSections = [
    ...(isAuthenticated ? [{
      title: 'Account',
      items: [
        {
          icon: User,
          label: user?.name || 'Profile',
          type: "link" as const,
          value: user?.email,
          onPress: () => {
            // Navigate to profile
            console.log('Navigate to profile');
          },
        },
        {
          icon: Crown,
          label: 'Subscription',
          type: "link" as const,
          value: user?.plan === 'premium' ? 'Premium' : 'Free',
          onPress: () => router.push('/subscription'),
        },
      ],
    }] : []),
    {
      title: t('preferences'),
      items: [
        {
          icon: Bell,
          label: t('pushNotifications'),
          type: "switch" as const,
          key: "pushNotifications" as const,
          value: preferences.pushNotifications,
        },
        {
          icon: Mail,
          label: t('newsletter'),
          type: "switch" as const,
          key: "newsletter" as const,
          value: preferences.newsletter,
        },
        {
          icon: Moon,
          label: t('darkMode'),
          type: "switch" as const,
          key: "readingPreferences.theme" as const,
          value: preferences.readingPreferences.theme === 'dark',
        },
        {
          icon: Globe,
          label: t('language'),
          type: "link" as const,
          value: `${currentLanguage.flag} ${currentLanguage.nativeName}`,
          onPress: () => router.push('/language-selection'),
        },
      ],
    },
    {
      title: t('about'),
      items: [
        {
          icon: Info,
          label: t('aboutAvisoNews'),
          type: "link" as const,
          onPress: () => router.push('/about'),
        },
        {
          icon: Shield,
          label: t('privacyPolicy'),
          type: "link" as const,
          onPress: () => router.push('/privacy-policy'),
        },
        {
          icon: Mail,
          label: t('contactUs'),
          type: "link" as const,
          onPress: () => router.push('/contact'),
        },
      ],
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    if (key === 'readingPreferences.theme') {
      updatePreference('readingPreferences', {
        ...preferences.readingPreferences,
        theme: value ? 'dark' : 'light',
      });
    } else {
      updatePreference(key as keyof typeof preferences, value);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.secondary }]} showsVerticalScrollIndicator={false}>
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>{section.title}</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.background.card, borderColor: colors.border.primary }]}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    { borderBottomColor: colors.border.primary },
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  activeOpacity={item.type === "link" ? 0.7 : 1}
                  disabled={item.type === "switch"}
                  onPress={item.type === "link" ? item.onPress : undefined}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                      <Icon size={20} color="#FF6B6B" />
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.text.primary }]}>{item.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === "switch" ? (
                      <Switch
                        value={item.value}
                        onValueChange={(value) => handleToggle(item.key!, value)}
                        trackColor={{ false: colors.border.primary, true: colors.primary }}
                        thumbColor={colors.background.card}
                      />
                    ) : (
                      <View style={styles.linkRight}>
                        {'value' in item && item.value && (
                          <Text style={[styles.linkValue, { color: colors.text.secondary }]}>{item.value}</Text>
                        )}
                        <ChevronRight size={18} color={colors.text.tertiary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {isAuthenticated ? (
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.background.card, borderColor: colors.status.error }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.status.error} />
          <Text style={[styles.logoutText, { color: colors.status.error }]}>{t('signOut')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <LogIn size={20} color="#FFFFFF" />
          <Text style={styles.loginText}>Sign In / Sign Up</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.text.secondary }]}>{t('version')} 1.0.0</Text>
        <Text style={[styles.copyright, { color: colors.text.tertiary }]}>© 2025 AvisoNews</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginLeft: 20,
    marginBottom: 8,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkValue: {
    fontSize: 15,
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  version: {
    fontSize: 13,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
  },
});