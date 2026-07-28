import React from 'react';
import { Check, Zap, X } from 'lucide-react';

interface PricingModalProps {
  currentPlan: string;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  currentPlan,
  onClose,
  onUpgrade
}) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      desc: 'Ideal for trying out AI short-form clip generation',
      minutes: '30 AI Minutes / mo',
      features: [
        'Export in 720p HD',
        'TikTok & Shorts Caption Presets',
        'Manual Face Crop Mode',
        'Community Support'
      ]
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      popular: true,
      desc: 'For serious content creators & podcast hosts',
      minutes: '500 AI Minutes / mo',
      features: [
        'Export in 4K Ultra HD',
        'All 4 Animated Caption Presets',
        'AI MediaPipe Face Tracking',
        'Silence & Filler Word Remover',
        'Direct 1-Click Multi-Social Publishing',
        'AI Title & Hashtag Generator',
        'Priority Rendering Pipeline'
      ]
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      desc: 'For agencies, media networks & high-volume teams',
      minutes: '2,500 AI Minutes / mo',
      features: [
        'Unlimited 4K Rendering',
        'Custom Brand Fonts & Watermarks',
        'Multi-Account Channel Management (10+)',
        'Bulk Upload & Schedule Automation',
        'Dedicated Account Manager & API Access'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="glass-card border border-white/15 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-current" />
              <h2 className="text-2xl font-black text-white font-heading">Choose Your Subscription Plan</h2>
            </div>
            <p className="text-xs text-zinc-400">Scale your short-form reach with automated AI clipping</p>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.name;
            return (
              <div
                key={p.name}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative transition ${
                  p.popular
                    ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-500/40 shadow-2xl scale-105'
                    : 'border-white/10 bg-zinc-950/60'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-black tracking-wider uppercase text-white shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-mono">{p.price}</span>
                    <span className="text-xs text-zinc-400">/{p.period}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                    ⚡ {p.minutes}
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300 pt-2">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onUpgrade(p.name)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition shadow ${
                    isCurrent
                      ? 'bg-zinc-800 text-zinc-400 cursor-default'
                      : p.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                      : 'bg-zinc-900 border border-white/15 text-white hover:bg-zinc-800'
                  }`}
                >
                  {isCurrent ? 'Current Active Plan' : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
