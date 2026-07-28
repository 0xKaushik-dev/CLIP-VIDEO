import type { YouTubeSourceVideo, ViralClip, ConnectedChannel, CaptionStyle } from '../types';

export const DEFAULT_CAPTION_STYLES: Record<string, CaptionStyle> = {
  tiktok: {
    preset: 'tiktok',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 32,
    position: 'bottom',
    offsetY: 75,
    activeWordColor: '#facc15',
    normalWordColor: '#ffffff',
    activeWordBackground: 'rgba(0, 0, 0, 0.85)',
    strokeColor: '#000000',
    textCase: 'uppercase',
    autoEmoji: true,
    shadowGlow: true,
    showCaptions: true
  },
  shorts: {
    preset: 'shorts',
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 40,
    position: 'center',
    offsetY: 55,
    activeWordColor: '#06b6d4',
    normalWordColor: '#f3f4f6',
    strokeColor: '#0f172a',
    textCase: 'uppercase',
    autoEmoji: true,
    shadowGlow: true,
    showCaptions: true
  },
  reels: {
    preset: 'reels',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: 28,
    position: 'bottom',
    offsetY: 80,
    activeWordColor: '#ec4899',
    normalWordColor: '#ffffff',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    strokeColor: 'transparent',
    textCase: 'capitalize',
    autoEmoji: true,
    shadowGlow: false,
    showCaptions: true
  },
  karaoke: {
    preset: 'karaoke',
    fontFamily: 'Outfit, sans-serif',
    fontSize: 36,
    position: 'center',
    offsetY: 50,
    activeWordColor: '#a855f7',
    normalWordColor: 'rgba(255, 255, 255, 0.5)',
    strokeColor: '#000000',
    textCase: 'normal',
    autoEmoji: true,
    shadowGlow: true,
    showCaptions: true
  }
};

// Start 100% clean with zero sample videos
export const SAMPLE_YOUTUBE_VIDEOS: YouTubeSourceVideo[] = [];

// Start 100% clean with zero initial clips
export const INITIAL_CLIPS: ViralClip[] = [];

export const CONNECTED_CHANNELS: ConnectedChannel[] = [
  {
    id: 'chan-yt',
    platform: 'youtube',
    name: 'YouTube Shorts Channel',
    handle: '@MyCreatorShorts',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    subscribers: 'Official API Ready',
    connected: false,
    lastSync: 'Not connected',
    oauthScopes: ['https://www.googleapis.com/auth/youtube.upload']
  },
  {
    id: 'chan-ig',
    platform: 'instagram',
    name: 'Instagram Reels Account',
    handle: '@my.reels.official',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subscribers: 'Official API Ready',
    connected: false,
    lastSync: 'Not connected',
    oauthScopes: ['instagram_content_publish']
  }
];
