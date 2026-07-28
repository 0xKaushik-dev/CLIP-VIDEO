import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VideoInputSection } from './components/VideoInputSection';
import { ClipProcessingModal } from './components/ClipProcessingModal';
import { ClipGrid } from './components/ClipGrid';
import { VideoEditorModal } from './components/VideoEditorModal';
import { MultiPublishModal } from './components/MultiPublishModal';
import { ChannelManager } from './components/ChannelManager';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { INITIAL_CLIPS, CURRENT_USER } from './lib/mockData';
import { AIService } from './lib/aiService';
import type { ViralClip, UserProfile, ClipGenerationSettings } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'clips' | 'channels' | 'analytics'>('generator');
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [clips, setClips] = useState<ViralClip[]>(INITIAL_CLIPS);
  const [sourceVideoTitle, setSourceVideoTitle] = useState<string>('How AI Agents Will Build million-dollar SaaS Companies in 2026');

  // Modal States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);

  const [editingClip, setEditingClip] = useState<ViralClip | null>(null);
  const [publishingClips, setPublishingClips] = useState<ViralClip[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle URL & Settings Processing Submission (Unlimited generation!)
  const handleStartProcessing = async (url: string, settings: ClipGenerationSettings) => {
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
      setClips([...result.clips, ...clips]);
      setIsProcessing(false);
      setActiveTab('clips');
    } catch (err) {
      setIsProcessing(false);
    }
  };

  // Save Edited Clip
  const handleSaveClip = (updatedClip: ViralClip) => {
    setClips(clips.map(c => c.id === updatedClip.id ? updatedClip : c));
    setEditingClip(null);
  };

  // Delete Clip
  const handleDeleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
  };

  // Handle Publish Completion
  const handlePublishComplete = (publishedClipIds: string[]) => {
    setClips(clips.map(c => {
      if (publishedClipIds.includes(c.id)) {
        return {
          ...c,
          status: 'published',
          publishedPlatforms: ['youtube', 'instagram']
        };
      }
      return c;
    }));
    setPublishingClips(null);
  };

  // Handle User Auth Login / Logout
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false, name: 'Guest User', email: '' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-zinc-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      
      {/* Top Header Navbar */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
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

            {/* Quick Preview Grid below generator */}
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
          <ChannelManager />
        )}

        {/* Tab 4: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <Dashboard
            clips={clips}
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

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-zinc-500 glass-panel">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300 font-heading">ShortsForge.AI</span>
            <span>— Unlimited YouTube Shorts & Instagram Reels Clipper & Publisher</span>
          </div>
          <p>© 2026 ShortsForge AI Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
