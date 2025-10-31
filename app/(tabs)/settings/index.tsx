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
} from "lucide-react-native";
import { usePreferences } from "@/providers/PreferencesProvider";

export default function SettingsScreen() {
  const { preferences, updatePreference } = usePreferences();

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          type: "switch",
          key: "pushNotifications",
          value: preferences.pushNotifications,
        },
        {
          icon: Mail,
          label: "Newsletter",
          type: "switch",
          key: "newsletter",
          value: preferences.newsletter,
        },
        {
          icon: Moon,
          label: "Dark Mode",
          type: "switch",
          key: "darkMode",
          value: preferences.darkMode,
        },
        {
          icon: Globe,
          label: "Language",
          type: "link",
          value: "English",
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: Info,
          label: "About AvisoNews",
          type: "link",
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          type: "link",
        },
        {
          icon: Mail,
          label: "Contact Us",
          type: "link",
        },
      ],
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    updatePreference(key as keyof typeof preferences, value);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  activeOpacity={item.type === "link" ? 0.7 : 1}
                  disabled={item.type === "switch"}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconContainer}>
                      <Icon size={20} color="#FF6B6B" />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === "switch" ? (
                      <Switch
                        value={item.value}
                        onValueChange={(value) => handleToggle(item.key!, value)}
                        trackColor={{ false: "#E5E5EA", true: "#FF6B6B" }}
                        thumbColor="#FFFFFF"
                      />
                    ) : (
                      <View style={styles.linkRight}>
                        {item.value && (
                          <Text style={styles.linkValue}>{item.value}</Text>
                        )}
                        <ChevronRight size={18} color="#C7C7CC" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2025 AvisoNews</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5EA",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
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
    color: "#1C1C1E",
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
    color: "#8E8E93",
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  version: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: "#C7C7CC",
  },
});