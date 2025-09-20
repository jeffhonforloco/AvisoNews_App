import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserPreferences, SportsTeam, Source } from '@/types/news';
import { usePreferences } from './PreferencesProvider';

export const [FollowingProvider, useFollowing] = createContextHook(() => {
  const { preferences, updatePreferences } = usePreferences();
  const [followedSources, setFollowedSources] = useState<Source[]>([]);
  const [followedTeams, setFollowedTeams] = useState<SportsTeam[]>([]);
  const queryClient = useQueryClient();

  const sourcesQuery = useQuery({
    queryKey: ['followed-sources', preferences?.followedSources],
    queryFn: async () => {
      if (!preferences?.followedSources?.length) return [];
      // Mock API call - replace with actual API
      return mockFollowedSources.filter(source => 
        preferences.followedSources.includes(source.id)
      );
    },
    enabled: !!preferences?.followedSources?.length
  });

  const teamsQuery = useQuery({
    queryKey: ['followed-teams', preferences?.followedTeams],
    queryFn: async () => {
      if (!preferences?.followedTeams?.length) return [];
      // Mock API call - replace with actual API
      return mockSportsTeams.filter(team => 
        preferences.followedTeams.includes(team.id)
      );
    },
    enabled: !!preferences?.followedTeams?.length
  });

  useEffect(() => {
    if (sourcesQuery.data) {
      setFollowedSources(sourcesQuery.data);
    }
  }, [sourcesQuery.data]);

  useEffect(() => {
    if (teamsQuery.data) {
      setFollowedTeams(teamsQuery.data);
    }
  }, [teamsQuery.data]);

  const followSource = useCallback(async (sourceId: string) => {
    if (!preferences) return;
    
    const updatedSources = [...(preferences.followedSources || []), sourceId];
    await updatePreferences({
      ...preferences,
      followedSources: updatedSources
    });
    queryClient.invalidateQueries({ queryKey: ['followed-sources'] });
  }, [preferences, updatePreferences, queryClient]);

  const unfollowSource = useCallback(async (sourceId: string) => {
    if (!preferences) return;
    
    const updatedSources = (preferences.followedSources || []).filter(id => id !== sourceId);
    await updatePreferences({
      ...preferences,
      followedSources: updatedSources
    });
    queryClient.invalidateQueries({ queryKey: ['followed-sources'] });
  }, [preferences, updatePreferences, queryClient]);

  const followTeam = useCallback(async (teamId: string) => {
    if (!preferences) return;
    
    const updatedTeams = [...(preferences.followedTeams || []), teamId];
    await updatePreferences({
      ...preferences,
      followedTeams: updatedTeams
    });
    queryClient.invalidateQueries({ queryKey: ['followed-teams'] });
  }, [preferences, updatePreferences, queryClient]);

  const unfollowTeam = useCallback(async (teamId: string) => {
    if (!preferences) return;
    
    const updatedTeams = (preferences.followedTeams || []).filter(id => id !== teamId);
    await updatePreferences({
      ...preferences,
      followedTeams: updatedTeams
    });
    queryClient.invalidateQueries({ queryKey: ['followed-teams'] });
  }, [preferences, updatePreferences, queryClient]);

  const isFollowingSource = useCallback((sourceId: string) => {
    return preferences?.followedSources?.includes(sourceId) || false;
  }, [preferences?.followedSources]);

  const isFollowingTeam = useCallback((teamId: string) => {
    return preferences?.followedTeams?.includes(teamId) || false;
  }, [preferences?.followedTeams]);

  const contextValue = useMemo(() => ({
    followedSources,
    followedTeams,
    followSource,
    unfollowSource,
    followTeam,
    unfollowTeam,
    isFollowingSource,
    isFollowingTeam,
    isLoading: sourcesQuery.isLoading || teamsQuery.isLoading
  }), [
    followedSources,
    followedTeams,
    followSource,
    unfollowSource,
    followTeam,
    unfollowTeam,
    isFollowingSource,
    isFollowingTeam,
    sourcesQuery.isLoading,
    teamsQuery.isLoading
  ]);

  return contextValue;
});

// Mock data - replace with actual API calls
const mockFollowedSources: Source[] = [
  {
    id: '1',
    name: 'TechCrunch',
    feedUrl: 'https://techcrunch.com/feed/',
    homepageUrl: 'https://techcrunch.com',
    categorySlug: 'tech',
    active: true,
    logoUrl: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
    verified: true,
    isPremium: false,
    followers: 2500000
  },
  {
    id: '2',
    name: 'The Verge',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    homepageUrl: 'https://www.theverge.com',
    categorySlug: 'tech',
    active: true,
    logoUrl: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png',
    verified: true,
    isPremium: false,
    followers: 1800000
  }
];

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
  }
];