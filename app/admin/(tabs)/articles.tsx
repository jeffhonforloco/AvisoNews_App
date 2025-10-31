import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
} from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { trpc } from "@/lib/trpc";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AdminArticlesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "published" | "draft" | "pending" | "flagged">(
    (params.status as any) || "all"
  );

  const articlesQuery = trpc.admin.articles.list.useQuery({
    status: selectedStatus,
    search: searchQuery || undefined,
    limit: 50,
  });

  const deleteMutation = trpc.admin.articles.delete.useMutation({
    onSuccess: () => {
      articlesQuery.refetch();
      Alert.alert("Success", "Article deleted successfully");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const moderateMutation = trpc.admin.articles.moderate.useMutation({
    onSuccess: () => {
      articlesQuery.refetch();
      Alert.alert("Success", "Article moderated successfully");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleModerate = (articleId: string, action: "approved" | "rejected") => {
    moderateMutation.mutate({
      articleId,
      status: action,
    });
  };

  const handleDelete = (articleId: string) => {
    Alert.alert("Delete Article", "Are you sure you want to delete this article?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id: articleId }),
      },
    ]);
  };

  const articles = articlesQuery.data?.articles || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Articles Management</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/admin/(tabs)/curation")}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={[styles.searchBar, { backgroundColor: colors.background.card }]}>
        <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search articles..."
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        {(["all", "published", "draft", "pending", "flagged"] as const).map((status) => (
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

      {/* Articles List */}
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={articlesQuery.isRefetching}
            onRefresh={() => articlesQuery.refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {articlesQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading articles...</Text>
          </View>
        ) : articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No articles found</Text>
          </View>
        ) : (
          articles.map((article) => (
            <View
              key={article.id}
              style={[styles.articleCard, { backgroundColor: colors.background.card }]}
            >
              <View style={styles.articleHeader}>
                <View style={styles.articleInfo}>
                  <Text style={[styles.articleTitle, { color: colors.text.primary }]} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Text style={[styles.articleMetaText, { color: colors.text.secondary }]}>
                      {article.category} • {article.sourceName}
                    </Text>
                    <Text style={[styles.articleMetaText, { color: colors.text.tertiary }]}>
                      {article.viewCount} views
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${colors.primary}20` }]}>
                  <Text style={[styles.statusText, { color: colors.primary }]}>{article.status}</Text>
                </View>
              </View>

              {article.moderation && (
                <View
                  style={[
                    styles.moderationBadge,
                    {
                      backgroundColor:
                        article.moderation.status === "approved"
                          ? `${colors.status.success}20`
                          : article.moderation.status === "rejected"
                          ? `${colors.status.error}20`
                          : `${colors.status.warning}20`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.moderationText,
                      {
                        color:
                          article.moderation.status === "approved"
                            ? colors.status.success
                            : article.moderation.status === "rejected"
                            ? colors.status.error
                            : colors.status.warning,
                      },
                    ]}
                  >
                    {article.moderation.status}
                  </Text>
                </View>
              )}

              <View style={styles.articleActions}>
                {article.status === "draft" && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: `${colors.status.success}20` }]}
                    onPress={() => handleModerate(article.id, "approved")}
                  >
                    <CheckCircle size={18} color={colors.status.success} />
                    <Text style={[styles.actionText, { color: colors.status.success }]}>Approve</Text>
                  </TouchableOpacity>
                )}
                {article.moderation?.status === "pending" && (
                  <>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: `${colors.status.success}20` }]}
                      onPress={() => handleModerate(article.id, "approved")}
                    >
                      <CheckCircle size={18} color={colors.status.success} />
                      <Text style={[styles.actionText, { color: colors.status.success }]}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: `${colors.status.error}20` }]}
                      onPress={() => handleModerate(article.id, "rejected")}
                    >
                      <XCircle size={18} color={colors.status.error} />
                      <Text style={[styles.actionText, { color: colors.status.error }]}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.text.secondary}20` }]}
                  onPress={() => router.push(`/article/${article.id}`)}
                >
                  <Edit size={18} color={colors.text.secondary} />
                  <Text style={[styles.actionText, { color: colors.text.secondary }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: `${colors.status.error}20` }]}
                  onPress={() => handleDelete(article.id)}
                >
                  <Trash2 size={18} color={colors.status.error} />
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
  },
  emptyText: {
    fontSize: 16,
  },
  articleCard: {
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
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 22,
  },
  articleMeta: {
    flexDirection: "row",
    gap: 12,
  },
  articleMetaText: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  moderationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  moderationText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  articleActions: {
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
});

