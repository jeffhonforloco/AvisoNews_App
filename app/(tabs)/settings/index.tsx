import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
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
  LucideIcon,
  Sparkles,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import * as Haptics from "expo-haptics";

type SwitchItem = {
  icon: LucideIcon;
  label: string;
  description?: string;
  type: "switch";
  key: string;
  value: boolean;
  color: string;
};

type LinkItem = {
  icon: LucideIcon;
  label: string;
  description?: string;
  type: "link";
  value?: string;
  route?: string;
  color: string;
};

type SettingItem = SwitchItem | LinkItem;

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { user, isAuthenticated, signOut } = useAuth();

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Get notified about breaking news",
          type: "switch" as const,
          key: "pushNotifications",
          value: preferences.pushNotifications,
          color: "#FF3B30",
        },
        {
          icon: Mail,
          label: "Newsletter",
          description: "Daily digest in your inbox",
          type: "switch" as const,
          key: "newsletter",
          value: preferences.newsletter,
          color: "#007AFF",
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Reduce eye strain at night",
          type: "switch" as const,
          key: "darkMode",
          value: preferences.darkMode,
          color: "#5856D6",
        },
        {
          icon: Globe,
          label: "Language",
          type: "link" as const,
          value: "English",
          color: "#34C759",
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: Info,
          label: "About AvisoNews",
          type: "link" as const,
          route: "/(tabs)/settings/about",
          color: "#FF9500",
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          type: "link" as const,
          route: "/(tabs)/settings/privacy",
          color: "#00C7BE",
        },
        {
          icon: Mail,
          label: "Contact Us",
          type: "link" as const,
          route: "/(tabs)/settings/contact",
          color: "#FF2D55",
        },
      ],
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updatePreference(key as keyof typeof preferences, value);
  };

  const handleLinkPress = (item: LinkItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace('/auth/sign-in');
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textTertiary }]}>
          Customize your experience
        </Text>
      </View>

      {isAuthenticated && user && (
        <View style={styles.section}>
          <View style={[styles.accountCard, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary + "20" }]}>
              <User size={28} color={theme.primary} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.accountEmail, { color: theme.textTertiary }]}>{user.email}</Text>
            </View>
            <View style={[styles.proBadge, { backgroundColor: theme.primary }]}>
              <Sparkles size={12} color="#FFFFFF" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
        </View>
      )}

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>{section.title}</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isLast = itemIndex === section.items.length - 1;
              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border },
                  ]}
                  activeOpacity={item.type === "link" ? 0.7 : 1}
                  disabled={item.type === "switch"}
                  onPress={() => item.type === "link" && handleLinkPress(item)}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
                      <Icon size={20} color={item.color} />
                    </View>
                    <View style={styles.labelContainer}>
                      <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
                      {item.description && (
                        <Text style={[styles.settingDescription, { color: theme.textTertiary }]}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === "switch" ? (
                      <Switch
                        value={item.value}
                        onValueChange={(value) => handleToggle(item.key, value)}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor={theme.border}
                      />
                    ) : (
                      <View style={styles.linkRight}>
                        {item.value && (
                          <Text style={[styles.linkValue, { color: theme.textTertiary }]}>{item.value}</Text>
                        )}
                        <ChevronRight size={18} color={theme.textQuaternary} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={[styles.signOutButton, { borderColor: theme.error }]} 
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <LogOut size={20} color={theme.error} />
        <Text style={[styles.signOutText, { color: theme.error }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={[styles.footerDivider, { backgroundColor: theme.border }]} />
        <Text style={[styles.version, { color: theme.textTertiary }]}>Version 1.0.0</Text>
        <Text style={[styles.copyright, { color: theme.textQuaternary }]}>© 2025 AvisoNews</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  accountInfo: {
    flex: 1,
    marginLeft: 14,
  },
  accountName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: 14,
    fontWeight: "500",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  labelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
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
    marginRight: 6,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerDivider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  version: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    fontWeight: "500",
  },
});
