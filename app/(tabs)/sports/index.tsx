import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Trophy, Star, Users, TrendingUp } from 'lucide-react-native';
import { useFollowing } from '@/providers/FollowingProvider';
import { useNews } from '@/providers/NewsProvider';
import { SportsTeam } from '@/types/news';

const mockSportsTeams: SportsTeam[] = [
  {
    id: '1',
    name: 'Los Angeles Lakers',
    sport: 'Basketball',
    league: 'NBA',
    city: 'Los Angeles',
    country: 'USA',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    followers: 15000000
  },
  {
    id: '2',
    name: 'Manchester United',
    sport: 'Football',
    league: 'Premier League',
    city: 'Manchester',
    country: 'England',
    logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
    followers: 75000000
  },
  {
    id: '3',
    name: 'Golden State Warriors',
    sport: 'Basketball',
    league: 'NBA',
    city: 'San Francisco',
    country: 'USA',
    logoUrl: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
    followers: 12000000
  },
  {
    id: '4',
    name: 'Real Madrid',
    sport: 'Football',
    league: 'La Liga',
    city: 'Madrid',
    country: 'Spain',
    logoUrl: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
    followers: 85000000
  }
];

const sportsCategories = [
  { id: 'all', name: 'All Sports', icon: Trophy },
  { id: 'football', name: 'Football', icon: Trophy },
  { id: 'basketball', name: 'Basketball', icon: Trophy },
  { id: 'baseball', name: 'Baseball', icon: Trophy },
  { id: 'soccer', name: 'Soccer', icon: Trophy },
];

export default function SportsScreen() {
  const { followedTeams, followTeam, unfollowTeam, isFollowingTeam } = useFollowing();
  const { articles } = useNews();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sportsArticles = articles.filter(article => 
    article.category === 'sports' || 
    article.tags?.some(tag => ['sports', 'nba', 'nfl', 'mlb', 'soccer'].includes(tag.toLowerCase()))
  );

  const filteredTeams = selectedCategory === 'all' 
    ? mockSportsTeams 
    : mockSportsTeams.filter(team => team.sport.toLowerCase() === selectedCategory);

  const handleFollowTeam = async (teamId: string) => {
    if (isFollowingTeam(teamId)) {
      await unfollowTeam(teamId);
    } else {
      await followTeam(teamId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{sportsArticles.length}</Text>
            <Text style={styles.statLabel}>Sports News</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{followedTeams.length}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trending</Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Sports Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {sportsCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.activeCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={20} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#666'} 
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.activeCategoryButtonText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Teams Section */}
        <View style={styles.teamsContainer}>
          <Text style={styles.sectionTitle}>Popular Teams</Text>
          <View style={styles.teamsGrid}>
            {filteredTeams.map((team) => (
              <View key={team.id} style={styles.teamCard}>
                <View style={styles.teamHeader}>
                  <View style={styles.teamInfo}>
                    <View style={styles.teamLogo}>
                      <Text style={styles.teamLogoText}>
                        {team.name.split(' ').map(word => word[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.teamDetails}>
                      <Text style={styles.teamName} numberOfLines={1}>
                        {team.name}
                      </Text>
                      <Text style={styles.teamLeague}>
                        {team.league} • {team.city}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      isFollowingTeam(team.id) && styles.followingButton,
                    ]}
                    onPress={() => handleFollowTeam(team.id)}
                  >
                    <Star 
                      size={16} 
                      color={isFollowingTeam(team.id) ? '#FFD700' : '#666'}
                      fill={isFollowingTeam(team.id) ? '#FFD700' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.teamStats}>
                  <View style={styles.teamStat}>
                    <Users size={14} color="#666" />
                    <Text style={styles.teamStatText}>
                      {(team.followers || 0) > 1000000 
                        ? `${Math.floor((team.followers || 0) / 1000000)}M` 
                        : `${Math.floor((team.followers || 0) / 1000)}K`} followers
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Latest Sports News */}
        <View style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>Latest Sports News</Text>
          {sportsArticles.slice(0, 5).map((article) => (
            <TouchableOpacity key={article.id} style={styles.newsCard}>
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle} numberOfLines={2}>
                  {article.titleAi || article.title}
                </Text>
                <Text style={styles.newsMeta}>
                  {article.sourceName} • {new Date(article.publishedAt).toLocaleDateString()}
                </Text>
                {article.tldr && (
                  <Text style={styles.newsTldr} numberOfLines={2}>
                    {article.tldr}
                  </Text>
                )}
              </View>
              {article.imageUrl && (
                <Image source={{ uri: article.imageUrl }} style={styles.newsImage} />
              )}
            </TouchableOpacity>
          ))}
          
          {sportsArticles.length === 0 && (
            <View style={styles.emptyState}>
              <Trophy size={48} color="#CCC" />
              <Text style={styles.emptyTitle}>No Sports News Available</Text>
              <Text style={styles.emptyDescription}>
                Sports articles will appear here when available.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B6B',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  teamsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  teamCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamLogoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  teamLeague: {
    fontSize: 12,
    color: '#666',
  },
  followButton: {
    padding: 8,
  },
  followingButton: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
  },
  teamStats: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  teamStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  newsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  newsContent: {
    flex: 1,
    marginRight: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  newsMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  newsTldr: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  newsImage: {
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
  },
});