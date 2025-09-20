import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Star, 
  Search, 
  Users, 
  CheckCircle, 
  Plus,
  Bell,
  Settings as SettingsIcon
} from 'lucide-react-native';
import { useFollowing } from '@/providers/FollowingProvider';
import { useNews } from '@/providers/NewsProvider';
import { Source, SportsTeam } from '@/types/news';

const mockAvailableSources: Source[] = [
  {
    id: '3',
    name: 'BBC News',
    feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
    homepageUrl: 'https://bbc.com/news',
    categorySlug: 'world',
    active: true,
    logoUrl: 'https://static.files.bbci.co.uk/ws/simorgh-assets/public/news/images/metadata/poster-1024x576.png',
    verified: true,
    isPremium: false,
    followers: 5000000
  },
  {
    id: '4',
    name: 'CNN',
    feedUrl: 'https://rss.cnn.com/rss/edition.rss',
    homepageUrl: 'https://cnn.com',
    categorySlug: 'world',
    active: true,
    logoUrl: 'https://cdn.cnn.com/cnn/.e/img/3.0/global/misc/cnn-logo.png',
    verified: true,
    isPremium: false,
    followers: 4200000
  }
];

const mockAvailableTeams: SportsTeam[] = [
  {
    id: '3',
    name: 'Boston Celtics',
    sport: 'Basketball',
    league: 'NBA',
    city: 'Boston',
    country: 'USA',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    followers: 8000000
  },
  {
    id: '4',
    name: 'Barcelona',
    sport: 'Football',
    league: 'La Liga',
    city: 'Barcelona',
    country: 'Spain',
    logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
    followers: 90000000
  }
];

export default function FollowingScreen() {
  const insets = useSafeAreaInsets();
  const { 
    followedSources, 
    followedTeams, 
    followSource, 
    unfollowSource, 
    followTeam, 
    unfollowTeam,
    isFollowingSource,
    isFollowingTeam 
  } = useFollowing();
  const { articles } = useNews();
  
  const [activeTab, setActiveTab] = useState<'feed' | 'sources' | 'teams'>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const followedArticles = articles.filter(article => 
    followedSources.some(source => source.id === article.sourceId) ||
    (article.tags && followedTeams.some(team => 
      article.tags?.some(tag => tag.toLowerCase().includes(team.name.toLowerCase()))
    ))
  );

  const filteredSources = mockAvailableSources.filter(source =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = mockAvailableTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowSource = async (sourceId: string) => {
    if (isFollowingSource(sourceId)) {
      await unfollowSource(sourceId);
    } else {
      await followSource(sourceId);
    }
  };

  const handleFollowTeam = async (teamId: string) => {
    if (isFollowingTeam(teamId)) {
      await unfollowTeam(teamId);
    } else {
      await followTeam(teamId);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Following</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <SettingsIcon size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followedSources.length}</Text>
          <Text style={styles.statLabel}>Sources</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followedTeams.length}</Text>
          <Text style={styles.statLabel}>Teams</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followedArticles.length}</Text>
          <Text style={styles.statLabel}>Updates</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'feed', label: 'Feed', icon: Bell },
          { key: 'sources', label: 'Sources', icon: Users },
          { key: 'teams', label: 'Teams', icon: Star },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabButton,
              activeTab === tab.key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <tab.icon 
              size={20} 
              color={activeTab === tab.key ? '#FF6B6B' : '#666'} 
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.key && styles.activeTabButtonText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'feed' && (
          <View style={styles.feedContainer}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            {followedArticles.length > 0 ? (
              followedArticles.slice(0, 10).map((article) => (
                <TouchableOpacity key={article.id} style={styles.articleCard}>
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.titleAi || article.title}
                    </Text>
                    <Text style={styles.articleMeta}>
                      {article.sourceName} • {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                    {article.tldr && (
                      <Text style={styles.articleTldr} numberOfLines={2}>
                        {article.tldr}
                      </Text>
                    )}
                  </View>
                  {article.imageUrl && (
                    <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Bell size={48} color="#CCC" />
                <Text style={styles.emptyTitle}>No Updates Yet</Text>
                <Text style={styles.emptyDescription}>
                  Follow sources and teams to see their latest updates here.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'sources' && (
          <View style={styles.sourcesContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search news sources..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <Text style={styles.sectionTitle}>Following ({followedSources.length})</Text>
            {followedSources.map((source) => (
              <View key={source.id} style={styles.sourceCard}>
                <View style={styles.sourceInfo}>
                  <View style={styles.sourceLogo}>
                    <Text style={styles.sourceLogoText}>
                      {source.name.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.sourceDetails}>
                    <View style={styles.sourceNameContainer}>
                      <Text style={styles.sourceName}>{source.name}</Text>
                      {source.verified && (
                        <CheckCircle size={16} color="#4CAF50" />
                      )}
                    </View>
                    <Text style={styles.sourceCategory}>{source.categorySlug}</Text>
                    <Text style={styles.sourceFollowers}>
                      {(source.followers || 0) > 1000000 
                        ? `${Math.floor((source.followers || 0) / 1000000)}M` 
                        : `${Math.floor((source.followers || 0) / 1000)}K`} followers
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unfollowButton}
                  onPress={() => handleFollowSource(source.id)}
                >
                  <Text style={styles.unfollowButtonText}>Following</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Discover Sources</Text>
            {filteredSources.map((source) => (
              <View key={source.id} style={styles.sourceCard}>
                <View style={styles.sourceInfo}>
                  <View style={styles.sourceLogo}>
                    <Text style={styles.sourceLogoText}>
                      {source.name.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.sourceDetails}>
                    <View style={styles.sourceNameContainer}>
                      <Text style={styles.sourceName}>{source.name}</Text>
                      {source.verified && (
                        <CheckCircle size={16} color="#4CAF50" />
                      )}
                    </View>
                    <Text style={styles.sourceCategory}>{source.categorySlug}</Text>
                    <Text style={styles.sourceFollowers}>
                      {(source.followers || 0) > 1000000 
                        ? `${Math.floor((source.followers || 0) / 1000000)}M` 
                        : `${Math.floor((source.followers || 0) / 1000)}K`} followers
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollowSource(source.id)}
                >
                  <Plus size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'teams' && (
          <View style={styles.teamsContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search sports teams..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <Text style={styles.sectionTitle}>Following ({followedTeams.length})</Text>
            {followedTeams.map((team) => (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {team.name.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.teamDetails}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamLeague}>{team.league} • {team.city}</Text>
                    <Text style={styles.teamFollowers}>
                      {(team.followers || 0) > 1000000 
                        ? `${Math.floor((team.followers || 0) / 1000000)}M` 
                        : `${Math.floor((team.followers || 0) / 1000)}K`} followers
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unfollowButton}
                  onPress={() => handleFollowTeam(team.id)}
                >
                  <Text style={styles.unfollowButtonText}>Following</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Discover Teams</Text>
            {filteredTeams.map((team) => (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamInfo}>
                  <View style={styles.teamLogo}>
                    <Text style={styles.teamLogoText}>
                      {team.name.split(' ').map(word => word[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.teamDetails}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamLeague}>{team.league} • {team.city}</Text>
                    <Text style={styles.teamFollowers}>
                      {(team.followers || 0) > 1000000 
                        ? `${Math.floor((team.followers || 0) / 1000000)}M` 
                        : `${Math.floor((team.followers || 0) / 1000)}K`} followers
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollowTeam(team.id)}
                >
                  <Plus size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#FFF5F5',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
  },
  feedContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  articleContent: {
    flex: 1,
    marginRight: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  articleMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  articleTldr: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  sourcesContainer: {
    padding: 20,
  },
  teamsContainer: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sourceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sourceLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sourceDetails: {
    flex: 1,
  },
  sourceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  sourceCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  sourceFollowers: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  unfollowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  unfollowButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teamLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  teamLeague: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  teamFollowers: {
    fontSize: 12,
    color: '#666',
  },
});