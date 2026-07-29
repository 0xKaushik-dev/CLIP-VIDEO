import React from 'react';
import type { ViralClip, UserProfile } from '../types';
import { Eye, ThumbsUp, Clock, TrendingUp, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  clips: ViralClip[];
  user?: UserProfile | null;
  onOpenEditor: (clip: ViralClip) => void;
  onOpenPublish: (clip: ViralClip) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  clips,
  user,
  onOpenPublish
}) => {
  const scheduledClips = clips.filter(c => c.status === 'scheduled');
  const connectedChannel = user?.connectedYouTubeChannel;

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
      
      {/* Connected YouTube Channel Banner */}
      {connectedChannel && (
        <div className="glass-card p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={connectedChannel.avatar}
                alt={connectedChannel.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-zinc-950 flex items-center justify-center text-white text-[9px]">
                ▶
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-heading">{connectedChannel.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OAuth Connected
                </span>
              </div>
              <p className="text-xs text-purple-300 font-mono mt-0.5">
                Channel ID: <span className="text-white font-bold">{connectedChannel.channelId || connectedChannel.id}</span> • {connectedChannel.handle}
              </p>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {connectedChannel.subscribers} • Tokens Auto-Refreshed
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-zinc-950/80 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ready for Direct 1-Click Publishing</span>
          </div>
        </div>
      )}

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
            <span>Scheduled Queue</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{scheduledClips.length}</div>
          <div className="text-[11px] text-zinc-400">
            {scheduledClips.length > 0 ? 'Next post ready' : 'No posts in queue'}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Avg Virality Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">94.5 / 100</div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            High viral potential
          </div>
        </div>
      </div>

      {/* Analytics Chart & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Views Graph */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-heading">Performance Velocity</h3>
            <span className="text-xs text-zinc-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6">
            {dailyHistory.map((item, index) => {
              const heightPercent = Math.round((item.views / maxViews) * 100);
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-purple-300 font-mono opacity-0 group-hover:opacity-100 transition">
                    {(item.views / 1000).toFixed(0)}k
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-400 transition-all duration-300 min-h-[12px]"
                  />
                  <span className="text-[11px] text-zinc-400 font-semibold">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Posts Queue */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-white font-heading">Scheduled Uploads</h3>

          {scheduledClips.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-zinc-600" />
              <p>No upcoming scheduled posts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledClips.map((clip) => (
                <div key={clip.id} className="p-3 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={clip.thumbnailUrl} alt={clip.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{clip.title}</h4>
                      <p className="text-[10px] text-purple-400 font-mono">{clip.scheduledDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenPublish(clip)}
                    className="p-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
