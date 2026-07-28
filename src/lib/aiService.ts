import type { ViralClip, TranscriptWord, YouTubeSourceVideo, ClipGenerationSettings } from '../types';
import { DEFAULT_CAPTION_STYLES } from './mockData';

// YouTube Data API v3 Standard Categories
export const YOUTUBE_CATEGORIES = [
  { id: '28', name: 'Science & Technology' },
  { id: '27', name: 'Education' },
  { id: '24', name: 'Entertainment' },
  { id: '22', name: 'People & Blogs' },
  { id: '20', name: 'Gaming' },
  { id: '26', name: 'Howto & Style' },
  { id: '25', name: 'News & Politics' }
];

// Simulated AI Speech-to-Text & Virality Clip Extraction Engine
export class AIService {
  /**
   * Extract YouTube Video ID from any standard YouTube URL (watch, shorts, embed, shortlink)
   */
  static extractVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  /**
   * Fetch real YouTube video title from oEmbed API if available
   */
  static async fetchYouTubeTitle(url: string): Promise<string | null> {
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          return data.title;
        }
      }
    } catch (e) {
      // Fallback
    }
    return null;
  }

  /**
   * Generates synthetic word-by-word transcript with timestamps and auto emojis
   */
  static generateSyntheticTranscript(sentence: string, startOffset: number = 0): TranscriptWord[] {
    const rawWords = sentence.split(/\s+/);
    const words: TranscriptWord[] = [];
    let currentTime = startOffset;

    const emojiMap: Record<string, string> = {
      MONEY: '💰',
      FAIL: '💔',
      AI: '🤖',
      FUTURE: '🚀',
      SECRET: '🤫',
      RULE: '⚡',
      STOP: '🛑',
      WIN: '👑',
      SUCCESS: '🔥',
      MINDSET: '🧠',
      TIME: '⏱️',
      PROBLEM: '🎯',
      SOFTWARE: '💻',
      POWER: '⚡',
      PERCENT: '📈'
    };

    rawWords.forEach((wordText, i) => {
      const cleanUpper = wordText.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      const duration = Math.max(0.25, Math.min(0.7, wordText.length * 0.08));
      
      const isKey = cleanUpper.length > 5 || ['WIN', 'FAIL', 'AI', 'BEST', 'TOP', 'ONLY', 'STOP'].includes(cleanUpper);
      const emoji = emojiMap[cleanUpper];

      words.push({
        id: `word-${startOffset}-${i}`,
        word: wordText,
        start: Number(currentTime.toFixed(2)),
        end: Number((currentTime + duration).toFixed(2)),
        isKeyword: isKey,
        emoji: emoji
      });

      currentTime += duration + 0.05; // slight space between words
    });

    return words;
  }

  /**
   * Simulates AI Clip Detection pipeline across full video length
   */
  static async analyzeAndGenerateClips(
    url: string,
    settings: ClipGenerationSettings,
    onProgress: (stage: string, percent: number) => void
  ): Promise<{ sourceVideo: YouTubeSourceVideo; clips: ViralClip[] }> {
    
    // Calculate exact clip duration from single-select target length
    const effectiveDuration = settings.targetLength === 'custom'
      ? (settings.customLengthSeconds || 30)
      : Number(settings.targetLength || 30);

    // Stage 1: Fetching video stream
    onProgress('Connecting to YouTube Data API v3 & parsing video ID...', 15);
    const extractedVideoId = this.extractVideoId(url) || 'dQw4w9WgXcQ';
    const fetchedTitle = await this.fetchYouTubeTitle(url);

    // Real YouTube thumbnail URL for provided video link
    const ytThumbnail = `https://img.youtube.com/vi/${extractedVideoId}/hqdefault.jpg`;
    await new Promise(r => setTimeout(r, 400));

    // Stage 2: Whisper AI Transcription
    onProgress(`Extracting audio & running Whisper STT (Subtitles: ${settings.subtitlesEnabled ? 'ENABLED' : 'DISABLED'})...`, 40);
    await new Promise(r => setTimeout(r, 600));

    // Stage 3: MediaPipe Face Tracking & Aspect Ratio Formatting
    onProgress(`Formatting ${settings.aspectRatio} aspect ratio & scene detection...`, 70);
    await new Promise(r => setTimeout(r, 500));

    // Stage 4: YouTube SEO Optimization & Hook Rating
    onProgress(`Generating ${settings.clipCount} viral clips (${effectiveDuration}s each)...`, 90);
    await new Promise(r => setTimeout(r, 400));

    const videoTitle = fetchedTitle || `Viral YouTube Breakdown (ID: ${extractedVideoId})`;

    // Source video object
    const sourceVideo: YouTubeSourceVideo = {
      id: `yt-${extractedVideoId}`,
      youtubeVideoId: extractedVideoId,
      url: url,
      title: videoTitle,
      channelName: 'YouTube Creator Channel',
      durationSeconds: 1800,
      formattedDuration: '30:00',
      thumbnailUrl: ytThumbnail,
      publishedAt: 'Just now',
      videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      clipsGenerated: settings.clipCount
    };

    const templatePool = [
      {
        title: `🔥 The #1 Secret to ${videoTitle.slice(0, 32)} (Don't Skip!)`,
        reason: 'High emotional intrigue hook in first 1.5s + peak audio retention',
        score: 99,
        seoScore: 98,
        predictedCtr: '15.8%',
        text: 'IF YOU WANT TO MASTER THIS TOPIC YOU MUST UNDERSTAND THIS ONE SINGLE FRAMEWORK! IT CHANGES EVERYTHING ABOUT HOW YOU APPROACH GROWTH IN 2026.'
      },
      {
        title: `⚡ Why Most Creators Fail at ${videoTitle.split(' ')[0] || 'This'} (And How to Fix It)`,
        reason: 'Actionable high-retention hack + curiosity loop',
        score: 96,
        seoScore: 96,
        predictedCtr: '14.2%',
        text: 'STOP MAKING THIS AMATEUR MISTAKE! DO THIS ONE SIMPLE MINDSET RESET INSTEAD AND WATCH YOUR RESULTS 10X INSTANTLY.'
      },
      {
        title: `💎 The 1% Strategy (${extractedVideoId}) - How Elite Founders Scale`,
        reason: 'High authority social proof + specific metric callout',
        score: 94,
        seoScore: 94,
        predictedCtr: '13.1%',
        text: 'THE TOP 1 PERCENT OF CREATORS NEVER DO THIS MANUALLY. THEY AUTOMATE THE ENTIRE WORKFLOW AND PUBLISH TO ALL MAJOR PLATFORMS SIMULTANEOUSLY.'
      },
      {
        title: `🧠 Don't Build Anything Until You Watch This!`,
        reason: 'Fear of missing out + problem solving narrative',
        score: 92,
        seoScore: 92,
        predictedCtr: '12.4%',
        text: 'BEFORE YOU SPEND A SINGLE DOLLAR OR HOUR ON THIS PROJECT MAKE SURE YOU VALIDATE YOUR CORE VALUE PROPOSITION FIRST.'
      },
      {
        title: `🚀 The 24-Hour Growth Blueprint You Need to Copy`,
        reason: 'Step-by-step actionable framework with urgency',
        score: 90,
        seoScore: 91,
        predictedCtr: '11.8%',
        text: 'THIS SINGLE GROWTH HACK DOUBLED OUR ENGAGEMENT IN LESS THAN 24 HOURS. COPY THIS EXACT BLUEPRINT FOR YOUR CHANNEL.'
      },
      {
        title: `🛑 Stop Wasting Time on Low-Impact Content!`,
        reason: 'Strong negative constraint pattern interrupt',
        score: 89,
        seoScore: 90,
        predictedCtr: '11.2%',
        text: 'YOU ARE SPENDING 90 PERCENT OF YOUR TIME ON THINGS THAT DO NOT MOVE THE NEEDLE. FOCUS ON HIGH RETENTION SHORT FORM CLIPS INSTEAD.'
      }
    ];

    const generatedClips: ViralClip[] = [];
    const countToGenerate = Math.min(Math.max(1, settings.clipCount), 12);

    for (let idx = 0; idx < countToGenerate; idx++) {
      const t = templatePool[idx % templatePool.length];
      const clipId = `clip-${extractedVideoId}-${idx}-${Date.now()}`;
      const transcript = this.generateSyntheticTranscript(t.text, 0);
      const styleKeys: (keyof typeof DEFAULT_CAPTION_STYLES)[] = ['tiktok', 'shorts', 'reels', 'karaoke'];
      const baseStyle = DEFAULT_CAPTION_STYLES[styleKeys[idx % styleKeys.length]];

      const captionStyle = {
        ...baseStyle,
        showCaptions: settings.subtitlesEnabled
      };

      const metadata = this.generateViralMetadata(t.title);

      generatedClips.push({
        id: clipId,
        videoId: sourceVideo.id,
        youtubeVideoId: extractedVideoId,
        videoTitle: videoTitle,
        title: `${t.title} [Clip ${idx + 1}/${countToGenerate}]`,
        description: metadata.description,
        hashtags: metadata.hashtags,
        tags: metadata.tags,
        viralityScore: Math.max(75, t.score - idx * 2),
        viralityReason: t.reason,
        startTime: idx * 45,
        endTime: idx * 45 + effectiveDuration,
        duration: effectiveDuration,
        aspectRatio: settings.aspectRatio,
        faceTrackingMode: 'auto',
        captionStyle: captionStyle,
        showCaptions: settings.subtitlesEnabled,
        videoUrl: sourceVideo.videoPreviewUrl,
        thumbnailUrl: ytThumbnail,
        removeSilence: true,
        autoZoom: true,
        status: 'draft',
        categoryId: '28',
        categoryName: 'Science & Technology',
        madeForKids: false,
        visibility: 'public',
        seoScore: t.seoScore,
        predictedCtr: t.predictedCtr,
        transcript: transcript
      });
    }

    onProgress(`Successfully generated ${countToGenerate} clip(s) with ${settings.aspectRatio} aspect ratio!`, 100);
    return { sourceVideo, clips: generatedClips };
  }

  /**
   * AI Metadata Generator for Viral YouTube Titles, SEO Descriptions, Tags & Hashtags
   */
  static generateViralMetadata(topicOrText: string): {
    titles: string[];
    description: string;
    hashtags: string[];
    tags: string[];
    categoryId: string;
    categoryName: string;
    seoScore: number;
    predictedCtr: string;
  } {
    const cleanTopic = topicOrText.replace(/[^a-zA-Z0-9 ]/g, '').trim();

    const titles = [
      `🔥 ${cleanTopic.slice(0, 45)} (The 1% Secret Revealed)`,
      `⚡ Why 99% of People Fail at ${cleanTopic.split(' ')[0] || 'This'} in 2026`,
      `🧠 Do THIS Before It's Too Late (${cleanTopic.slice(0, 35)})`,
      `🛑 STOP Doing This! (Mastering ${cleanTopic.split(' ')[0] || 'Growth'})`
    ];

    const description = `🚀 Watch this high-retention breakdown: ${topicOrText}\n\n📌 In this YouTube Short:\n• The core framework explaining ${cleanTopic.slice(0, 40)}\n• 3 actionable steps you can implement today\n• Why top creators prioritize high retention hooks\n\n🎯 Timestamps:\n0:00 - High Retention Hook\n0:05 - The Core Strategy\n0:20 - Actionable Takeaway\n\n🔔 Subscribe to the channel for daily YouTube Shorts masterclasses!\n\n#YouTubeShorts #Shorts #Viral #AI #Growth #Productivity`;

    const hashtags = ['#YouTubeShorts', '#Shorts', '#Viral', '#ContentCreator', '#AI', '#Trending'];
    const tags = [
      'youtube shorts',
      'shorts',
      'viral shorts',
      'ai automation',
      'content creator',
      'productivity tips',
      'saas',
      'growth hacks',
      cleanTopic.toLowerCase()
    ];

    return {
      titles,
      description,
      hashtags,
      tags,
      categoryId: '28',
      categoryName: 'Science & Technology',
      seoScore: 98,
      predictedCtr: '15.4%'
    };
  }
}
