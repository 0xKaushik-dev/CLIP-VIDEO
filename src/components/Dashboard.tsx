import React from 'react';
import type { ViralClip } from '../types';
import { Eye, ThumbsUp, Clock, TrendingUp, Share2 } from 'lucide-react';

interface DashboardProps {
  clips: ViralClip[];
  onOpenEditor: (clip: ViralClip) => void;
  onOpenPublish: (clip: ViralClip) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  clips,
  onOpenPublish
}) => {
  const scheduledClips = clips.filter(c => c.status === 'scheduled');

  const dailyHistory = [
    { day: 'Mon', views: 42000 },
    { day: 'Tue', views: 68000 },
    { day: 'Wed', views: 125000 },
    { day: 'Thu', views: 98000 },
    { day: 'Fri', views: 185000 },
    { day: 'Sat', views: 240000 },
    { day: 'Sun', views: 310000 },
  ];

  const maxViews = Math.max(...dailyHistory.map(d => d.views));

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Shorts Views</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">1,068,000</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +34.8% vs last week
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Engagement / Likes</span>
            <div className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">142,500</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 13.3% engagement rate
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Avg Watch Time</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">94.2%</div>
          <div className="text-[11px] text-cyan-300 font-semibold">
            High retention hook benchmark
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Viral Clip Index</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-600/20 text-yellow-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">96/100</div>
          <div className="text-[11px] text-purple-300 font-semibold">
            Top 1% Creator Score
          </div>
        </div>
      </div>

      {/* Chart & Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Views Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base font-heading">Weekly Views Performance</h3>
              <p className="text-xs text-zinc-400">Across YouTube Shorts, TikTok, and Instagram Reels</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
              Last 7 Days
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
            {dailyHistory.map((item, i) => {
              const heightPercent = (item.views / maxViews) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-purple-300 opacity-0 group-hover:opacity-100 transition">
                    {(item.views / 1000).toFixed(0)}k
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 via-pink-600 to-cyan-400 rounded-xl transition-all duration-500 group-hover:scale-105 shadow-lg"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs text-zinc-400 font-semibold">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scheduled Posts & Queue */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-bold text-white text-base font-heading">Upcoming Uploads</h3>
            <span className="text-xs text-purple-400 font-mono font-bold">{scheduledClips.length} queued</span>
          </div>

          <div className="space-y-3">
            {clips.slice(0, 3).map((clip) => (
              <div
                key={clip.id}
                className="p-3 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-purple-500/40 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={clip.thumbnailUrl} alt={clip.title} className="w-10 h-14 rounded-xl object-cover" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{clip.title}</h4>
                    <p className="text-[10px] text-zinc-400">{clip.scheduledDate || 'Ready to post'}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenPublish(clip)}
                  className="p-2 rounded-xl bg-purple-600/30 text-purple-300 hover:bg-purple-600 text-xs font-semibold transition shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
