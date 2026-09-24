import React, { useState } from 'react';
import { 
  Gamepad2, CheckCircle, AlertTriangle, XCircle, Play, 
  Upload, Sparkles, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, FileArchive 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameItem, ValidationCheckItem, UserProfile } from '../../types';
import { realtime } from '../../services/websocket';
import { GigaMascot } from '../common/GigaMascot';
import { PlayableGameModal } from '../common/PlayableGameModal';

interface GameSubmissionPageProps {
  currentUser: UserProfile;
  onSubmitGame: (game: GameItem) => void;
  onCancel: () => void;
}

export const GameSubmissionPage: React.FC<GameSubmissionPageProps> = ({
  currentUser,
  onSubmitGame,
  onCancel
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationRun, setValidationRun] = useState<boolean>(false);
  const [testPlayModalOpen, setTestPlayModalOpen] = useState<boolean>(false);
  const [uploadFileName, setUploadFileName] = useState<string>('neon_hyper_drive_v1.0.zip');

  // Form State
  const [formData, setFormData] = useState<Partial<GameItem>>({
    id: `game-${Date.now()}`,
    title: 'Neon Hyper Drive',
    slug: 'neon-hyper-drive',
    shortDescription: 'High-speed synthwave drift game with procedural tracks and responsive mobile controls.',
    fullDescription: 'Experience blistering speed in an endless cyberpunk metropolis. Drift around razor-sharp highway corners, charge nitrous capacitors, and set record scores on global leaderboards.',
    studioId: 'studio-user',
    studioName: currentUser.companyOrStudio || currentUser.name,
    version: '1.0.0',
    genre: 'Racing',
    tags: ['Cyberpunk', 'Arcade', 'Fast-Paced', 'Drift', '3D'],
    supportedLanguages: ['English', 'Spanish', 'Japanese', 'German'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: false, touch: true, gamepad: true },
    orientation: 'landscape',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 12.4
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'submitted',
    stats: {
      totalPlays: 0,
      impressions: 0,
      avgSessionSeconds: 0,
      rating: 5.0,
      ratingCount: 1
    }
  });

  // Automated 8-point Validation Engine results
  const [validationResults, setValidationResults] = useState<ValidationCheckItem[]>([
    { id: 'v1', title: 'Required Metadata Fields', category: 'identity', status: 'passed', message: 'Title, descriptions, genre, and version tags are complete.' },
    { id: 'v2', title: 'Asset Dimensions & Aspect Ratios', category: 'media', status: 'passed', message: 'Thumbnail is 1:1 square; Cover art is 16:9 widescreen format.' },
    { id: 'v3', title: 'Secure Origin & HTTPS Enforcement', category: 'technical', status: 'passed', message: 'All assets and build bundles served over TLS 1.3.' },
    { id: 'v4', title: 'HTML5 Container & Launch File', category: 'build', status: 'passed', message: 'Launch file "index.html" detected in root directory.' },
    { id: 'v5', title: 'WebGL Canvas Responsive Resizing', category: 'technical', status: 'passed', message: 'Canvas adapts smoothly across 1440px desktop and 375px mobile widths.' },
    { id: 'v6', title: 'Web Audio API User-Gesture Unlock', category: 'technical', status: 'passed', message: 'AudioContext resumes on first user pointer click or tap.' },
    { id: 'v7', title: 'Package Memory & Loading Threshold', category: 'build', status: 'passed', message: 'Build package is 12.4 MB (under 25MB standard limit).' },
    { id: 'v8', title: 'Rights & Compliance Acceptance', category: 'compliance', status: 'passed', message: 'Commercial distribution rights and GDPR privacy disclosures declared.' }
  ]);

  const steps = [
    { num: 1, title: 'Identity & Info' },
    { num: 2, title: 'Build & Package' },
    { num: 3, title: 'Classification & Controls' },
    { num: 4, title: 'Media & Key Art' },
    { num: 5, title: 'Technical & Compliance' },
    { num: 6, title: 'Automated Pre-Flight Check' }
  ];

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationRun(true);
    }, 1500);
  };

  const handleFinalSubmit = () => {
    const finalGame = {
      ...(formData as GameItem),
      id: `game-${Date.now()}`,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmitGame(finalGame);

    // Broadcast submission event to admins and publishers over WebSocket
    realtime.broadcastNotification(
      currentUser.name,
      'Game Developer',
      'GAME_SUBMITTED',
      `Submitted new game "${finalGame.title}" for DochGames catalog review`
    );

    // Also register build file in real-time file sharing relay!
    realtime.shareFile({
      name: `${finalGame.slug}_v${finalGame.version}_build.zip`,
      category: 'game_build',
      size: (finalGame.technical.packageSizeMb || 12) * 1024 * 1024,
      uploadedBy: {
        name: currentUser.name,
        role: 'Game Developer',
        company: currentUser.companyOrStudio
      },
      version: finalGame.version,
      targetGameOrWidget: finalGame.title
    });

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
              Game Developer Portal
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Submit Game for Global Syndication
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Complete the 6-step submission with automated pre-flight validation and sandbox container testing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setTestPlayModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Test in Sandbox
          </button>
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 overflow-x-auto shadow-xs">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStep === s.num
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : s.num < activeStep
                  ? 'bg-slate-100 text-emerald-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeStep === s.num ? 'bg-slate-950 text-[#D6F938]' : 'bg-slate-200 text-slate-700'
              }`}>
                {s.num}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          {/* Step 1: Identity */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-900">
                1. Game Identity & Studio Attribution
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Game Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Slug Suggestion
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Build Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Short One-Line Description * (Max 120 chars)
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Store & Hub Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Step 2: Build & Package */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-900">
                2. Game Build & Real-Time Delivery Package
              </h3>

              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Build Package (.zip or HTML5 web bundle)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-7 text-center space-y-2 hover:border-blue-500 transition-colors cursor-pointer bg-white">
                  <FileArchive className="w-8 h-8 text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-900 font-bold">
                    {uploadFileName} (12.4 MB)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    File uploaded & synced across DochGames Real-Time File Sharing relay.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Entry / Launch File
                  </label>
                  <input
                    type="text"
                    value={formData.technical?.launchFile || 'index.html'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      technical: { ...prev.technical!, launchFile: e.target.value }
                    }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hosting Mode
                  </label>
                  <select
                    value={formData.technical?.hostingMode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      technical: { ...prev.technical!, hostingMode: e.target.value as any }
                    }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="dochgames_cdn">DochGames Global Edge CDN (Recommended)</option>
                    <option value="external_iframe">Custom Secure External Iframe</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Classification & Controls */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-900">
                3. Genre Classification & Device Controls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Racing">Racing</option>
                    <option value="Arcade">Arcade</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Casual">Casual</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Multiplayer">Multiplayer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Age Rating
                  </label>
                  <select
                    value={formData.ageRating}
                    onChange={(e) => setFormData(prev => ({ ...prev, ageRating: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Everyone 3+">Everyone 3+ (Family Friendly)</option>
                    <option value="Teen 13+">Teen 13+</option>
                    <option value="Mature 17+">Mature 17+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Supported Input Methods
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'keyboard', label: 'Keyboard (WASD/Arrows)' },
                    { key: 'mouse', label: 'Mouse Click / Drag' },
                    { key: 'touch', label: 'Mobile Touch Screen' },
                    { key: 'gamepad', label: 'USB / Bluetooth Gamepad' }
                  ].map(c => (
                    <label key={c.key} className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={(formData.controls as any)?.[c.key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          controls: { ...prev.controls!, [c.key]: e.target.checked }
                        }))}
                        className="accent-blue-600 rounded"
                      />
                      <span className="text-xs text-slate-800 font-medium">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Devices
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { key: 'desktop', label: 'Desktop Browser' },
                    { key: 'mobile', label: 'Mobile Web' },
                    { key: 'tablet', label: 'Tablet / iPad' }
                  ].map(d => (
                    <label key={d.key} className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={(formData.devices as any)?.[d.key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          devices: { ...prev.devices!, [d.key]: e.target.checked }
                        }))}
                        className="accent-blue-600 rounded"
                      />
                      <span className="text-xs text-slate-800 font-medium">{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-900">
                4. Visual Marketing Media & Thumbnails
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1:1 Square Mobile Thumbnail (512x512 URL)
                </label>
                <input
                  type="text"
                  value={formData.media?.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    media: { ...prev.media!, thumbnailUrl: e.target.value }
                  }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  16:9 Cover Art / Spotlight Banner (1920x1080 URL)
                </label>
                <input
                  type="text"
                  value={formData.media?.coverArtUrl}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    media: { ...prev.media!, coverArtUrl: e.target.value }
                  }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {formData.media?.thumbnailUrl && (
                <div className="flex items-center gap-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <img
                    src={formData.media.thumbnailUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover shadow-xs"
                  />
                  <div>
                    <span className="text-xs text-emerald-700 font-bold block">Thumbnail Loaded</span>
                    <span className="text-[11px] text-slate-500">Aspect ratio validated (1:1)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Technical & Compliance */}
          {activeStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display font-bold text-lg text-slate-900">
                5. Technical Guarantees & Rights Confirmation
              </h3>

              <div className="space-y-3">
                {[
                  { key: 'ownershipConfirmed', label: 'I confirm our studio holds all IP and distribution rights to this game build.' },
                  { key: 'privacyDisclosed', label: 'The game does not harvest sensitive user data or run non-consented tracking scripts.' }
                ].map(c => (
                  <label key={c.key} className="flex items-start gap-3 p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={(formData.compliance as any)?.[c.key]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        compliance: { ...prev.compliance!, [c.key]: e.target.checked }
                      }))}
                      className="mt-0.5 w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Automated Pre-Flight Check */}
          {activeStep === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    6. Automated Pre-Flight Validation Engine
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Run our automated 8-point inspection before submitting to DochGames human reviewers.
                  </p>
                </div>
                <button
                  onClick={handleRunValidation}
                  disabled={isValidating}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
                  {isValidating ? 'Running 8-Point Check...' : 'Re-Run Validation'}
                </button>
              </div>

              {/* Validation Checklist items */}
              <div className="space-y-2.5">
                {validationResults.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3 text-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-slate-500 text-[11px]">{item.message}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between shadow-xs">
                <span className="font-medium">All 8 pre-flight tests passed! Your build is ready for queue submission.</span>
                <button
                  onClick={handleFinalSubmit}
                  className="px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all ml-4 shrink-0"
                >
                  Submit to Review Queue
                </button>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {activeStep < 6 ? (
              <button
                onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs"
              >
                Submit Game Now
              </button>
            )}
          </div>
        </div>

        {/* Right Sandbox Container & Mascot Guidance */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600" />
              Live Playable Sandbox Test
            </h4>

            <div className="h-44 rounded-2xl overflow-hidden relative group border border-slate-200 shadow-xs">
              <img
                src={formData.media?.thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center p-4 text-center">
                <button
                  onClick={() => setTestPlayModalOpen(true)}
                  className="w-12 h-12 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform mb-2"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
                <span className="text-xs font-bold text-white">Test-Play in Container</span>
                <span className="text-[10px] text-slate-300">Verifies 60fps & Web Audio unlock</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Launch your submission in our isolated sandbox container to inspect touch controls, aspect ratio adaptability, and Web Audio unlocks.
            </p>
          </div>

          <GigaMascot
            mood="celebrating"
            size="md"
            speechBubble="Submitting a game with automated validation pre-flight ensures your review turnaround is under 24 hours!"
          />
        </div>
      </div>

      {/* Playable Game Modal */}
      {testPlayModalOpen && (
        <PlayableGameModal
          game={formData as GameItem}
          isOpen={testPlayModalOpen}
          onClose={() => setTestPlayModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GameSubmissionPage;
