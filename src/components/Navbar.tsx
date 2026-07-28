import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Scissors, Sparkles, Share2, BarChart2, ChevronDown, LogOut, LogIn } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: 'generator' | 'clips' | 'channels' | 'analytics';
  setActiveTab: (tab: 'generator' | 'clips' | 'channels' | 'analytics') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-400 p-0.5 shadow-lg glow-purple">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-purple-400 -rotate-45" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                ShortsForge<span className="gradient-text font-black">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wide uppercase">
                Unlimited
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Automated YouTube Shorts Clipper</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Clip Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('clips')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'clips'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>My Clips</span>
          </button>

          <button
            onClick={() => setActiveTab('channels')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'channels'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Connected Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Right Section: Account Auth */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 transition"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/50"
                />
                <span className="hidden sm:inline text-xs font-semibold text-zinc-200">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-white/15 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="py-2 border-b border-white/10 text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold py-1">
                      <span>Access Status:</span>
                      <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">UNLIMITED</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow transition flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
