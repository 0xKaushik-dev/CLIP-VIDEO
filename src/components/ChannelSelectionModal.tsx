import React from 'react';
import type { ConnectedChannel } from '../types';
import { Check, Radio, ShieldCheck, Play } from 'lucide-react';

interface ChannelSelectionModalProps {
  channels: ConnectedChannel[];
  selectedChannelId: string | null;
  onSelectChannel: (channel: ConnectedChannel) => void;
  onClose: () => void;
}

export const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({
  channels,
  selectedChannelId,
  onSelectChannel,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="glass-card border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-heading flex items-center gap-2">
                Select YouTube Channel
              </h3>
              <p className="text-xs text-zinc-400">
                Multiple YouTube channels were found for your signed-in Google account
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition">
            ✕
          </button>
        </div>

        {/* Security Badge */}
        <div className="p-3 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Automatic YouTube Data API v3 Linking</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
            No Extra Login Required
          </span>
        </div>

        {/* Channels List */}
        <div className="space-y-3">
          <label className="font-extrabold text-white text-xs uppercase tracking-wider block font-heading">
            Choose Active Publishing Channel ({channels.length}):
          </label>

          <div className="space-y-3">
            {channels.map((chan) => {
              const isSelected = selectedChannelId === chan.id || selectedChannelId === chan.channelId;
              return (
                <div
                  key={chan.id}
                  onClick={() => onSelectChannel(chan)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/40 text-white shadow-xl'
                      : 'bg-zinc-950/70 border-white/10 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={chan.avatar}
                      alt={chan.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/30"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5 font-heading">
                        {chan.name}
                      </h4>
                      <p className="text-xs text-purple-300 font-mono">{chan.handle}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        ID: {chan.channelId || chan.id} • {chan.subscribers}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center">
                        <Radio className="w-3 h-3 text-zinc-500" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-zinc-400">
          <p>You can switch your active publishing channel anytime from the Social Connections tab.</p>
        </div>

      </div>
    </div>
  );
};
