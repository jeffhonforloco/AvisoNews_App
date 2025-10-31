import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNews } from "@/providers/NewsProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { 
  Globe, 
  Zap, 
  Clock, 
  ChevronRight,
  Bookmark,
  Share2,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  AlertCircle,
  Play,
  Mic,
  Video
} from "lucide-react-native";
import EnhancedAggregator from "@/components/EnhancedAggregator";
import { Article } from "@/types/news";
import { getNewBadgeLevel, formatTimeAgo, isNewArticle } from "@/utils/timeUtils";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { articles, isLoading, refetch, error } = useNews();
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const categories = useMemo(() => {
    const cats = ['all', 'breaking', 'world', 'politics', 'business', 'tech', 'science', 'health', 'sports', 'entertainment'];
    return cats;
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = [...articles];
    
    // Apply category filter
    if (selectedCategory === 'all') {
      // Keep all articles
    } else if (selectedCategory === 'breaking') {
      filtered = filtered.filter(a => a.breaking);
    } else {
      filtered = filtered.filter(a => a.category?.toLowerCase() === selectedCategory);
    }
    
    // Articles are already sorted by newest first from NewsProvider
    return filtered;
  }, [articles, selectedCategory]);

  const featuredArticle = useMemo(() => 
    filteredArticles.find(a => a.featured) || filteredArticles[0],
    [filteredArticles]
  );

  const breakingNews = useMemo(() => 
    articles.filter(a => a.breaking).slice(0, 5),
    [articles]
  );

  const topStories = useMemo(() => 
    filteredArticles
      .filter(a => a.id !== featuredArticle?.id)
      .slice(0, 6),
    [filteredArticles, featuredArticle]
  );

  const latestArticles = useMemo(() => 
    filteredArticles
      .filter(a => a.id !== featuredArticle?.id && !topStories.includes(a))
      .slice(0, 20),
    [filteredArticles, featuredArticle, topStories]
  );

  const handleArticlePress = useCallback((article: Article) => {
    router.push(`/article/${article.id}`);
  }, [router]);

  if (isLoading && articles.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Only show error if we have an error AND no articles AND not loading
  // Since we now always have fallback articles, this should rarely trigger
  if (error && articles.length === 0 && !isLoading) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background.primary }]}>
        <AlertCircle size={48} color={colors.text.secondary} />
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Unable to load news</Text>
        <Text style={[styles.errorSubtext, { color: colors.text.secondary }]}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]} 
          onPress={refetch}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Premium Header */}
        <View style={[styles.header, { backgroundColor: colors.background.card }]}>
          <View style={styles.headerTop}>
            <View style={styles.logoSection}>
              <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                <Globe size={20} color="white" />
              </View>
              <View>
                <Text style={[styles.brandName, { color: colors.text.primary }]}>AvisoNews</Text>
                <Text style={[styles.brandTagline, { color: colors.text.secondary }]}>Your Trusted News Source</Text>
              </View>
            </View>
            <View style={styles.headerMeta}>
              {!isAuthenticated ? (
                <TouchableOpacity 
                  style={[styles.signInButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/auth')}
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text.primary }]}>
                    {user?.name || 'User'}
                  </Text>
                  <Text style={[styles.userPlan, { color: colors.text.secondary }]}>
                    {user?.plan === 'premium' ? 'Premium' : 'Free'}
                  </Text>
                </View>
              )}
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={[styles.dateText, { color: colors.text.secondary }]}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }).toUpperCase()}
              </Text>
              {articles.length > 0 && (
                <Text style={[styles.updateIndicator, { color: colors.text.secondary }]}>
                  {isNewArticle(articles[0]) ? 'Updated just now' : 'Updated recently'}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Breaking News Ticker */}
        {breakingNews.length > 0 && (
          <View style={[styles.breakingTicker, { backgroundColor: colors.highlight || colors.status.breaking }]}>
            <View style={styles.breakingLabel}>
              <Zap size={14} color="white" fill="white" />
              <Text style={styles.breakingLabelText}>BREAKING</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.breakingScroll}
              contentContainerStyle={styles.breakingScrollContent}
            >
              {breakingNews.map((article, index) => (
                <TouchableOpacity
                  key={article.id}
                  onPress={() => handleArticlePress(article)}
                  activeOpacity={0.8}
                  style={styles.breakingItem}
                >
                  <Text style={styles.breakingText}>
                    {index > 0 && ' • '}{article.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={[styles.categoryNav, { backgroundColor: colors.background.card }]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive,
                selectedCategory === category && { backgroundColor: colors.text.primary }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryPillText,
                { color: selectedCategory === category ? colors.background.primary : colors.text.primary }
              ]}>
                {category.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Article */}
        {featuredArticle && (
          <TouchableOpacity
            style={styles.featuredContainer}
            onPress={() => handleArticlePress(featuredArticle)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: featuredArticle.imageUrl }}
              style={styles.featuredImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
              style={styles.featuredOverlay}
            >
              <View style={styles.featuredContent}>
                {featuredArticle.category && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>
                      {featuredArticle.category.toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.featuredTitle} numberOfLines={3}>
                  {featuredArticle.title}
                </Text>
                <Text style={styles.featuredSummary} numberOfLines={2}>
                  {featuredArticle.summary || featuredArticle.excerpt}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Top Stories Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>TOP STORIES</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.topStoriesGrid}>
            {topStories.map((article, index) => (
              <TouchableOpacity
                key={article.id}
                style={[
                  styles.topStoryCard,
                  { backgroundColor: colors.background.card },
                  index % 2 === 0 && { marginRight: 10 }
                ]}
                onPress={() => handleArticlePress(article)}
                activeOpacity={0.95}
              >
                <Image
                  source={{ uri: article.imageUrl }}
                  style={styles.topStoryImage}
                />
                <View style={styles.topStoryContent}>
                  <View style={styles.topStoryHeader}>
                    <Text style={[styles.topStoryCategory, { color: colors.primary }]}>
                      {article.category?.toUpperCase()}
                    </Text>
                    {getNewBadgeLevel(article) && (
                      <View style={[
                        styles.newBadgeSmall,
                        getNewBadgeLevel(article) === 'very-recent' && { backgroundColor: '#FF3B30' },
                        getNewBadgeLevel(article) === 'recent' && { backgroundColor: '#FF9500' },
                        getNewBadgeLevel(article) === 'today' && { backgroundColor: colors.primary },
                      ]}>
                        <Text style={styles.newBadgeTextSmall}>NEW</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.topStoryTitle, { color: colors.text.primary }]} numberOfLines={3}>
                    {article.title}
                  </Text>
                  <View style={styles.topStoryMeta}>
                    <Text style={[styles.topStorySource, { color: colors.text.secondary }]}>
                      {article.source}
                    </Text>
                    <Text style={[styles.topStoryTime, { color: colors.text.secondary }]}>
                      {formatTimeAgo(article.importedAt || article.publishedAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest News Stream */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Clock size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>LATEST NEWS</Text>
            </View>
          </View>

          {latestArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={[styles.streamCard, { backgroundColor: colors.background.card }]}
              onPress={() => handleArticlePress(article)}
              activeOpacity={0.95}
            >
              <Image
                source={{ uri: article.imageUrl }}
                style={styles.streamImage}
              />
              <View style={styles.streamContent}>
                  <View style={styles.streamHeader}>
                  <Text style={[styles.streamCategory, { color: colors.primary }]}>
                    {article.category?.toUpperCase()}
                  </Text>
                  {article.breaking && (
                    <View style={styles.breakingBadge}>
                      <Text style={styles.breakingBadgeText}>BREAKING</Text>
                    </View>
                  )}
                  {getNewBadgeLevel(article) && (
                    <View style={[
                      styles.newBadge,
                      getNewBadgeLevel(article) === 'very-recent' && { backgroundColor: '#FF3B30' },
                      getNewBadgeLevel(article) === 'recent' && { backgroundColor: '#FF9500' },
                      getNewBadgeLevel(article) === 'today' && { backgroundColor: colors.primary },
                    ]}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.streamTitle, { color: colors.text.primary }]} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={[styles.streamSummary, { color: colors.text.secondary }]} numberOfLines={2}>
                  {article.summary}
                </Text>
                
                {/* Enhanced Aggregator for Each Article */}
                <EnhancedAggregator article={article} compact={true} />
                
                <View style={styles.streamFooter}>
                  <View style={styles.streamMeta}>
                    <Text style={[styles.streamSource, { color: colors.text.secondary }]}>
                      {article.source}
                    </Text>
                    <Text style={[styles.streamDot, { color: colors.text.secondary }]}>•</Text>
                    <Text style={[styles.streamTime, { color: colors.text.secondary }]}>
                      {formatTimeAgo(article.importedAt || article.publishedAt)}
                    </Text>
                  </View>
                  <View style={styles.streamActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Bookmark size={18} color={colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Share2 size={18} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More */}
        <TouchableOpacity 
          style={[styles.loadMoreButton, { backgroundColor: colors.text.primary }]}
          onPress={() => console.log('Load more')}
        >
          <Text style={[styles.loadMoreText, { color: colors.background.primary }]}>
            LOAD MORE STORIES
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTop: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
    fontWeight: '500',
  },
  headerMeta: {
    alignItems: 'flex-end',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginRight: 6,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF3B30',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  breakingTicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  breakingScroll: {
    flex: 1,
  },
  breakingScrollContent: {
    alignItems: 'center',
    paddingLeft: 12,
  },
  breakingItem: {
    paddingRight: 8,
  },
  breakingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  breakingLabelText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  breakingContent: {
    flexDirection: 'row',
  },
  breakingText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryNav: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  categoryPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryPillActive: {
    borderWidth: 0,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredContainer: {
    height: 450,
    position: 'relative',
    marginBottom: 24,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 24,
  },
  featuredBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  featuredSummary: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },
  topStoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topStoryCard: {
    width: (width - 50) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  topStoryImage: {
    width: '100%',
    height: 110,
  },
  topStoryContent: {
    padding: 12,
  },
  topStoryCategory: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  topStoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 8,
  },
  topStoryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topStorySource: {
    fontSize: 11,
    fontWeight: '500',
  },
  topStoryTime: {
    fontSize: 11,
  },
  streamCard: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  streamImage: {
    width: 120,
    height: 140,
  },
  streamContent: {
    flex: 1,
    padding: 16,
  },
  streamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  streamCategory: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  breakingBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  breakingBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  streamTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  streamSummary: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  streamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  streamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streamSource: {
    fontSize: 11,
    fontWeight: '600',
  },
  streamDot: {
    marginHorizontal: 6,
    fontSize: 11,
  },
  streamTime: {
    fontSize: 11,
  },
  streamActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 12,
  },
  loadMoreButton: {
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userInfo: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
  },
  userPlan: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  newBadgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  newBadgeTextSmall: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  topStoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  updateIndicator: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
    fontStyle: 'italic',
  },
});