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
import { BookOpen, Plus, CheckCircle, XCircle, Clock, Edit, Trash2 } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { trpc } from "@/lib/trpc";

export default function CurationScreen() {
  const { colors } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const submissionsQuery = trpc.admin.curation.list.useQuery({ status: selectedStatus });
  const reviewMutation = trpc.admin.curation.review.useMutation({
    onSuccess: () => {
      submissionsQuery.refetch();
      Alert.alert("Success", "Submission reviewed successfully");
    },
  });

  const deleteMutation = trpc.admin.curation.delete.useMutation({
    onSuccess: () => {
      submissionsQuery.refetch();
      Alert.alert("Success", "Submission deleted");
    },
  });

  const handleReview = (id: string, action: "approve" | "reject") => {
    reviewMutation.mutate({
      id,
      action,
      notes: action === "reject" ? "Reviewed by admin" : undefined,
    });
  };

  const submissions = submissionsQuery.data?.submissions || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Curated Articles</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {/* Open submission form */}}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterPill,
              selectedStatus === status && { backgroundColor: colors.primary },
              { borderColor: colors.border.primary },
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedStatus === status ? "white" : colors.text.primary },
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={submissionsQuery.isRefetching}
            onRefresh={() => submissionsQuery.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {submissionsQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading submissions...</Text>
          </View>
        ) : submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color={colors.text.tertiary} />
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No curated submissions</Text>
          </View>
        ) : (
          submissions.map((submission) => (
            <View
              key={submission.id}
              style={[styles.submissionCard, { backgroundColor: colors.background.card }]}
            >
              <View style={styles.submissionHeader}>
                <View style={[styles.statusBadge, {
                  backgroundColor:
                    submission.status === "approved"
                      ? `${colors.status.success}20`
                      : submission.status === "rejected"
                      ? `${colors.status.error}20`
                      : `${colors.status.warning}20`,
                }]}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          submission.status === "approved"
                            ? colors.status.success
                            : submission.status === "rejected"
                            ? colors.status.error
                            : colors.status.warning,
                      },
                    ]}
                  >
                    {submission.status}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Clock size={14} color={colors.text.secondary} />
                  <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.submissionTitle, { color: colors.text.primary }]} numberOfLines={2}>
                {submission.title}
              </Text>
              <Text style={[styles.submissionExcerpt, { color: colors.text.secondary }]} numberOfLines={2}>
                {submission.excerpt}
              </Text>

              <View style={styles.submissionMeta}>
                <Text style={[styles.categoryBadge, { color: colors.text.secondary }]}>
                  {submission.category}
                </Text>
                <Text style={[styles.submitterText, { color: colors.text.tertiary }]}>
                  By: {submission.submittedBy}
                </Text>
              </View>

              {submission.status === "pending" && (
                <View style={styles.submissionActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: `${colors.status.success}20` }]}
                    onPress={() => handleReview(submission.id, "approve")}
                  >
                    <CheckCircle size={18} color={colors.status.success} />
                    <Text style={[styles.actionText, { color: colors.status.success }]}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: `${colors.status.error}20` }]}
                    onPress={() => handleReview(submission.id, "reject")}
                  >
                    <XCircle size={18} color={colors.status.error} />
                    <Text style={[styles.actionText, { color: colors.status.error }]}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: `${colors.text.secondary}20` }]}
                    onPress={() => {/* Edit */}}
                  >
                    <Edit size={18} color={colors.text.secondary} />
                    <Text style={[styles.actionText, { color: colors.text.secondary }]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}

              {(submission.status === "approved" || submission.status === "rejected") && submission.reviewedBy && (
                <Text style={[styles.reviewedText, { color: colors.text.tertiary }]}>
                  Reviewed by {submission.reviewedBy} on {submission.reviewedAt ? new Date(submission.reviewedAt).toLocaleDateString() : ""}
                </Text>
              )}
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
  filters: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
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
  submissionCard: {
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
  submissionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  submissionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },
  submissionExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  submissionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  submitterText: {
    fontSize: 12,
  },
  submissionActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
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
    fontSize: 13,
    fontWeight: "600",
  },
  reviewedText: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: "italic",
  },
});

