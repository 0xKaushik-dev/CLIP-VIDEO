import React, { useState } from 'react';
import type { ViralClip, CaptionStyle, FaceTrackingMode, TranscriptWord } from '../types';
import { VideoCanvasPlayer } from './VideoCanvasPlayer';
import { DEFAULT_CAPTION_STYLES } from '../lib/mockData';
import { X, Type, Sliders, Music, UserCheck, Check, Save, Share2, Wand2, Plus, Trash2, Eye, EyeOff, Mic } from 'lucide-react';

interface VideoEditorModalProps {
  clip: ViralClip;
  onSave: (updatedClip: ViralClip) => void;
  onClose: () => void;
  onOpenPublish: (clip: ViralClip) => void;
}

export const VideoEditorModal: React.FC<VideoEditorModalProps> = ({
  clip,
  onSave,
  onClose,
  onOpenPublish
}) => {
  const [activeTab, setActiveTab] = useState<'captions' | 'styles' | 'camera' | 'audio'>('styles');
  
  // Local editable state
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>({
    ...clip.captionStyle,
    showCaptions: clip.captionStyle.showCaptions !== false
  });
  const [faceMode, setFaceMode] = useState<FaceTrackingMode>(clip.faceTrackingMode);
  const [transcript, setTranscript] = useState<TranscriptWord[]>([...clip.transcript]);
  const [bgMusic, setBgMusic] = useState(clip.bgMusicTrack || 'energetic-trap');
  const [musicVol, setMusicVol] = useState(clip.bgMusicVolume || 0.2);
  const [removeSilence, setRemoveSilence] = useState(clip.removeSilence);
  const [autoZoom, setAutoZoom] = useState(clip.autoZoom);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New word form state
  const [newWordText, setNewWordText] = useState('');
  const [newWordStart, setNewWordStart] = useState('1.0');

  // Apply Caption Preset
  const applyPreset = (presetKey: keyof typeof DEFAULT_CAPTION_STYLES) => {
    setCaptionStyle({
      ...DEFAULT_CAPTION_STYLES[presetKey],
      showCaptions: captionStyle.showCaptions
    });
  };

  // Word Editor Handlers
  const handleWordChange = (id: string, newText: string) => {
    setTranscript(transcript.map(w => w.id === id ? { ...w, word: newText } : w));
  };

  const handleDeleteWord = (id: string) => {
    setTranscript(transcript.filter(w => w.id !== id));
  };

  const handleClearAllCaptions = () => {
    setTranscript([]);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordText.trim()) return;
    
    const startTimeNum = parseFloat(newWordStart) || 0;
    const newWordItem: TranscriptWord = {
      id: `word-new-${Date.now()}`,
      word: newWordText.trim(),
      start: startTimeNum,
      end: startTimeNum + 0.4,
      isKeyword: true,
      emoji: '✨'
    };

    const updated = [...transcript, newWordItem].sort((a, b) => a.start - b.start);
    setTranscript(updated);
    setNewWordText('');
  };

  // Toggle Captions ON / OFF
  const toggleCaptionsVisibility = () => {
    setCaptionStyle({
      ...captionStyle,
      showCaptions: !captionStyle.showCaptions
    });
  };

  // Handle Save
  const handleSave = () => {
    const updated: ViralClip = {
      ...clip,
      captionStyle,
      faceTrackingMode: faceMode,
      transcript,
      bgMusicTrack: bgMusic,
      bgMusicVolume: musicVol,
      removeSilence,
      autoZoom,
      showCaptions: captionStyle.showCaptions
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in overflow-y-auto">
      <div className="glass-panel border border-white/15 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">Interactive Clip Studio & Captions Editor</h2>
              <p className="text-xs text-zinc-400">Customize captions, add/remove spoken words, face tracking & audio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>

            <button
              onClick={() => { handleSave(); onOpenPublish({ ...clip, captionStyle, faceTrackingMode: faceMode, transcript }); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Publish</span>
            </button>

            <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left 9:16 Video Player | Right Editing Tabs */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: 9:16 Live Canvas Preview */}
          <div className="lg:col-span-5 bg-zinc-950 p-6 flex flex-col items-center justify-center border-r border-white/10 overflow-y-auto">
            <div className="w-full max-w-[280px]">
              <VideoCanvasPlayer
                clip={{ ...clip, captionStyle, faceTrackingMode: faceMode, transcript }}
                customCaptionStyle={captionStyle}
                customFaceMode={faceMode}
                showControls={true}
                onToggleCaptions={toggleCaptionsVisibility}
              />
            </div>
          </div>

          {/* Right Column: Customization Studio Controls */}
          <div className="lg:col-span-7 flex flex-col bg-zinc-900/60 overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-zinc-950/40 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('styles')}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'styles' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <Type className="w-4 h-4" /> Caption Styles
              </button>

              <button
                onClick={() => setActiveTab('captions')}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'captions' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <Wand2 className="w-4 h-4" /> Add / Remove Words
              </button>

              <button
                onClick={() => setActiveTab('camera')}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'camera' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Face Tracking
              </button>

              <button
                onClick={() => setActiveTab('audio')}
                className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'audio' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <Music className="w-4 h-4" /> Audio & FX
              </button>
            </div>

            {/* Tab 1: Caption Preset Styles & Show/Hide Switch */}
            {activeTab === 'styles' && (
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                
                {/* Global Caption ON/OFF Switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/15 shadow">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Mic className="w-4 h-4 text-purple-400" />
                      Burned Subtitles & Captions
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Toggle whether captions are displayed on the video
                    </p>
                  </div>

                  <button
                    onClick={toggleCaptionsVisibility}
                    className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 shadow ${
                      captionStyle.showCaptions
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {captionStyle.showCaptions ? (
                      <>
                        <Eye className="w-4 h-4" /> Captions ENABLED
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" /> Captions REMOVED
                      </>
                    )}
                  </button>
                </div>

                {captionStyle.showCaptions && (
                  <>
                    {/* Preset Style Cards */}
                    <div className="space-y-3">
                      <label className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] block">
                        Choose Caption Preset
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { key: 'tiktok', name: 'TikTok Pop', desc: 'Bold Yellow / Black background' },
                          { key: 'shorts', name: 'Shorts Neon', desc: 'Neon Cyan & Bebas font' },
                          { key: 'reels', name: 'Reels Pill', desc: 'Minimal Pink & dark pill' },
                          { key: 'karaoke', name: 'Karaoke Glow', desc: 'Active word purple glow' }
                        ].map((p) => {
                          const isSelected = captionStyle.preset === p.key;
                          return (
                            <button
                              key={p.key}
                              onClick={() => applyPreset(p.key as any)}
                              className={`p-3 rounded-2xl border text-left space-y-1 transition ${
                                isSelected
                                  ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/40 shadow-lg'
                                  : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                              }`}
                            >
                              <div className="font-bold text-xs flex items-center justify-between">
                                <span>{p.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                              </div>
                              <p className="text-[10px] text-zinc-500 leading-tight">{p.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Family & Active Color Pickers */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-bold text-zinc-300 text-[11px] block">Font Family</label>
                        <select
                          value={captionStyle.fontFamily}
                          onChange={(e) => setCaptionStyle({ ...captionStyle, fontFamily: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-zinc-950 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="Montserrat, sans-serif">Montserrat (TikTok Style)</option>
                          <option value="Bebas Neue, sans-serif">Bebas Neue (Shorts Heavy)</option>
                          <option value="Outfit, sans-serif">Outfit Modern</option>
                          <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                          <option value="Permanent Marker, cursive">Permanent Marker (Handwritten)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-zinc-300 text-[11px] block">Active Spoken Word Color</label>
                        <div className="flex items-center gap-2">
                          {['#facc15', '#06b6d4', '#ec4899', '#a855f7', '#10b981', '#ffffff'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setCaptionStyle({ ...captionStyle, activeWordColor: color })}
                              className={`w-7 h-7 rounded-full border border-white/20 transition ${
                                captionStyle.activeWordColor === color ? 'ring-2 ring-white scale-110' : ''
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Font Size & Y-Position Sliders */}
                    <div className="space-y-4 pt-2 border-t border-white/10">
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Font Size</span>
                          <span className="font-mono text-purple-400">{captionStyle.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="52"
                          value={captionStyle.fontSize}
                          onChange={(e) => setCaptionStyle({ ...captionStyle, fontSize: Number(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Vertical Placement (Y Offset)</span>
                          <span className="font-mono text-purple-400">{captionStyle.offsetY}%</span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="85"
                          value={captionStyle.offsetY}
                          onChange={(e) => setCaptionStyle({ ...captionStyle, offsetY: Number(e.target.value) })}
                          className="w-full accent-purple-500"
                        />
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Tab 2: Add / Edit / Remove Spoken Words */}
            {activeTab === 'captions' && (
              <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                
                {/* Accuracy Badge & Clear All */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">Vocal Transcript ({transcript.length} words)</h3>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                        Whisper AI Vocal Sync: 99.4%
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-0.5">Edit text, add new spoken words, or remove words</p>
                  </div>

                  {transcript.length > 0 && (
                    <button
                      onClick={handleClearAllCaptions}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove All Captions
                    </button>
                  )}
                </div>

                {/* Add New Word Bar */}
                <form onSubmit={handleAddWord} className="p-3 rounded-2xl bg-zinc-950 border border-white/15 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type new spoken word to add..."
                    value={newWordText}
                    onChange={(e) => setNewWordText(e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/10 px-2 py-1 text-white font-medium focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <span>At:</span>
                    <input
                      type="text"
                      value={newWordStart}
                      onChange={(e) => setNewWordStart(e.target.value)}
                      className="w-12 bg-zinc-900 border border-white/10 rounded px-1 py-0.5 text-center text-purple-300 font-mono"
                    />
                    <span>s</span>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Word
                  </button>
                </form>

                {/* Words List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-2">
                  {transcript.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-white/10 hover:border-purple-500/40 transition group"
                    >
                      <span className="text-[10px] font-mono text-purple-400 w-8">
                        {w.start.toFixed(1)}s
                      </span>
                      <input
                        type="text"
                        value={w.word}
                        onChange={(e) => handleWordChange(w.id, e.target.value)}
                        className="flex-1 bg-transparent border-b border-white/10 focus:border-purple-500 px-1 py-0.5 text-white font-semibold focus:outline-none"
                      />
                      {w.emoji && <span className="text-base">{w.emoji}</span>}
                      <button
                        type="button"
                        onClick={() => handleDeleteWord(w.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete word"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 3: Face Tracking Mode Selector */}
            {activeTab === 'camera' && (
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm">AI Face Tracking & Camera Crop Mode</h3>
                  <p className="text-zinc-400">
                    Automatically repositions the 9:16 vertical viewport frame on active speakers in real time.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { mode: 'auto', title: 'AI Dynamic Focus', desc: 'Auto tracks single & dual speakers automatically' },
                    { mode: 'center', title: 'Center Speaker', desc: 'Fixed viewport on center speaker' },
                    { mode: 'left', title: 'Left Speaker', desc: 'Focused on host on left side' },
                    { mode: 'right', title: 'Right Speaker', desc: 'Focused on guest on right side' },
                    { mode: 'split', title: 'Split Screen View', desc: 'Top/Bottom dual camera split view' }
                  ].map((item) => {
                    const isSelected = faceMode === item.mode;
                    return (
                      <div
                        key={item.mode}
                        onClick={() => setFaceMode(item.mode as any)}
                        className={`p-4 rounded-2xl border cursor-pointer space-y-2 transition ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/40'
                            : 'bg-zinc-950/60 border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs text-white">
                          <span>{item.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                        </div>
                        <p className="text-[11px] text-zinc-400">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Audio & FX */}
            {activeTab === 'audio' && (
              <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-white text-sm block">Background Music Track</label>
                    <select
                      value={bgMusic}
                      onChange={(e) => setBgMusic(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="none">None (Original Audio Only)</option>
                      <option value="energetic-trap">Energetic Trap Beats (Viral TikTok)</option>
                      <option value="lofi-chill">Lo-Fi Study Chill Beats</option>
                      <option value="cinematic-epic">Cinematic Epic Atmosphere</option>
                    </select>
                  </div>

                  {bgMusic !== 'none' && (
                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-zinc-300">
                        <span>Background Music Volume</span>
                        <span className="font-mono text-purple-400">{Math.round(musicVol * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={musicVol}
                        onChange={(e) => setMusicVol(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-white/10">
                    <div>
                      <span className="font-bold text-white block">Auto Silence Remover</span>
                      <span className="text-[10px] text-zinc-400">Trim dead pause gaps over 0.4 seconds</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={removeSilence}
                      onChange={(e) => setRemoveSilence(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-white/10">
                    <div>
                      <span className="font-bold text-white block">Auto Zoom Punch-In</span>
                      <span className="text-[10px] text-zinc-400">Dynamic zoom-ins on key emotional punchlines</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoZoom}
                      onChange={(e) => setAutoZoom(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
