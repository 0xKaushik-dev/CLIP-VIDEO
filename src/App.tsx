import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VideoInputSection } from './components/VideoInputSection';
import { ClipProcessingModal } from './components/ClipProcessingModal';
import { ClipGrid } from './components/ClipGrid';
import { VideoEditorModal } from './components/VideoEditorModal';
import { MultiPublishModal } from './components/MultiPublishModal';
import { ChannelManager } from './components/ChannelManager';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { ChannelSelectionModal } from './components/ChannelSelectionModal';
import { AIService } from './lib/aiService';
import { AuthService } from './lib/authService';
import type { ViralClip, UserProfile, ClipGenerationSettings, ConnectedChannel } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'clips' | 'channels' | 'analytics'>('generator');
  
  // Real Persistent User Session (Starts unauthenticated or loads active session)
  const [user, setUser] = useState<UserProfile | null>(() => AuthService.getSession());
  
  // Real User Generated Clips (Starts empty, persisted per user)
  const [clips, setClips] = useState<ViralClip[]>(() => {
    const active = AuthService.getSession();
    return active ? AuthService.getUserClips(active.id) : [];
  });
  
  const [sourceVideoTitle, setSourceVideoTitle] = useState<string>('');

  // Modal States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const [editingClip, setEditingClip] = useState<ViralClip | null>(null);
  const [publishingClips, setPublishingClips] = useState<ViralClip[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // YouTube Channel Selection Modal State
  const [selectableChannels, setSelectableChannels] = useState<ConnectedChannel[] | null>(null);

  // Handle URL Query Params from OAuth Callbacks
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const authSuccess = params.get('auth_success');
      const userParam = params.get('user');

      if (authSuccess === 'true' && userParam) {
        const parsedUser: UserProfile = JSON.parse(decodeURIComponent(userParam));
        handleLoginSuccess(parsedUser);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error('OAuth Callback Parse Error:', e);
    }
  }, []);

  // Sync user session & per-user clips storage
  useEffect(() => {
    if (user) {
      AuthService.saveSession(user);
      AuthService.saveUserClips(user.id, clips);
    }
  }, [user, clips]);

  // Handle User Auth Login / Signup Success (Auto-links YouTube Channel)
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    // If user signed in with Google, check for associated YouTube channels
    if (loggedInUser.authProvider === 'google' || loggedInUser.isGoogleLinked) {
      const channels = loggedInUser.availableYouTubeChannels || [];
      if (channels.length > 1) {
        // Present Channel Selection Screen if multiple YouTube channels exist
        setSelectableChannels(channels);
      } else if (channels.length === 1) {
        loggedInUser.connectedYouTubeChannel = channels[0];
      } else {
        // Fallback default YouTube channel linked to Google profile
        loggedInUser.connectedYouTubeChannel = {
          id: `chan-yt-${loggedInUser.id}`,
          channelId: `UC_${loggedInUser.id}`,
          platform: 'youtube',
          name: `${loggedInUser.name} Shorts`,
          handle: loggedInUser.email ? `@${loggedInUser.email.split('@')[0]}` : '@YouTubeCreator',
          avatar: loggedInUser.avatar,
          subscribers: 'Official Google OAuth Linked',
          connected: true,
          lastSync: 'Authenticated via Google OAuth 2.0'
        };
      }
    }

    setUser(loggedInUser);
    setShowAuthModal(false);
    
    // Load existing clips for this account
    const userSavedClips = AuthService.getUserClips(loggedInUser.id);
    setClips(userSavedClips);
  };

  // Select Channel from Modal
  const handleSelectYouTubeChannel = (channel: ConnectedChannel) => {
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        connectedYouTubeChannel: channel
      };
      setUser(updatedUser);
      AuthService.saveSession(updatedUser);

      // Save to backend selection API
      fetch('http://localhost:3001/api/youtube/select-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, channel })
      }).catch(() => {});
    }
    setSelectableChannels(null);
  };

  // Handle URL & Settings Processing Submission
  const handleStartProcessing = async (url: string, settings: ClipGenerationSettings) => {
    // If not signed in, prompt auth first
    if (!user || !user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(5);
    setProcessingStage('Connecting to YouTube API...');

    try {
      const result = await AIService.analyzeAndGenerateClips(
        url,
        settings,
        (stage, percent) => {
          setProcessingStage(stage);
          setProcessingProgress(percent);
        }
      );

      setSourceVideoTitle(result.sourceVideo.title);
      const updated = [...result.clips, ...clips];
      setClips(updated);
      AuthService.saveUserClips(user.id, updated);
      
      setIsProcessing(false);
      setActiveTab('clips');
    } catch (err) {
      setIsProcessing(false);
    }
  };

  // Save Edited Clip
  const handleSaveClip = (updatedClip: ViralClip) => {
    const updated = clips.map(c => c.id === updatedClip.id ? updatedClip : c);
    setClips(updated);
    if (user) AuthService.saveUserClips(user.id, updated);
    setEditingClip(null);
  };

  // Delete Clip
  const handleDeleteClip = (id: string) => {
    const updated = clips.filter(c => c.id !== id);
    setClips(updated);
    if (user) AuthService.saveUserClips(user.id, updated);
  };

  // Handle Publish Completion
  const handlePublishComplete = (publishedClipIds: string[]) => {
    const updated = clips.map(c => {
      if (publishedClipIds.includes(c.id)) {
        return {
          ...c,
          status: 'published' as const,
          publishedPlatforms: ['youtube', 'instagram'] as any
        };
      }
      return c;
    });
    setClips(updated);
    if (user) AuthService.saveUserClips(user.id, updated);
    setPublishingClips(null);
  };

  // Handle Logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setClips([]);
  };

  const handleLinkGoogle = () => {
    if (user) {
      const updated = AuthService.linkGoogleAccount(user);
      setUser(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-zinc-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      
      {/* Top Header Navbar */}
      <Navbar
        user={user || { id: 'guest', name: 'Guest User', email: '', avatar: '', isLoggedIn: false }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onLinkGoogle={handleLinkGoogle}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16">
        
        {/* Tab 1: Clip Generator Hero */}
        {activeTab === 'generator' && (
          <div className="space-y-8 animate-in fade-in">
            <VideoInputSection
              onStartProcessing={handleStartProcessing}
              isLoading={isProcessing}
            />

            {/* User Generated Clips Grid (Starts empty until user generates) */}
            <div className="pt-4">
              <ClipGrid
                clips={clips}
                onOpenEditor={(clip) => setEditingClip(clip)}
                onOpenPublishModal={(clip) => setPublishingClips([clip])}
                onOpenBatchPublishModal={() => setPublishingClips(clips)}
                onDeleteClip={handleDeleteClip}
                sourceTitle={sourceVideoTitle}
              />
            </div>
          </div>
        )}

        {/* Tab 2: My Clips Library */}
        {activeTab === 'clips' && (
          <div className="animate-in fade-in pt-4">
            <ClipGrid
              clips={clips}
              onOpenEditor={(clip) => setEditingClip(clip)}
              onOpenPublishModal={(clip) => setPublishingClips([clip])}
              onOpenBatchPublishModal={() => setPublishingClips(clips)}
              onDeleteClip={handleDeleteClip}
              sourceTitle={sourceVideoTitle}
            />
          </div>
        )}

        {/* Tab 3: Connected Social Channels Manager */}
        {activeTab === 'channels' && (
          <ChannelManager
            user={user}
            onOpenChannelSelector={(channels) => setSelectableChannels(channels)}
          />
        )}

        {/* Tab 4: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <Dashboard
            clips={clips}
            user={user}
            onOpenEditor={(clip) => setEditingClip(clip)}
            onOpenPublish={(clip) => setPublishingClips([clip])}
          />
        )}

      </main>

      {/* Modals & Overlays */}
      {isProcessing && (
        <ClipProcessingModal
          stage={processingStage}
          progressPercent={processingProgress}
        />
      )}

      {editingClip && (
        <VideoEditorModal
          clip={editingClip}
          onSave={handleSaveClip}
          onClose={() => setEditingClip(null)}
          onOpenPublish={(clip) => { setEditingClip(null); setPublishingClips([clip]); }}
        />
      )}

      {publishingClips && (
        <MultiPublishModal
          clipsToPublish={publishingClips}
          user={user}
          onClose={() => setPublishingClips(null)}
          onPublishComplete={handlePublishComplete}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Multiple YouTube Channel Selection Modal */}
      {selectableChannels && (
        <ChannelSelectionModal
          channels={selectableChannels}
          selectedChannelId={user?.connectedYouTubeChannel?.id || user?.connectedYouTubeChannel?.channelId || null}
          onSelectChannel={handleSelectYouTubeChannel}
          onClose={() => setSelectableChannels(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-zinc-500 glass-panel">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300 font-heading">ShortsForge.AI</span>
            <span>— Real YouTube Shorts & Instagram Reels Clipper & Publisher</span>
          </div>
          <p>© 2026 ShortsForge AI Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
