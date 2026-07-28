import React, { useRef, useState, useEffect } from 'react';
import type { ViralClip, CaptionStyle, FaceTrackingMode } from '../types';
import { Play, Pause, Volume2, VolumeX, Sparkles, Subtitles } from 'lucide-react';

interface VideoCanvasPlayerProps {
  clip: ViralClip;
  onTimeUpdate?: (currentTime: number) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  showControls?: boolean;
  className?: string;
  customCaptionStyle?: CaptionStyle;
  customFaceMode?: FaceTrackingMode;
  onToggleCaptions?: () => void;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  clip,
  onTimeUpdate,
  isPlaying: externalIsPlaying,
  onPlayToggle,
  showControls = true,
  className = '',
  customCaptionStyle,
  customFaceMode,
  onToggleCaptions
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(clip.duration || 30);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const captionStyle = customCaptionStyle || clip.captionStyle;
  const faceMode = customFaceMode || clip.faceTrackingMode;
  const showCaptions = captionStyle.showCaptions !== false;

  // Handle Play/Pause sync
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setInternalIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Timer loop for simulated or video time update
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= duration) {
            setInternalIsPlaying(false);
            return 0;
          }
          if (onTimeUpdate) onTimeUpdate(next);

          // Find active word in transcript
          const idx = clip.transcript.findIndex(
            (w) => next >= w.start && next <= w.end + 0.15
          );
          setActiveWordIndex(idx);

          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, clip.transcript, onTimeUpdate]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || clip.duration);
    }
  };

  const togglePlay = () => {
    if (onPlayToggle) {
      onPlayToggle();
    } else {
      setInternalIsPlaying(!internalIsPlaying);
    }
  };

  // Determine crop position transform based on FaceTrackingMode
  const getCropTransform = () => {
    switch (faceMode) {
      case 'left':
        return 'scale(1.75) translate(20%, 0%)';
      case 'right':
        return 'scale(1.75) translate(-20%, 0%)';
      case 'center':
        return 'scale(1.65) translate(0%, 0%)';
      case 'split':
        return 'scale(1.8) translate(0%, -10%)';
      case 'auto':
      default:
        // Dynamic camera sway simulation
        const isRight = activeWordIndex % 6 > 3;
        return isRight ? 'scale(1.7) translate(-10%, 0%)' : 'scale(1.7) translate(5%, 0%)';
    }
  };

  // Render Caption Words Window (Active word + surrounding context)
  const renderCaptions = () => {
    if (!showCaptions || !clip.transcript || clip.transcript.length === 0) return null;

    let currentBlock = [];
    if (activeWordIndex !== -1) {
      const start = Math.max(0, activeWordIndex - 1);
      const end = Math.min(clip.transcript.length, activeWordIndex + 3);
      currentBlock = clip.transcript.slice(start, end);
    } else {
      currentBlock = clip.transcript.slice(0, 3);
    }

    const {
      fontSize,
      position,
      offsetY,
      activeWordColor,
      normalWordColor,
      strokeColor,
      textCase,
      autoEmoji,
      shadowGlow,
      activeWordBackground
    } = captionStyle;

    const positionStyle: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: `${offsetY || (position === 'top' ? 18 : position === 'center' ? 48 : 78)}%`,
      width: '90%',
      textAlign: 'center',
      zIndex: 20
    };

    return (
      <div style={positionStyle} className="pointer-events-none transition-all duration-200 select-none">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full px-2">
          {currentBlock.map((item, idx) => {
            const isActive = clip.transcript.findIndex(w => w.id === item.id) === activeWordIndex;
            let formattedWord = item.word;
            if (textCase === 'uppercase') formattedWord = item.word.toUpperCase();
            if (textCase === 'capitalize') formattedWord = item.word.charAt(0).toUpperCase() + item.word.slice(1).toLowerCase();

            return (
              <span
                key={item.id || idx}
                className={`inline-flex items-center gap-1 transition-all duration-150 rounded-lg px-2 py-0.5 ${
                  isActive ? 'animate-word-pop font-extrabold scale-110 z-10' : 'font-bold opacity-85'
                }`}
                style={{
                  fontFamily: captionStyle.fontFamily,
                  fontSize: `${fontSize}px`,
                  color: isActive ? activeWordColor : normalWordColor,
                  backgroundColor: isActive ? (activeWordBackground || 'rgba(0,0,0,0.65)') : 'transparent',
                  WebkitTextStroke: strokeColor && strokeColor !== 'transparent' ? `1.5px ${strokeColor}` : 'none',
                  textShadow: shadowGlow && isActive
                    ? `0 0 20px ${activeWordColor}, 0 0 10px rgba(0,0,0,0.9)`
                    : '0 2px 8px rgba(0,0,0,0.8)'
                }}
              >
                {formattedWord}
                {autoEmoji && item.emoji && (
                  <span className="text-xl inline-block animate-bounce">{item.emoji}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl flex items-center justify-center aspect-[9/16] ${className}`}
    >
      {/* 9:16 Cropped Video Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-zinc-950">
        
        {clip.youtubeVideoId && isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${clip.youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&start=${clip.startTime}`}
            title={clip.title}
            className="w-[300%] h-[150%] max-w-none object-cover transition-transform duration-700 pointer-events-none"
            style={{
              transform: getCropTransform(),
              transformOrigin: 'center center'
            }}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video
            ref={videoRef}
            src={clip.videoUrl}
            poster={clip.thumbnailUrl}
            className="w-full h-full object-cover transition-transform duration-700 ease-out cursor-pointer"
            style={{
              transform: getCropTransform(),
              transformOrigin: 'center center'
            }}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            muted={isMuted}
            playsInline
          />
        )}

        {/* Dark Vignette Overlay for Captions Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

        {/* Live Subtitle Overlay */}
        {renderCaptions()}

        {/* Face Tracking Camera Target Indicator Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-purple-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>AI Face Focus: {faceMode.toUpperCase()}</span>
        </div>

        {/* Virality Score Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-lg">
          <span>🔥 {clip.viralityScore}/100</span>
        </div>

        {/* Play Overlay Button if Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute z-30 p-4 rounded-full bg-purple-600/90 text-white hover:scale-110 transition-all duration-200 shadow-2xl backdrop-blur-md border border-white/20"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        )}

        {/* Bottom Playbar Controls */}
        {showControls && (
          <div className="absolute bottom-0 inset-x-0 p-4 z-30 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            {/* Progress Bar */}
            <div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-300 font-mono pt-1">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="hover:text-white transition">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition">
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span>
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onToggleCaptions && (
                  <button
                    onClick={onToggleCaptions}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${
                      showCaptions ? 'bg-purple-600 text-white' : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    <Subtitles className="w-3 h-3" />
                    {showCaptions ? 'Captions ON' : 'Captions OFF'}
                  </button>
                )}

                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  9:16 Vertical
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
