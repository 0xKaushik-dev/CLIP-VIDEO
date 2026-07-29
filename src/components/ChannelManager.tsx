import React, { useState } from 'react';
import type { ConnectedChannel, PlatformId } from '../types';
import { CONNECTED_CHANNELS } from '../lib/mockData';
import { AuthService } from '../lib/authService';
import { RefreshCw, Trash2, ShieldCheck, RefreshCcw, ExternalLink } from 'lucide-react';

export const ChannelManager: React.FC = () => {
  const [channels, setChannels] = useState<ConnectedChannel[]>(CONNECTED_CHANNELS);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformId | null>(null);

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

  const toggleAutoPost = (id: string) => {
    setChannels(channels.map(c => c.id === id ? { ...c, autoPostingEnabled: !c.autoPostingEnabled } : c));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-white font-heading">Social Media Connections</h2>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Official YouTube & Instagram APIs
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Authenticate directly via Google OAuth 2.0 and Meta Graph API to upload videos automatically
          </p>
        </div>
      </div>

      {/* Connected Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((chan) => (
          <div
            key={chan.id}
            className={`glass-card p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
              chan.connected ? 'border-purple-500/40 bg-zinc-900/80 shadow-xl' : 'border-white/10 opacity-80'
            }`}
          >
            {/* Channel Top Header */}
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

              <span className={`text-xs font-extrabold capitalize px-3 py-1 rounded-xl border ${
                chan.platform === 'youtube'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-pink-500/20 text-pink-300 border-pink-500/30'
              }`}>
                {chan.platform === 'youtube' ? 'YouTube Shorts' : 'Instagram Reels'}
              </span>
            </div>

            {/* Connection Details & API Scope */}
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
                <span className="text-emerald-400">
                  {chan.platform === 'youtube' ? 'youtube.upload' : 'instagram_content_publish'}
                </span>
              </div>
            </div>

            {/* Auto-Posting Preference Switch */}
            {chan.connected && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950 border border-white/10 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">Auto-Publish Preference</span>
                  <span className="text-[10px] text-zinc-400">Automatically upload generated videos</span>
                </div>
                <button
                  onClick={() => toggleAutoPost(chan.id)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    chan.autoPostingEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {chan.autoPostingEnabled ? 'AUTO POST ON' : 'MANUAL REVIEW'}
                </button>
              </div>
            )}

            {/* Bottom Actions: Connect via Official OAuth */}
            <div className="pt-2">
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
                      <span>Connect {chan.platform === 'youtube' ? 'YouTube via Google OAuth 2.0' : 'Instagram via Meta Graph API'}</span>
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
