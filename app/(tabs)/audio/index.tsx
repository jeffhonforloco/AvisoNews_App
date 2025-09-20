import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, SkipForward, SkipBack, Download, Volume2, VolumeX } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useSubscriptionFeatures } from '@/providers/SubscriptionProvider';
import { useNews } from '@/providers/NewsProvider';
import { Article } from '@/types/news';

export default function AudioScreen() {
  // Temporarily allow all users to access audio features
  const { isPremium } = useSubscriptionFeatures();
  const { articles } = useNews();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const audioArticles = articles.filter(article => article.audioUrl);

  useEffect(() => {
    // Setup audio mode for iOS
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (Platform.OS === 'web' && speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [sound]);

  const generateAndPlayAudio = async (article: Article, index?: number) => {
    try {
      setIsGeneratingAudio(article.id);
      
      // Stop any existing audio
      await stopCurrentAudio();
      
      // Set the current article
      setCurrentArticle(article);
      if (index !== undefined) {
        setCurrentArticleIndex(index);
      }
      
      // Use the article's content for TTS
      const textToSpeak = `${article.titleAi || article.title}. ${article.tldr || article.summary || article.excerpt}`;
      
      if (Platform.OS === 'web') {
        // Use Web Speech API for web platform
        await playWebSpeech(textToSpeak);
      } else if (article.audioUrl) {
        // Use existing audio URL if available
        await playExistingAudio(article);
      } else {
        // For mobile without audio URL, use expo-av TTS
        await playMobileTTS(textToSpeak);
      }
      
      setIsGeneratingAudio(null);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error with audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
      setIsGeneratingAudio(null);
      setIsPlaying(false);
    }
  };

  const playWebSpeech = async (text: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.volume = isMuted ? 0 : volume;
      utterance.lang = 'en-US';

      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  };

  const playMobileTTS = async (text: string) => {
    try {
      // For mobile, we'll use a simple audio playback simulation
      // In a real app, you'd integrate with a TTS service
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Demo audio
        { 
          shouldPlay: true, 
          rate: playbackSpeed,
          volume: isMuted ? 0 : volume,
        }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing mobile TTS:', error);
      throw error;
    }
  };

  const playExistingAudio = async (article: Article) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (!article.audioUrl) {
        console.log('No audio URL available');
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: article.audioUrl },
        { shouldPlay: true, rate: playbackSpeed }
      );

      setSound(newSound);
      setCurrentArticle(article);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const pauseAudio = async () => {
    if (Platform.OS === 'web' && speechSynthesisRef.current) {
      window.speechSynthesis.pause();
    } else if (sound) {
      await sound.pauseAsync();
    }
    setIsPlaying(false);
  };

  const resumeAudio = async () => {
    if (Platform.OS === 'web' && speechSynthesisRef.current) {
      window.speechSynthesis.resume();
    } else if (sound) {
      await sound.playAsync();
    }
    setIsPlaying(true);
  };

  const stopCurrentAudio = async () => {
    if (Platform.OS === 'web') {
      window.speechSynthesis.cancel();
    }
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
  };

  const skipToNext = async () => {
    const nextIndex = currentArticleIndex + 1;
    if (nextIndex < articles.length) {
      await generateAndPlayAudio(articles[nextIndex], nextIndex);
    }
  };

  const skipToPrevious = async () => {
    const prevIndex = currentArticleIndex - 1;
    if (prevIndex >= 0) {
      await generateAndPlayAudio(articles[prevIndex], prevIndex);
    }
  };

  const toggleMute = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (Platform.OS === 'web' && speechSynthesisRef.current) {
      // Web Speech API doesn't support dynamic volume changes
      // Need to restart with new volume
      if (isPlaying && currentArticle) {
        await stopCurrentAudio();
        const textToSpeak = `${currentArticle.titleAi || currentArticle.title}. ${currentArticle.tldr || currentArticle.summary || currentArticle.excerpt}`;
        await playWebSpeech(textToSpeak);
      }
    } else if (sound) {
      await sound.setVolumeAsync(newMutedState ? 0 : volume);
    }
  };

  const changePlaybackSpeed = async (speed: number) => {
    setPlaybackSpeed(speed);
    
    if (Platform.OS === 'web' && speechSynthesisRef.current && isPlaying && currentArticle) {
      // For web, we need to restart speech with new rate
      await stopCurrentAudio();
      const textToSpeak = `${currentArticle.titleAi || currentArticle.title}. ${currentArticle.tldr || currentArticle.summary || currentArticle.excerpt}`;
      await playWebSpeech(textToSpeak);
    } else if (sound) {
      await sound.setRateAsync(speed, true);
    }
  };

  // Audio feature is now available to all users
  // Premium users get additional features like offline downloads

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Audio News</Text>
          <Text style={styles.subtitle}>
            {audioArticles.length} articles available
          </Text>
        </View>

        {currentArticle && (
          <View style={styles.playerContainer}>
            <Text style={styles.nowPlaying}>Now Playing</Text>
            <Text style={styles.currentTitle} numberOfLines={2}>
              {currentArticle.titleAi || currentArticle.title}
            </Text>
            
            <View style={styles.controls}>
              <TouchableOpacity 
                style={[styles.controlButton, currentArticleIndex === 0 && styles.disabledButton]}
                onPress={skipToPrevious}
                disabled={currentArticleIndex === 0}
              >
                <SkipBack size={24} color={currentArticleIndex === 0 ? "#CCC" : "#333"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.playButton}
                onPress={isPlaying ? pauseAudio : resumeAudio}
              >
                {isPlaying ? (
                  <Pause size={32} color="#FFF" />
                ) : (
                  <Play size={32} color="#FFF" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.controlButton, currentArticleIndex >= articles.length - 1 && styles.disabledButton]}
                onPress={skipToNext}
                disabled={currentArticleIndex >= articles.length - 1}
              >
                <SkipForward size={24} color={currentArticleIndex >= articles.length - 1 ? "#CCC" : "#333"} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleMute}
              >
                {isMuted ? (
                  <VolumeX size={24} color="#FF6B6B" />
                ) : (
                  <Volume2 size={24} color="#333" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.speedControls}>
              <Text style={styles.speedLabel}>Speed:</Text>
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedButton,
                    playbackSpeed === speed && styles.activeSpeedButton,
                  ]}
                  onPress={() => changePlaybackSpeed(speed)}
                >
                  <Text
                    style={[
                      styles.speedButtonText,
                      playbackSpeed === speed && styles.activeSpeedButtonText,
                    ]}
                  >
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.articlesList}>
          <Text style={styles.sectionTitle}>Available Articles</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any article to generate and play audio
          </Text>
          
          {articles.slice(0, 10).map((article, index) => (
            <TouchableOpacity
              key={article.id}
              style={[
                styles.articleCard,
                currentArticle?.id === article.id && styles.activeArticleCard,
              ]}
              onPress={() => generateAndPlayAudio(article, index)}
            >
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.titleAi || article.title}
                </Text>
                <Text style={styles.articleMeta}>
                  {article.sourceName} • {article.duration ? `${Math.ceil(article.duration / 60)} min` : '5 min'}
                </Text>
                {article.tldr && (
                  <Text style={styles.articleTldr} numberOfLines={2}>
                    {article.tldr}
                  </Text>
                )}
              </View>
              
              <View style={styles.articleActions}>
                {isGeneratingAudio === article.id ? (
                  <ActivityIndicator size="small" color="#FF6B6B" />
                ) : currentArticle?.id === article.id && isPlaying ? (
                  <View style={styles.playingIndicator}>
                    <Volume2 size={20} color="#FF6B6B" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.actionButton}>
                    <Play size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
                {isPremium && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Download size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {articles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Articles Available</Text>
            <Text style={styles.emptyDescription}>
              Articles will appear here when available.
            </Text>
          </View>
        )}
        
        <View style={styles.featureNote}>
          <Text style={styles.featureNoteTitle}>🎉 Audio Now Available to All!</Text>
          <Text style={styles.featureNoteText}>
            Listen to any article with our text-to-speech feature. {Platform.OS === 'web' ? 'Using your browser\'s speech synthesis.' : 'Premium members enjoy offline downloads.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  premiumPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  upgradeButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playerContainer: {
    backgroundColor: '#F8F9FA',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nowPlaying: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  currentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#E9ECEF',
  },
  activeSpeedButton: {
    backgroundColor: '#FF6B6B',
  },
  speedButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeSpeedButtonText: {
    color: '#FFFFFF',
  },
  articlesList: {
    padding: 20,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeArticleCard: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
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
  articleActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  playingIndicator: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  featureNote: {
    margin: 20,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  featureNoteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  featureNoteText: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
});