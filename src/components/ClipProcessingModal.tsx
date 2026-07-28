import React from 'react';
import { Sparkles, CheckCircle, Zap } from 'lucide-react';

interface ClipProcessingModalProps {
  stage: string;
  progressPercent: number;
  onCancel?: () => void;
}

export const ClipProcessingModal: React.FC<ClipProcessingModalProps> = ({
  stage,
  progressPercent
}) => {
  const steps = [
    { label: 'Fetch YouTube Video Stream', min: 10 },
    { label: 'Whisper AI Speech-To-Text & Timestamps', min: 35 },
    { label: 'MediaPipe Face Tracking & 9:16 Crop', min: 65 },
    { label: 'Hook Detection & Virality Scoring Index', min: 90 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-card gradient-border p-8 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl">
        
        {/* Animated Radial Pulse Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 animate-ping opacity-40" />
          <div className="relative w-16 h-16 rounded-2xl bg-zinc-900 border border-purple-500/40 flex items-center justify-center shadow-xl">
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>

        {/* Status Heading */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white font-heading">
            Processing YouTube Video
          </h3>
          <p className="text-xs text-purple-300 font-mono animate-pulse">
            {stage}
          </p>
        </div>

        {/* Large Progress Bar & Counter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold font-mono">
            <span className="text-zinc-400">AI Clipper Pipeline</span>
            <span className="text-purple-400 font-extrabold">{progressPercent}%</span>
          </div>

          <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-300 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-step checklist */}
        <div className="text-left space-y-2.5 pt-2 border-t border-white/10">
          {steps.map((step, idx) => {
            const isDone = progressPercent >= step.min;
            const isCurrent = !isDone && (idx === 0 || progressPercent >= steps[idx - 1].min);

            return (
              <div
                key={idx}
                className={`flex items-center justify-between text-xs p-2.5 rounded-xl border transition ${
                  isDone
                    ? 'bg-purple-950/30 border-purple-500/30 text-purple-200'
                    : isCurrent
                    ? 'bg-zinc-900 border-white/20 text-white font-semibold'
                    : 'opacity-40 border-transparent text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Zap className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                  )}
                  <span>{step.label}</span>
                </div>

                {isDone && <span className="text-[10px] font-mono text-emerald-400">Done</span>}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-zinc-500">
          Please wait while our neural engine extracts high-retention clips...
        </p>

      </div>
    </div>
  );
};
