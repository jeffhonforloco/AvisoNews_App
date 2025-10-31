import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Zap, Plus, Play, Trash2, Edit, Clock, Filter } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function AutomationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const configsQuery = trpc.admin.automation.list.useQuery();
  const deleteMutation = trpc.admin.automation.delete.useMutation({
    onSuccess: () => {
      configsQuery.refetch();
      Alert.alert("Success", "Automation config deleted");
    },
  });

  const updateMutation = trpc.admin.automation.update.useMutation({
    onSuccess: () => {
      configsQuery.refetch();
      Alert.alert("Success", "Automation updated");
    },
  });

  const runMutation = trpc.admin.automation.run.useMutation({
    onSuccess: (data) => {
      configsQuery.refetch();
      Alert.alert("Success", `Fetched ${data.articlesFetched} articles`);
    },
  });

  const handleToggle = (id: string, enabled: boolean) => {
    updateMutation.mutate({ id, enabled: !enabled });
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Automation", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  };

  const handleRun = (id: string) => {
    runMutation.mutate({ id });
  };

  const configs = configsQuery.data || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Automation</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={configsQuery.isRefetching}
            onRefresh={() => configsQuery.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {configsQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading automations...</Text>
          </View>
        ) : configs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Zap size={48} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No automations configured</Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createButtonText}>Create Automation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          configs.map((config) => (
            <View key={config.id} style={[styles.configCard, { backgroundColor: colors.background.card }]}>
              <View style={styles.configHeader}>
                <View style={styles.configTitleRow}>
                  <View style={[styles.configIcon, { backgroundColor: `${colors.primary}20` }]}>
                    <Zap size={20} color={colors.primary} />
                  </View>
                  <View style={styles.configInfo}>
                    <Text style={[styles.configName, { color: colors.text.primary }]}>
                      {config.sourceId}
                    </Text>
                    <Text style={[styles.configStatus, { color: colors.text.secondary }]}>
                      {config.enabled ? "Active" : "Inactive"} • Every {config.fetchInterval} min
                    </Text>
                  </View>
                </View>
                <Switch
                  value={config.enabled}
                  onValueChange={() => handleToggle(config.id, config.enabled)}
                  trackColor={{ false: colors.border.primary, true: colors.primary }}
                />
              </View>

              <View style={styles.configDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Auto Publish:</Text>
                  <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                    {config.autoPublish ? "Yes" : "No"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Require Moderation:</Text>
                  <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                    {config.requireModeration ? "Yes" : "No"}
                  </Text>
                </View>
                {config.lastRun && (
                  <View style={styles.detailRow}>
                    <Clock size={14} color={colors.text.secondary} />
                    <Text style={[styles.detailValue, { color: colors.text.secondary }]}>
                      Last run: {new Date(config.lastRun).toLocaleString()}
                    </Text>
                  </View>
                )}
                {config.articlesFetched !== undefined && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Articles Fetched:</Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                      {config.articlesFetched}
                    </Text>
                  </View>
                )}
              </View>

              {config.filters && (
                <View style={styles.filtersSection}>
                  <Filter size={14} color={colors.text.secondary} />
                  <Text style={[styles.filtersText, { color: colors.text.secondary }]}>
                    Filters: {config.filters.categories?.length || 0} categories,{" "}
                    {config.filters.keywords?.length || 0} keywords
                  </Text>
                </View>
              )}

              <View style={styles.configActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.primary}20` }]}
                  onPress={() => handleRun(config.id)}
                >
                  <Play size={16} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>Run Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.text.secondary}20` }]}
                  onPress={() => {/* Edit config */}}
                >
                  <Edit size={16} color={colors.text.secondary} />
                  <Text style={[styles.actionText, { color: colors.text.secondary }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.status.error}20` }]}
                  onPress={() => handleDelete(config.id)}
                >
                  <Trash2 size={16} color={colors.status.error} />
                  <Text style={[styles.actionText, { color: colors.status.error }]}>Delete</Text>
                </TouchableOpacity>
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
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  configCard: {
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
  configHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  configTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  configIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  configInfo: {
    flex: 1,
  },
  configName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  configStatus: {
    fontSize: 12,
  },
  configDetails: {
    gap: 8,
    marginBottom: 12,
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
  filtersSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  filtersText: {
    fontSize: 12,
  },
  configActions: {
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

