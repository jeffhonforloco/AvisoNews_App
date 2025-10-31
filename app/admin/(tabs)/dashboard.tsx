import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  Zap,
  BookOpen,
  ChevronRight,
  Activity,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/providers/ThemeProvider";
import { useAdminAuth } from "@/providers/AdminAuthProvider";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function AdminDashboardScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const statsQuery = trpc.admin.dashboard.stats.useQuery();
  const activityQuery = trpc.admin.dashboard.activityLogs.useQuery({ limit: 5 });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([statsQuery.refetch(), activityQuery.refetch()]);
    setRefreshing(false);
  }, [statsQuery, activityQuery]);

  const stats = statsQuery.data;
  const activity = activityQuery.data?.logs || [];

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    onPress,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.background.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background.card }]}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Admin Dashboard</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Welcome back, {user?.name || "Admin"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.status.error + "20" }]}
            onPress={logout}
          >
            <Text style={[styles.logoutText, { color: colors.status.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {statsQuery.isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading dashboard...</Text>
          </View>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard
                icon={FileText}
                label="Total Articles"
                value={stats.totalArticles}
                color={colors.primary}
                onPress={() => router.push("/admin/(tabs)/articles")}
              />
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats.totalUsers}
                color={colors.categories.business}
                onPress={() => router.push("/admin/(tabs)/users")}
              />
              <StatCard
                icon={TrendingUp}
                label="Today's Articles"
                value={stats.todayArticles}
                color={colors.highlight}
              />
              <StatCard
                icon={AlertCircle}
                label="Pending Moderation"
                value={stats.pendingModeration}
                color={colors.status.warning}
                onPress={() => router.push("/admin/(tabs)/articles?status=pending")}
              />
              <StatCard
                icon={Zap}
                label="Automated"
                value={stats.automatedArticles}
                color={colors.categories.tech}
                onPress={() => router.push("/admin/(tabs)/automation")}
              />
              <StatCard
                icon={BookOpen}
                label="Curated"
                value={stats.curatedArticles}
                color={colors.categories.entertainment}
                onPress={() => router.push("/admin/(tabs)/curation")}
              />
            </View>

            {/* Trust Score */}
            <View style={[styles.trustCard, { backgroundColor: colors.background.card }]}>
              <View style={styles.trustHeader}>
                <BarChart3 size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Average Trust Score</Text>
              </View>
              <Text style={[styles.trustValue, { color: colors.primary }]}>{stats.avgTrustScore}%</Text>
            </View>

            {/* Categories Distribution */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Articles by Category</Text>
              <View style={[styles.categoryCard, { backgroundColor: colors.background.card }]}>
                {Object.entries(stats.articlesByCategory || {}).map(([category, count]) => (
                  <View key={category} style={styles.categoryRow}>
                    <Text style={[styles.categoryName, { color: colors.text.primary }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                    <View style={styles.categoryBar}>
                      <View
                        style={[
                          styles.categoryBarFill,
                          {
                            width: `${(count / stats.totalArticles) * 100}%`,
                            backgroundColor: colors.categories[category as keyof typeof colors.categories] || colors.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.categoryCount, { color: colors.text.secondary }]}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push("/admin/(tabs)/articles")}>
                  <ChevronRight size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <View style={[styles.activityCard, { backgroundColor: colors.background.card }]}>
                {activity.length === 0 ? (
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>No recent activity</Text>
                ) : (
                  activity.map((log) => (
                    <View key={log.id} style={styles.activityItem}>
                      <View style={[styles.activityIcon, { backgroundColor: `${colors.primary}20` }]}>
                        <Activity size={16} color={colors.primary} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={[styles.activityText, { color: colors.text.primary }]}>
                          {log.userName} {log.action.replace(/_/g, " ")}
                        </Text>
                        <Text style={[styles.activityTime, { color: colors.text.tertiary }]}>
                          {new Date(log.timestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.text.secondary }]}>
              {statsQuery.error?.message || "Failed to load dashboard"}
            </Text>
          </View>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  trustCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trustHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  trustValue: {
    fontSize: 48,
    fontWeight: "800",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  categoryName: {
    width: 100,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  categoryCount: {
    width: 40,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
  },
  activityCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 14,
  },
});

