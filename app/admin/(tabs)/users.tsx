import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Users, Plus, Edit, Trash2, Shield, Mail, User } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { trpc } from "@/lib/trpc";

export default function UsersScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const usersQuery = trpc.admin.users.list.useQuery({ search: searchQuery || undefined });
  const deleteMutation = trpc.admin.users.delete.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      Alert.alert("Success", "User deleted");
    },
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert("Delete User", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };

  const users = usersQuery.data?.users || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return colors.status.error;
      case "admin":
        return colors.primary;
      case "editor":
        return colors.categories.entertainment;
      case "moderator":
        return colors.status.warning;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>User Management</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {/* Open create user modal */}}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.background.card }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search users..."
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={usersQuery.isRefetching}
            onRefresh={() => usersQuery.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {usersQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading users...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Users size={48} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No users found</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={[styles.userCard, { backgroundColor: colors.background.card }]}>
              <View style={styles.userHeader}>
                <View style={[styles.userAvatar, { backgroundColor: `${getRoleColor(user.role)}20` }]}>
                  <User size={24} color={getRoleColor(user.role)} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text.primary }]}>{user.name}</Text>
                  <View style={styles.userMeta}>
                    <Mail size={12} color={colors.text.secondary} />
                    <Text style={[styles.userEmail, { color: colors.text.secondary }]}>{user.email}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: `${getRoleColor(user.role)}20` },
                  ]}
                >
                  <Shield size={12} color={getRoleColor(user.role)} />
                  <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                    {user.role.replace("_", " ")}
                  </Text>
                </View>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Status:</Text>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: user.active ? colors.status.success : colors.status.error },
                    ]}
                  />
                  <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                    {user.active ? "Active" : "Inactive"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Permissions:</Text>
                  <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                    {user.permissions.length} permissions
                  </Text>
                </View>
                {user.lastLoginAt && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Last Login:</Text>
                    <Text style={[styles.detailValue, { color: colors.text.tertiary }]}>
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.text.secondary}20` }]}
                  onPress={() => {/* Edit user */}}
                >
                  <Edit size={16} color={colors.text.secondary} />
                  <Text style={[styles.actionText, { color: colors.text.secondary }]}>Edit</Text>
                </TouchableOpacity>
                {user.role !== "super_admin" && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: `${colors.status.error}20` }]}
                    onPress={() => handleDelete(user.id, user.name)}
                  >
                    <Trash2 size={16} color={colors.status.error} />
                    <Text style={[styles.actionText, { color: colors.status.error }]}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  userCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userEmail: {
    fontSize: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  userDetails: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  userActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

