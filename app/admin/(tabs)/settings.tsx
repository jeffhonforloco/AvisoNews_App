import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, User, Bell, Shield, Database, LogOut } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import { useRouter } from "expo-router";

export default function AdminSettingsScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  const settingsItems = [
    {
      icon: User,
      title: "Profile Settings",
      subtitle: "Manage your admin profile",
      onPress: () => {},
    },
    {
      icon: Shield,
      title: "Permissions",
      subtitle: "View your permissions",
      onPress: () => {},
    },
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Configure notification preferences",
      onPress: () => {},
    },
    {
      icon: Database,
      title: "Platform Settings",
      subtitle: "Manage platform configuration",
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.userAvatar, { backgroundColor: `${colors.primary}20` }]}>
            <User size={32} color={colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text.primary }]}>{user?.name || "Admin"}</Text>
            <Text style={[styles.userEmail, { color: colors.text.secondary }]}>{user?.email}</Text>
            <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>
                {user?.role.replace("_", " ").toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Items */}
        <View style={styles.settingsSection}>
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.settingItem, { backgroundColor: colors.background.card }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <Icon size={20} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: colors.text.primary }]}>{item.title}</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.text.secondary }]}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Permissions List */}
        <View style={styles.permissionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Your Permissions</Text>
          <View style={[styles.permissionsCard, { backgroundColor: colors.background.card }]}>
            {user?.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionItem}>
                <Text style={[styles.permissionText, { color: colors.text.primary }]}>
                  {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.status.error }]}
          onPress={logout}
        >
          <LogOut size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  userCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 14,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  permissionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  permissionsCard: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  permissionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

