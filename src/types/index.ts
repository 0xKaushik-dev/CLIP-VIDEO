export type CaptionPreset = 'tiktok' | 'shorts' | 'reels' | 'karaoke' | 'minimal';

export interface CaptionStyle {
  preset: CaptionPreset;
  fontFamily: string;
  fontSize: number;
  position: 'top' | 'center' | 'bottom';
  offsetY: number;
  activeWordColor: string;
  normalWordColor: string;
  strokeColor?: string;
  backgroundColor?: string;
  textCase: 'uppercase' | 'capitalize' | 'normal';
  autoEmoji: boolean;
  activeWordBackground?: string;
  shadowGlow: boolean;
  showCaptions: boolean;
}

export interface TranscriptWord {
  id: string;
  word: string;
  start: number;
  end: number;
  speaker?: string;
  emoji?: string;
  isKeyword?: boolean;
}

export type PlatformId = 'youtube' | 'instagram';
export type PublishDestination = 'youtube' | 'instagram' | 'both';

export interface ConnectedChannel {
  id: string;
  platform: PlatformId;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  connected: boolean;
  lastSync: string;
  channelId?: string;
  oauthScopes?: string[];
  autoPostingEnabled?: boolean;
  defaultVisibility?: 'public' | 'unlisted' | 'private';
  defaultCategoryId?: string;
}

export type FaceTrackingMode = 'auto' | 'center' | 'left' | 'right' | 'split';
export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:5';

export interface ClipGenerationSettings {
  clipCount: number;
  aspectRatio: AspectRatioType;
  subtitlesEnabled: boolean;
  targetLength: number | 'custom';
  customLengthSeconds: number;
}

export interface ViralClip {
  id: string;
  videoId: string;
  youtubeVideoId?: string;
  videoTitle: string;
  title: string;
  description: string;
  hashtags: string[];
  tags: string[];
  viralityScore: number;
  viralityReason: string;
  startTime: number;
  endTime: number;
  duration: number;
  transcript: TranscriptWord[];
  aspectRatio: AspectRatioType;
  faceTrackingMode: FaceTrackingMode;
  captionStyle: CaptionStyle;
  videoUrl: string;
  thumbnailUrl: string;
  bgMusicTrack?: string;
  bgMusicVolume?: number;
  removeSilence: boolean;
  autoZoom: boolean;
  status: 'draft' | 'processing' | 'scheduled' | 'published';
  scheduledDate?: string;
  publishedPlatforms?: PlatformId[];
  viewsCount?: number;
  likesCount?: number;
  showCaptions?: boolean;
  categoryId?: string;
  categoryName?: string;
  madeForKids?: boolean;
  visibility?: 'public' | 'unlisted' | 'private';
  seoScore?: number;
  predictedCtr?: string;
}

export interface YouTubeSourceVideo {
  id: string;
  youtubeVideoId?: string;
  url: string;
  title: string;
  channelName: string;
  durationSeconds: number;
  formattedDuration: string;
  thumbnailUrl: string;
  publishedAt: string;
  videoPreviewUrl: string;
  clipsGenerated: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}
