import React, { useState } from 'react';
import type { ClipGenerationSettings, AspectRatioType } from '../types';
import { Sparkles, Clock, CheckCircle2, Zap, Layers, Monitor, Smartphone, Square, Check, Subtitles, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface VideoInputSectionProps {
  onStartProcessing: (url: string, settings: ClipGenerationSettings) => void;
  isLoading: boolean;
}

export const VideoInputSection: React.FC<VideoInputSectionProps> = ({
  onStartProcessing,
  isLoading
}) => {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Clip Generation Settings state
  const [clipCount, setClipCount] = useState<number>(4);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(true);
  const [targetLength, setTargetLength] = useState<number | 'custom'>(30); // Single-select only!
  const [customLengthSeconds, setCustomLengthSeconds] = useState<number>(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Please enter or paste a valid YouTube video URL');
      return;
    }
    setErrorMessage('');
    
    const settings: ClipGenerationSettings = {
      clipCount,
      aspectRatio,
      subtitlesEnabled,
      targetLength,
      customLengthSeconds
    };

    onStartProcessing(url.trim(), settings);
  };

  return (
    <section className="relative pt-8 pb-8 px-4 max-w-6xl mx-auto">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-600/20 via-pink-600/20 to-cyan-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      {/* Hero Badge & Heading */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI-Powered YouTube to Shorts Converter</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-heading max-w-4xl mx-auto leading-[1.15]">
          Turn Long YouTube Videos Into <br className="hidden sm:block" />
          <span className="gradient-text">Viral Shorts in Seconds</span>
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Paste any YouTube URL. Our AI identifies high-engagement viral moments, applies smart crop with face tracking, generates TikTok captions, and publishes to all platforms.
        </p>
      </div>

      {/* Main Glassmorphic Input Card */}
      <div className="glass-card gradient-border p-6 sm:p-8 rounded-3xl shadow-2xl max-w-3xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* YouTube URL Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">▶</span>
                Paste YouTube Video URL
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">Supports 1 min to 10+ hours</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setErrorMessage(''); }}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-4 pr-36 py-4 rounded-2xl bg-zinc-950/80 border border-white/15 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Shorts</span>
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
              </p>
            )}
          </div>

          {/* Clip Generation Settings Header */}
          <div className="pt-2 pb-1 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5 font-heading">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              Clip Generation Settings
            </span>
            <span className="text-[11px] text-zinc-400">Customized before AI processing</span>
          </div>

          {/* Setting 1: Target Clip Length (Single-Select Only!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" /> Target Clip Length:
              </span>
              <span className="text-purple-300 font-mono text-[11px] font-semibold">
                Single-Select: {targetLength === 'custom' ? `${customLengthSeconds}s Custom` : `${targetLength} Seconds`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[15, 30, 45, 60, 90].map((len) => {
                const isSelected = targetLength === len;
                return (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setTargetLength(len)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/50 shadow-lg'
                        : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <span>{len}s</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-purple-400 bg-purple-500' : 'border-zinc-600'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}

              {/* Custom Length Option */}
              <button
                type="button"
                onClick={() => setTargetLength('custom')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  targetLength === 'custom'
                    ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/50 shadow-lg'
                    : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                }`}
              >
                <span>Custom</span>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  targetLength === 'custom' ? 'border-purple-400 bg-purple-500' : 'border-zinc-600'
                }`}>
                  {targetLength === 'custom' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>

            {/* Custom Length Seconds Input */}
            {targetLength === 'custom' && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-purple-500/40 animate-in fade-in">
                <span className="text-xs font-bold text-zinc-300">Enter Custom Duration (seconds):</span>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={customLengthSeconds}
                  onChange={(e) => setCustomLengthSeconds(Math.max(5, Math.min(180, Number(e.target.value))))}
                  className="w-20 bg-zinc-900 border border-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-xs font-bold text-center focus:outline-none focus:border-purple-500"
                />
                <span className="text-xs font-mono text-purple-300">sec (5s - 180s)</span>
              </div>
            )}
          </div>

          {/* Setting 2: Number of Clips & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Number of Clips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> Number of Clips to Generate:
              </label>
              <div className="flex items-center gap-2">
                {[2, 4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setClipCount(num)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold font-mono transition ${
                      clipCount === num
                        ? 'bg-purple-600/30 border-purple-500 text-white ring-1 ring-purple-500 shadow'
                        : 'bg-zinc-950 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {num} Clips
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-400" /> Output Aspect Ratio:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { ratio: '9:16', name: '9:16 (Shorts/Reels/TikTok)', icon: Smartphone },
                  { ratio: '16:9', name: '16:9 (YouTube Standard)', icon: Monitor },
                  { ratio: '1:1', name: '1:1 (Square Feed)', icon: Square },
                  { ratio: '4:5', name: '4:5 (Portrait)', icon: Smartphone }
                ].map((item) => {
                  const isSelected = aspectRatio === item.ratio;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.ratio}
                      type="button"
                      onClick={() => setAspectRatio(item.ratio as AspectRatioType)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500 text-white ring-1 ring-purple-500 shadow'
                          : 'bg-zinc-950 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{item.ratio}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Setting 3: Subtitles Enable/Disable Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Subtitles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Burn Subtitles into Clips</span>
                  <span className="text-[10px] text-zinc-400">Automatically generate and overlay animated captions</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  subtitlesEnabled
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {subtitlesEnabled ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Subtitles ENABLED
                  </>
                ) : (
                  <span>Subtitles DISABLED</span>
                )}
              </button>
            </div>
          </div>

          {/* AI Features Summary Pills */}
          <div className="pt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400 font-medium">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/40 border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {aspectRatio} Crop
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/40 border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AI Face Tracking
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/40 border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {subtitlesEnabled ? 'Captions Active' : 'Captions Off'}
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/40 border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Silence Remover
            </div>
          </div>
        </form>
      </div>

    </section>
  );
};
