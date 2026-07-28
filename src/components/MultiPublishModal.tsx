import React, { useState } from 'react';
import type { ViralClip, PublishDestination } from '../types';
import { AIService, YOUTUBE_CATEGORIES } from '../lib/aiService';
import confetti from 'canvas-confetti';
import { Share2, Sparkles, Check, Clock, Calendar, CheckCircle2, RefreshCw, Send, ShieldCheck, Tag } from 'lucide-react';

interface MultiPublishModalProps {
  clipsToPublish: ViralClip[];
  onClose: () => void;
  onPublishComplete: (publishedClipIds: string[]) => void;
}

export const MultiPublishModal: React.FC<MultiPublishModalProps> = ({
  clipsToPublish,
  onClose,
  onPublishComplete
}) => {
  const isBatchMode = clipsToPublish.length > 1;
  const currentClip = clipsToPublish[0];

  // Publish To Selection
  const [destination, setDestination] = useState<PublishDestination>('both');

  // Form State
  const [customTitle, setCustomTitle] = useState(currentClip?.title || '🔥 Viral AI Short');
  const [customDesc, setCustomDesc] = useState(currentClip?.description || '');
  const [customTags, setCustomTags] = useState(currentClip?.tags?.join(', ') || 'youtube shorts, instagram reels, ai automation, viral video');
  const [categoryId, setCategoryId] = useState(currentClip?.categoryId || '28');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>(currentClip?.visibility || 'public');
  const [madeForKids, setMadeForKids] = useState(currentClip?.madeForKids || false);

  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [scheduledTime, setScheduledTime] = useState('Tomorrow at 6:00 PM');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // AI Title Generator
  const [aiSuggestions, setAiSuggestions] = useState(() =>
    AIService.generateViralMetadata(currentClip?.title || 'Building SaaS Apps')
  );

  const handleRegenerateMetadata = () => {
    const updated = AIService.generateViralMetadata(customTitle || 'Viral Tech Clip');
    setAiSuggestions(updated);
    setCustomDesc(updated.description);
    setCustomTags(updated.tags.join(', '));
  };

  const handleStartPublish = async () => {
    setIsPublishing(true);
    setPublishProgress(10);

    for (let i = 20; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 350));
      setPublishProgress(i);
    }

    setIsPublishing(false);
    setPublishSuccess(true);

    // Trigger Confetti Celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback
    }

    setTimeout(() => {
      onPublishComplete(clipsToPublish.map(c => c.id));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="glass-card border border-white/15 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-zinc-950/80 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-heading">
                {isBatchMode ? `Publish All (${clipsToPublish.length}) Videos` : 'Direct Social Media Publisher'}
              </h2>
              <p className="text-xs text-zinc-400">
                Directly upload generated videos to YouTube Shorts and Instagram Reels
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition">
            ✕
          </button>
        </div>

        {/* Successful Publish Screen */}
        {publishSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              {publishMode === 'schedule' ? 'Videos Scheduled Successfully!' : 'Uploaded & Published Successfully!'}
            </h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto">
              Your generated video(s) have been uploaded directly to {destination === 'both' ? 'YouTube Shorts and Instagram Reels' : destination === 'youtube' ? 'YouTube Shorts' : 'Instagram Reels'}.
            </p>
          </div>
        ) : (
          <div className="space-y-6 text-xs">
            
            {/* Publish To Selector */}
            <div className="space-y-3">
              <label className="font-extrabold text-white text-xs uppercase tracking-wider block font-heading">
                Publish To Destination:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'youtube', label: 'YouTube Shorts', desc: 'Official YouTube Data API v3', icon: '▶' },
                  { id: 'instagram', label: 'Instagram Reels', desc: 'Official Instagram Graph API', icon: '📸' },
                  { id: 'both', label: 'Both YouTube & Instagram', desc: 'Simultaneous 1-Click Upload', icon: '⚡' }
                ].map((item) => {
                  const isSelected = destination === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setDestination(item.id as PublishDestination)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-1 ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/50 shadow-lg'
                          : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="flex items-center gap-1.5 text-white">
                          <span>{item.icon}</span> {item.label}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-600" />
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connected Account Verification Bar */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300 font-semibold">
                  Connected Target Accounts:
                  {destination === 'youtube' || destination === 'both' ? ' @TechGrowthShorts (YouTube)' : ''}
                  {destination === 'instagram' || destination === 'both' ? ' @dailymindset.reels (Instagram)' : ''}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">OAuth Active</span>
            </div>

            {/* AI Title Suggestions */}
            <div className="space-y-3 p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" /> AI Viral Title Hooks
                </span>
                <button
                  onClick={handleRegenerateMetadata}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>

              <div className="space-y-2">
                {aiSuggestions.titles.map((titleOpt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCustomTitle(titleOpt)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
                      customTitle === titleOpt
                        ? 'bg-purple-600/30 border-purple-500 text-white'
                        : 'bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{titleOpt}</span>
                    {customTitle === titleOpt && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Title, Description & Tags Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 text-[11px] block">Video Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-white/15 text-white font-medium text-xs focus:outline-none focus:border-purple-500 font-heading"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 text-[11px] block">SEO Description & Hashtags</label>
                <textarea
                  rows={3}
                  value={customDesc || aiSuggestions.description}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-white/15 text-white font-medium text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300 text-[11px] block flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-purple-400" /> Search Keywords & Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-white/15 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Platform Metadata & Privacy Settings */}
            {(destination === 'youtube' || destination === 'both') && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/80 border border-white/10">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 text-[10px] uppercase block">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none"
                  >
                    {YOUTUBE_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 text-[10px] uppercase block">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:outline-none capitalize"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300 text-[10px] uppercase block">Audience Settings</label>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-white/15 h-9">
                    <span className="text-[11px] text-zinc-300">Made for Kids</span>
                    <input
                      type="checkbox"
                      checked={madeForKids}
                      onChange={(e) => setMadeForKids(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Timing */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/60 border border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPublishMode('now')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    publishMode === 'now'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Publish Immediately
                </button>

                <button
                  onClick={() => setPublishMode('schedule')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    publishMode === 'schedule'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" /> Schedule Upload
                </button>
              </div>

              {publishMode === 'schedule' && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-zinc-900 border border-white/15 px-3 py-1.5 rounded-lg text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleStartPublish}
                disabled={isPublishing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Uploading directly to {destination === 'both' ? 'YouTube & Instagram' : destination.toUpperCase()} ({publishProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>
                      {publishMode === 'schedule'
                        ? 'Confirm Schedule Upload'
                        : `Publish ${clipsToPublish.length} Video(s) To ${destination === 'both' ? 'YouTube & Instagram' : destination.toUpperCase()}`}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
