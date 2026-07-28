import React from 'react';
import type { ViralClip } from '../types';
import { Play, Edit3, Share2, Trash2, Flame, Layers } from 'lucide-react';

interface ClipGridProps {
  clips: ViralClip[];
  onOpenEditor: (clip: ViralClip) => void;
  onOpenPublishModal: (clip: ViralClip) => void;
  onOpenBatchPublishModal: () => void;
  onDeleteClip: (id: string) => void;
  sourceTitle?: string;
}

export const ClipGrid: React.FC<ClipGridProps> = ({
  clips,
  onOpenEditor,
  onOpenPublishModal,
  onOpenBatchPublishModal,
  onDeleteClip,
  sourceTitle
}) => {
  if (clips.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No Generated Clips Yet</h3>
        <p className="text-sm text-zinc-400">
          Paste a YouTube video URL above or select a quick-start video to generate AI shorts.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header bar with Batch Publish button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white font-heading">
              Generated Viral Shorts ({clips.length})
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Ready to Publish
            </span>
          </div>
          {sourceTitle && (
            <p className="text-xs text-zinc-400 mt-1 truncate max-w-xl">
              Extracted from: <span className="text-zinc-200 font-medium">{sourceTitle}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBatchPublishModal}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Publish All {clips.length} Clips Now</span>
          </button>
        </div>
      </div>

      {/* Clip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clips.map((clip) => (
          <div
            key={clip.id}
            className="glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 group flex flex-col justify-between shadow-xl"
          >
            {/* Top Preview Section */}
            <div className="relative aspect-[9/16] bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => onOpenEditor(clip)}>
              <img
                src={clip.thumbnailUrl}
                alt={clip.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition backdrop-blur-md border border-white/20">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Virality Score Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-lg">
                <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
                <span>{clip.viralityScore}/100</span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-mono border border-white/10">
                {clip.duration}s
              </div>

              {/* Caption Preset Indicator */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-purple-300 font-semibold uppercase tracking-wider border border-white/10">
                Preset: {clip.captionStyle.preset}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition">
                  {clip.title}
                </h3>
                <p className="text-[11px] text-purple-300/80 bg-purple-950/40 p-2 rounded-lg border border-purple-500/20 italic line-clamp-2">
                  "{clip.viralityReason}"
                </p>
              </div>

              {/* Status & Hashtags */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex flex-wrap gap-1 text-[10px] text-zinc-400">
                  {clip.hashtags.slice(0, 3).map((h, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => onOpenEditor(clip)}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-900 hover:bg-purple-600/30 text-zinc-200 hover:text-purple-200 text-xs font-semibold border border-white/10 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => onOpenPublishModal(clip)}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow transition"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Publish
                  </button>

                  <button
                    onClick={() => onDeleteClip(clip.id)}
                    className="flex items-center justify-center p-2 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 transition"
                    title="Delete Clip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
