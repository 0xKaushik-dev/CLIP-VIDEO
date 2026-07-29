import React, { useState } from 'react';
import type { ConnectedChannel, PlatformId, UserProfile } from '../types';
import { CONNECTED_CHANNELS } from '../lib/mockData';
import { AuthService } from '../lib/authService';
import { RefreshCw, Trash2, ShieldCheck, RefreshCcw, ExternalLink, CheckCircle2, Layers } from 'lucide-react';

interface ChannelManagerProps {
  user?: UserProfile | null;
  onOpenChannelSelector?: (channels: ConnectedChannel[]) => void;
}

export const ChannelManager: React.FC<ChannelManagerProps> = ({
  user,
  onOpenChannelSelector
}) => {
  const [channels, setChannels] = useState<ConnectedChannel[]>(() => {
    if (user?.connectedYouTubeChannel) {
      return [
        user.connectedYouTubeChannel,
        CONNECTED_CHANNELS.find(c => c.platform === 'instagram') || CONNECTED_CHANNELS[1]
      ];
    }
    return CONNECTED_CHANNELS;
  });

  const [connectingPlatform, setConnectingPlatform] = useState<PlatformId | null>(null);

  const activeYouTubeChannel = user?.connectedYouTubeChannel || channels.find(c => c.platform === 'youtube') || channels[0];
  const availableChannels = user?.availableYouTubeChannels || [];

  const handleConnectOAuth = (pId: PlatformId) => {
    setConnectingPlatform(pId);
    if (pId === 'youtube') {
      AuthService.startYouTubeOAuthRedirect();
    } else {
      AuthService.startInstagramOAuthRedirect();
    }
  };

  const handleDisconnect = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, connected: false, lastSync: 'Disconnected' } : c));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-white font-heading">Social Media Connections</h2>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Auto-Linked Google YouTube Account
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Your Google Account automatically links your owned YouTube channel for 1-click video uploads
          </p>
        </div>
      </div>

      {/* Connected Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* YOUTUBE CHANNEL CARD */}
        <div className={`glass-card p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
          activeYouTubeChannel.connected ? 'border-purple-500/40 bg-zinc-900/80 shadow-xl' : 'border-white/10 opacity-80'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeYouTubeChannel.avatar}
                  alt={activeYouTubeChannel.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40"
                />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${
                  activeYouTubeChannel.connected ? 'bg-emerald-400' : 'bg-zinc-600'
                }`} />
              </div>
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-1.5 font-heading">
                  {activeYouTubeChannel.name}
                </h4>
                <p className="text-xs text-purple-300 font-mono">{activeYouTubeChannel.handle}</p>
              </div>
            </div>

            <span className="text-xs font-extrabold capitalize px-3 py-1 rounded-xl border bg-red-500/20 text-red-300 border-red-500/30">
              YouTube Shorts
            </span>
          </div>

          {/* Connected YouTube Metadata */}
          <div className="space-y-2 text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10">
            <div className="flex justify-between text-zinc-300">
              <span>Channel Name:</span>
              <span className="font-bold text-white font-mono">{activeYouTubeChannel.name}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Channel ID:</span>
              <span className="font-mono text-purple-300 font-bold">{activeYouTubeChannel.channelId || activeYouTubeChannel.id}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Audience Status:</span>
              <span className="font-bold text-white font-mono">{activeYouTubeChannel.subscribers}</span>
            </div>
            <div className="flex justify-between text-zinc-400 text-[10px] font-mono pt-1.5 border-t border-white/5">
              <span>OAuth Token Status:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Auto-Refreshed via Google OAuth
              </span>
            </div>
          </div>

          {/* Multiple Channel Switch Button */}
          {availableChannels.length > 1 && onOpenChannelSelector && (
            <button
              onClick={() => onOpenChannelSelector(availableChannels)}
              className="w-full py-2.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Switch Channel ({availableChannels.length} Channels Available)</span>
            </button>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {activeYouTubeChannel.connected ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleConnectOAuth('youtube')}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-purple-400" /> Reconnect OAuth
                </button>
                <button
                  onClick={() => handleDisconnect(activeYouTubeChannel.id)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleConnectOAuth('youtube')}
                disabled={connectingPlatform === 'youtube'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
              >
                {connectingPlatform === 'youtube' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting YouTube Channel...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Connect YouTube via Google OAuth 2.0</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* INSTAGRAM REELS CARD */}
        {channels.filter(c => c.platform === 'instagram').map((chan) => (
          <div
            key={chan.id}
            className={`glass-card p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
              chan.connected ? 'border-purple-500/40 bg-zinc-900/80 shadow-xl' : 'border-white/10 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={chan.avatar} alt={chan.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40" />
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${
                    chan.connected ? 'bg-emerald-400' : 'bg-zinc-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-1.5 font-heading">
                    {chan.name}
                  </h4>
                  <p className="text-xs text-purple-300 font-mono">{chan.handle}</p>
                </div>
              </div>

              <span className="text-xs font-extrabold capitalize px-3 py-1 rounded-xl border bg-pink-500/20 text-pink-300 border-pink-500/30">
                Instagram Reels
              </span>
            </div>

            <div className="space-y-2 text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10">
              <div className="flex justify-between text-zinc-300">
                <span>Audience Status:</span>
                <span className="font-bold text-white font-mono">{chan.subscribers}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>OAuth Sync:</span>
                <span className="text-purple-300 font-mono font-semibold">{chan.lastSync}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[10px] font-mono pt-1.5 border-t border-white/5">
                <span>OAuth Scope:</span>
                <span className="text-emerald-400">instagram_content_publish</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {chan.connected ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleConnectOAuth(chan.platform)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-white/10 transition flex items-center justify-center gap-1.5"
                  >
                    <RefreshCcw className="w-3.5 h-3.5 text-purple-400" /> Reconnect OAuth
                  </button>
                  <button
                    onClick={() => handleDisconnect(chan.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnectOAuth(chan.platform)}
                  disabled={connectingPlatform === chan.platform}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
                >
                  {connectingPlatform === chan.platform ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Redirecting to Official OAuth...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Connect Instagram via Meta Graph API</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
