import React, { useState, useRef } from 'react';
import { 
  Sparkles, Check, ChevronRight, ChevronLeft, Sliders, Layout, 
  Code, Eye, Copy, RefreshCw, CheckCircle, Globe, Shield, Play,
  Upload, Image as ImageIcon, Trash2, Monitor, Smartphone, Maximize2,
  Layers, Move, Info, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WidgetConfig, GameItem, PublisherProperty, WidgetLayoutType, WidgetPlacement } from '../../types';
import { LiveSitePlacementMock } from '../widgets/LiveSitePlacementMock';
import { DochWidgetRenderer } from '../widgets/DochWidgetRenderer';
import { GigaMascot } from '../common/GigaMascot';

interface WidgetBuilderPageProps {
  properties: PublisherProperty[];
  games: GameItem[];
  existingWidget?: WidgetConfig | null;
  onSaveWidget: (widget: WidgetConfig) => void;
  onPlayGame: (game: GameItem) => void;
  onNavigateToDeployment?: (widget: WidgetConfig) => void;
}

const SAMPLE_SCREENSHOTS = [
  {
    id: 'gamezone',
    name: 'GameZone Daily (Editorial Review)',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    type: 'Website'
  },
  {
    id: 'techpulse',
    name: 'TechPulse Digital Magazine',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    type: 'Website'
  },
  {
    id: 'mobileapp',
    name: 'ArcadePulse Mobile App Feed',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    type: 'App'
  },
  {
    id: 'cyberhub',
    name: 'CyberZone Dark Gaming Portal',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    type: 'Portal'
  }
];

export const WidgetBuilderPage: React.FC<WidgetBuilderPageProps> = ({
  properties,
  games,
  existingWidget,
  onSaveWidget,
  onPlayGame,
  onNavigateToDeployment
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  // Preview state in right sticky column
  const [previewMode, setPreviewMode] = useState<'screenshot' | 'standalone'>('screenshot');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Widget Configuration State
  const [widgetState, setWidgetState] = useState<WidgetConfig>(() => {
    if (existingWidget) return existingWidget;
    const defaultProp = properties[0];
    return {
      id: `wdg-${Date.now()}`,
      name: 'Trending Gaming Slit Reel',
      propertyId: defaultProp?.id || 'prop-01',
      propertyName: defaultProp?.name || 'My Connected Property',
      placement: 'header',
      targetPageUrl: defaultProp ? `https://${defaultProp.domain}/reviews` : 'https://gamezone-daily.com/articles/cyberpunk',
      customScreenshotUrl: undefined,
      customScreenshotName: undefined,
      useScreenshotPreview: true,
      screenshotPlacement: 'header',
      gameSource: 'trending',
      selectedCategory: 'Racing',
      selectedGameIds: ['game-001', 'game-002', 'game-003', 'game-004'],
      gameCount: 4,
      layout: 'expandable_slit_reel',
      behaviour: {
        enableSwipe: true,
        showArrows: true,
        autoplayPreview: true,
        snapToCard: true,
        loop: true,
        ctaAction: 'inline_modal'
      },
      appearance: {
        theme: 'navy',
        primaryColor: '#129BFF',
        cornerRadius: 16,
        cardSpacing: 12,
        showDochBranding: true,
        sizePreset: 'full_width',
        widthMode: 'responsive_full',
        customWidth: 720,
        customHeight: 0,
        scale: 1
      },
      advanced: {
        lazyLoading: true,
        styleIsolation: true,
        cmpConsentRequired: true
      },
      status: 'published',
      version: 1,
      publishedVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        impressions: 0,
        clicks: 0,
        gameStarts: 0,
        ctr: 0
      }
    };
  });

  const selectedProperty = properties.find(p => p.id === widgetState.propertyId) || properties[0];

  const stages = [
    { num: 1, title: 'Property & Page' },
    { num: 2, title: 'Placement Slot' },
    { num: 3, title: 'Game Content' },
    { num: 4, title: 'Layout Style' },
    { num: 5, title: 'Behavior' },
    { num: 6, title: 'Appearance & Size' },
    { num: 7, title: 'Live Context Preview' },
    { num: 8, title: 'Publish & Embed' }
  ];

  const layoutOptions: Array<{ type: WidgetLayoutType; name: string; desc: string }> = [
    { type: 'expandable_slit_reel', name: 'Expandable Slit Reel', desc: 'Sleek horizontal slit with hover micro-expansions' },
    { type: 'coverflow', name: '3D Coverflow Reel', desc: 'Smooth carousel with 3D perspective and center focus' },
    { type: 'horizontal_stacked', name: 'Horizontal Stacked', desc: 'Scrollable horizontal cards with quick play badges' },
    { type: 'sidebar_mini_reel', name: 'Sidebar Mini Reel', desc: 'Compact vertical layout built for sidebars and rail widgets' },
    { type: 'featured_filmstrip', name: 'Featured + Filmstrip', desc: 'Large spotlight hero with supporting thumbnail strip' },
    { type: 'overlapping_card_deck', name: 'Overlapping Card Deck', desc: 'Fan-deck layout with fluid hover spreading' },
    { type: 'compact_grid', name: 'Responsive 4-Grid', desc: 'Classic multi-column gaming grid with clean meta' }
  ];

  const placementOptions: Array<{ key: WidgetPlacement; label: string; desc: string }> = [
    { key: 'header', label: 'Header Banner', desc: 'Pinned below site navbar or above main headline' },
    { key: 'in_content', label: 'In-Content Editorial', desc: 'Inserted between article paragraphs for high engagement' },
    { key: 'sidebar', label: 'Sidebar Rail', desc: 'Sticky or inline column next to editorial reading flow' },
    { key: 'below_content', label: 'Below Content', desc: 'Positioned at the end of article as a discovery carousel' },
    { key: 'custom', label: 'Custom CSS Selector', desc: 'Inject into any custom DOM target or modal container' }
  ];

  // File Upload Handlers
  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setWidgetState(prev => ({
        ...prev,
        customScreenshotUrl: dataUrl,
        customScreenshotName: file.name,
        useScreenshotPreview: true
      }));
      setPreviewMode('screenshot');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSampleScreenshot = (sample: typeof SAMPLE_SCREENSHOTS[0]) => {
    setWidgetState(prev => ({
      ...prev,
      customScreenshotUrl: sample.url,
      customScreenshotName: sample.name,
      useScreenshotPreview: true
    }));
    setPreviewMode('screenshot');
  };

  const handleClearScreenshot = () => {
    setWidgetState(prev => ({
      ...prev,
      customScreenshotUrl: undefined,
      customScreenshotName: undefined
    }));
    setPreviewMode('standalone');
  };

  const handlePublish = (andDeploy = false) => {
    const updated = {
      ...widgetState,
      status: 'published' as const,
      publishedVersion: widgetState.version,
      updatedAt: new Date().toISOString()
    };
    setWidgetState(updated);
    onSaveWidget(updated);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (andDeploy && onNavigateToDeployment) {
      onNavigateToDeployment(updated);
    }
  };

  const handleTestDeployment = () => {
    setTestResult('testing');
    setTimeout(() => {
      setTestResult('success');
    }, 1200);
  };

  const publisherKey = selectedProperty?.publisherKey || 'pub_live_sample_key_9921';
  const embedSnippet = `<script 
  src="https://cdn.dochgames.com/v1/widget.js" 
  data-publisher-key="${publisherKey}" 
  data-widget-id="${widgetState.id}" 
  data-layout="${widgetState.layout}"
  async>
</script>
<div id="doch-widget-${widgetState.id}"></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const hasScreenshot = Boolean(widgetState.customScreenshotUrl);
  const showScreenshotInPreview = hasScreenshot && previewMode === 'screenshot' && widgetState.useScreenshotPreview !== false;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D6F938] text-slate-950 border border-[#c4e82b]">
              WIDGET STUDIO v1.4
            </span>
            <span className="text-xs text-slate-500">· Property: {selectedProperty?.name}</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Interactive Widget Creator & Syndication Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build high-engagement instant browser game reels and seamlessly syndicate them to your host properties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveStage(7)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            Full Context Preview
          </button>
          <button
            onClick={() => handlePublish(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Save & Deploy →
          </button>
        </div>
      </div>

      {/* Stepper Navigation Progress Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl md:rounded-full p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-max gap-1.5 px-1">
          {stages.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStage(st.num)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeStage === st.num
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : activeStage > st.num
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeStage === st.num
                  ? 'bg-slate-950 text-[#D6F938]'
                  : activeStage > st.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {activeStage > st.num ? <Check className="w-3 h-3" /> : st.num}
              </span>
              <span>{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          
          {/* Stage 1: Property & Page (with screenshot upload) */}
          {activeStage === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  1. Select Connected Property & Host Page
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Choose the verified website or application, and optionally upload a screenshot of your site to see live previews in-situ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Connected Property
                </label>
                <select
                  value={widgetState.propertyId}
                  onChange={(e) => {
                    const prop = properties.find(p => p.id === e.target.value);
                    if (prop) {
                      setWidgetState(prev => ({
                        ...prev,
                        propertyId: prop.id,
                        propertyName: prop.name
                      }));
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.domain}) · Verified
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Widget Friendly Name
                </label>
                <input
                  type="text"
                  value={widgetState.name}
                  onChange={(e) => setWidgetState(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Page URL or Path Pattern
                </label>
                <input
                  type="text"
                  value={widgetState.targetPageUrl}
                  onChange={(e) => setWidgetState(prev => ({ ...prev, targetPageUrl: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  e.g. https://yoursite.com/gaming/* or homepage root
                </span>
              </div>

              {/* Host Site Screenshot Upload Section */}
              <div className="pt-2 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      Site or App Screenshot / Mockup
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D6F938] text-slate-950 font-bold border border-[#c4e82b]">
                        Live Preview Mode
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload an image or screenshot of your website or app. The live preview will render your widget embedded directly on your uploaded image!
                    </p>
                  </div>
                  {hasScreenshot && (
                    <button
                      onClick={handleClearScreenshot}
                      className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                {/* If already has uploaded screenshot */}
                {hasScreenshot ? (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 relative">
                        <img
                          src={widgetState.customScreenshotUrl}
                          alt="Uploaded Site Screenshot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {widgetState.customScreenshotName || 'Uploaded Site Screenshot'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 font-bold shrink-0">
                            Active in Preview
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Live preview on the right is now rendering directly on your uploaded host page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-colors shrink-0"
                      >
                        Change
                      </button>
                    </div>

                    {/* Toggle and Placement Overlay options */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={widgetState.useScreenshotPreview !== false}
                          onChange={(e) => {
                            setWidgetState(prev => ({ ...prev, useScreenshotPreview: e.target.checked }));
                            setPreviewMode(e.target.checked ? 'screenshot' : 'standalone');
                          }}
                          className="w-4 h-4 accent-blue-600 rounded"
                        />
                        <span className="text-[11px] font-medium">Use uploaded screenshot for live widget preview</span>
                      </label>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span>Overlay slot:</span>
                        <select
                          value={widgetState.placement}
                          onChange={(e) => setWidgetState(prev => ({ ...prev, placement: e.target.value as any }))}
                          className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs text-slate-800 shadow-xs"
                        >
                          <option value="header">Top Header Banner</option>
                          <option value="in_content">Mid-Content Editorial</option>
                          <option value="sidebar">Right Sidebar Rail</option>
                          <option value="below_content">Bottom Strip</option>
                          <option value="custom">Custom DOM Slot</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Dropzone / Upload Area */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      isDraggingFile 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">
                      Click to upload site screenshot or drag & drop here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports PNG, JPG, or WebP. The live widget will be positioned directly on your screenshot!
                    </p>
                  </div>
                )}

                {/* Instant Sample Presets */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    Or test immediately with a sample site/app layout:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_SCREENSHOTS.map(sample => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSampleScreenshot(sample)}
                        className={`p-2 rounded-2xl border text-left transition-all ${
                          widgetState.customScreenshotUrl === sample.url
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="h-10 rounded-xl overflow-hidden mb-1.5 bg-slate-200">
                          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] font-bold truncate leading-tight">{sample.name}</div>
                        <div className="text-[9px] text-blue-600 font-mono mt-0.5">{sample.type} Mockup</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2: Placement Slot */}
          {activeStage === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  2. Choose Host Page Placement
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Select where the widget container will be inserted on your host template.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {placementOptions.map(p => (
                  <div
                    key={p.key}
                    onClick={() => setWidgetState(prev => ({ ...prev, placement: p.key }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      widgetState.placement === p.key
                        ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-500/20 text-slate-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1 text-slate-900">{p.label}</div>
                    <div className="text-xs text-slate-500">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 3: Game Content */}
          {activeStage === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  3. Configure Game Source & Catalogue Rules
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Decide what titles power your syndicate stream dynamically.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Game Source Strategy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'trending', label: 'Trending Instant' },
                    { id: 'category', label: 'Specific Genre' },
                    { id: 'handpicked', label: 'Hand-Picked' }
                  ].map(src => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setWidgetState(prev => ({ ...prev, gameSource: src.id as any }))}
                      className={`p-3 rounded-2xl border text-xs font-semibold text-center transition-all ${
                        widgetState.gameSource === src.id
                          ? 'bg-[#D6F938] text-slate-950 border-[#c4e82b] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              {widgetState.gameSource === 'category' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Game Genre
                  </label>
                  <select
                    value={widgetState.selectedCategory}
                    onChange={(e) => setWidgetState(prev => ({ ...prev, selectedCategory: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="Racing">Racing & High Speed</option>
                    <option value="Arcade">Arcade & Shooters</option>
                    <option value="Puzzle">Puzzle & Match-3</option>
                    <option value="Casual">Casual & Platformers</option>
                    <option value="Strategy">Turn-Based Strategy</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Games in Reel ({widgetState.gameCount})
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={widgetState.gameCount}
                  onChange={(e) => setWidgetState(prev => ({ ...prev, gameCount: parseInt(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          )}

          {/* Stage 4: Layout Style */}
          {activeStage === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  4. Select Widget Layout Presentation
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Pick the interactive carousel archetype tailored for your host reader experience.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {layoutOptions.map(l => (
                  <div
                    key={l.type}
                    onClick={() => setWidgetState(prev => ({ ...prev, layout: l.type }))}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      widgetState.layout === l.type
                        ? 'bg-blue-50/60 border-blue-600 ring-2 ring-blue-500/20 text-slate-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-bold text-xs mb-1 text-slate-900">{l.name}</div>
                    <div className="text-[11px] text-slate-500">{l.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stage 5: Behavior */}
          {activeStage === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  5. Interaction & Playback Behavior
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Tune user gesture reactions and carousel autoplay dynamics.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'autoplayPreview', label: 'Autoplay Animated Preview on Hover' },
                  { key: 'enableSwipe', label: 'Enable Mobile Touch Swipe & Snap' },
                  { key: 'showArrows', label: 'Show Navigational Next/Prev Arrows' },
                  { key: 'loop', label: 'Continuous Carousel Loop' }
                ].map(b => (
                  <label key={b.key} className="flex items-center gap-3 p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={(widgetState.behaviour as any)[b.key]}
                      onChange={(e) => setWidgetState(prev => ({
                        ...prev,
                        behaviour: {
                          ...prev.behaviour,
                          [b.key]: e.target.checked
                        }
                      }))}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs text-slate-800 font-semibold">{b.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Stage 6: Appearance & Widget Size Configuration */}
          {activeStage === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  6. Appearance, Sizing & Branding Tokens
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Configure the dimensions, responsive sizing presets, custom width/height, and visual styling tokens.
                </p>
              </div>

              {/* 1. Sizing Presets & Width Controls */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Widget Size & Dimension Preset</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active: {widgetState.appearance.sizePreset?.toUpperCase() || 'FULL_WIDTH'}
                  </span>
                </div>

                {/* Preset Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'compact', label: 'Compact', px: '360px', desc: 'Sidebar/Rail' },
                    { id: 'standard', label: 'Standard', px: '720px', desc: 'Editorial Col' },
                    { id: 'large', label: 'Large Hero', px: '1040px', desc: 'Wide Break' },
                    { id: 'full_width', label: 'Full 100%', px: 'Fluid', desc: 'Match Container' },
                    { id: 'custom', label: 'Custom', px: `${widgetState.appearance.customWidth || 800}px`, desc: 'Manual Sliders' }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setWidgetState(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          sizePreset: preset.id as any,
                          widthMode: preset.id === 'custom' ? 'fixed_pixels' : 'responsive_full'
                        }
                      }))}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        widgetState.appearance.sizePreset === preset.id
                          ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{preset.label}</div>
                      <div className="text-[10px] font-mono text-blue-600 font-semibold mt-0.5">{preset.px}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{preset.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Custom / Fine-grained Width Slider */}
                {(widgetState.appearance.sizePreset === 'custom' || widgetState.appearance.widthMode === 'fixed_pixels') && (
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 animate-fade-in shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-semibold">Custom Pixel Width</span>
                      <span className="font-mono text-blue-600 font-bold">
                        {widgetState.appearance.customWidth || 720}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="280"
                      max="1200"
                      step="10"
                      value={widgetState.appearance.customWidth || 720}
                      onChange={(e) => setWidgetState(prev => ({
                        ...prev,
                        appearance: {
                          ...prev.appearance,
                          customWidth: parseInt(e.target.value),
                          widthMode: 'fixed_pixels',
                          sizePreset: 'custom'
                        }
                      }))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex items-center justify-between gap-1 pt-1">
                      {[320, 480, 720, 960, 1140].map(px => (
                        <button
                          key={px}
                          type="button"
                          onClick={() => setWidgetState(prev => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              customWidth: px,
                              widthMode: 'fixed_pixels',
                              sizePreset: 'custom'
                            }
                          }))}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
                        >
                          {px}px
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Max Height / Height Cap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Container Max Height</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {widgetState.appearance.customHeight ? `${widgetState.appearance.customHeight}px (Scrollable)` : 'Auto (Adaptive)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 0, label: 'Auto (Fit)' },
                      { id: 180, label: 'Compact 180px' },
                      { id: 260, label: 'Medium 260px' },
                      { id: 360, label: 'Tall 360px' }
                    ].map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setWidgetState(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, customHeight: h.id }
                        }))}
                        className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-colors ${
                          (widgetState.appearance.customHeight || 0) === h.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Scale / Density Factor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Element Scale / Density</span>
                    <span className="font-mono text-blue-600 font-bold text-[11px]">
                      {Math.round((widgetState.appearance.scale || 1) * 100)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 0.88, label: 'Compact (88%)' },
                      { val: 1.0, label: 'Default (100%)' },
                      { val: 1.12, label: 'Prominent (112%)' }
                    ].map(s => (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => setWidgetState(prev => ({
                          ...prev,
                          appearance: { ...prev.appearance, scale: s.val }
                        }))}
                        className={`py-1.5 px-2 rounded-xl border text-xs font-semibold transition-colors ${
                          (widgetState.appearance.scale || 1) === s.val
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Theme Canvas & Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setWidgetState(prev => ({ ...prev, appearance: { ...prev.appearance, theme: 'navy' } }))}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    widgetState.appearance.theme === 'navy'
                      ? 'bg-slate-900 border-slate-900 ring-2 ring-slate-900/30 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs mb-1">Midnight Navy</div>
                  <div className="text-[11px] text-slate-400">Dark immersive canvas for dark websites</div>
                </div>

                <div
                  onClick={() => setWidgetState(prev => ({ ...prev, appearance: { ...prev.appearance, theme: 'cloud' } }))}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    widgetState.appearance.theme === 'cloud'
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 text-blue-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs mb-1 text-slate-900">Cloud White</div>
                  <div className="text-[11px] text-slate-500">Clean editorial surface for light websites</div>
                </div>
              </div>

              {/* Primary Color & Accent */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#129BFF', '#7B2CF5', '#11D9FF', '#16C965', '#FFB51A', '#EC4899'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setWidgetState(prev => ({ ...prev, appearance: { ...prev.appearance, primaryColor: c } }))}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        widgetState.appearance.primaryColor === c ? 'border-slate-900 scale-110 shadow-md' : 'border-transparent'
                      }`}
                    />
                  ))}
                  <input
                    type="color"
                    value={widgetState.appearance.primaryColor || '#129BFF'}
                    onChange={(e) => setWidgetState(prev => ({ ...prev, appearance: { ...prev.appearance, primaryColor: e.target.value } }))}
                    className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>

              {/* Corner Radius & Card Spacing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corner Radius ({widgetState.appearance.cornerRadius}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={widgetState.appearance.cornerRadius}
                    onChange={(e) => setWidgetState(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, cornerRadius: parseInt(e.target.value) }
                    }))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Card Gap Spacing ({widgetState.appearance.cardSpacing || 12}px)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    value={widgetState.appearance.cardSpacing || 12}
                    onChange={(e) => setWidgetState(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, cardSpacing: parseInt(e.target.value) }
                    }))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>

              {/* Doch Branding Watermark Toggle */}
              <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={widgetState.appearance.showDochBranding}
                  onChange={(e) => setWidgetState(prev => ({
                    ...prev,
                    appearance: {
                      ...prev.appearance,
                      showDochBranding: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <div className="text-xs">
                  <span className="text-slate-900 font-bold block">Show DochGames Verified Badge</span>
                  <span className="text-slate-500 text-[11px]">Displays subtle "⚡ DochGames" trust mark in the widget corner</span>
                </div>
              </label>
            </div>
          )}

          {/* Stage 7: Live Context Preview */}
          {activeStage === 7 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  7. Live Host Site Placement Preview
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Test the widget in real context inside the responsive host template below before committing changes.
                </p>
              </div>
              <LiveSitePlacementMock 
                config={widgetState} 
                games={games} 
                onPlayGame={onPlayGame} 
              />
            </div>
          )}

          {/* Stage 8: Publish & Embed */}
          {activeStage === 8 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Widget Ready for Syndication
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Published with Publisher Key: <strong className="text-blue-600 font-mono">{publisherKey}</strong>
                  </p>
                </div>
              </div>

              {/* Embed snippet card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#D6F938]" />
                    Copyable Embed Script
                  </span>
                  <button
                    onClick={copyEmbed}
                    className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#D6F938] text-slate-950 font-bold hover:bg-[#c4e82b] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedSnippet ? 'Copied to Clipboard!' : 'Copy Code'}
                  </button>
                </div>

                <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  {embedSnippet}
                </pre>
              </div>

              {/* Deployment test tool */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Automated Deployment Test</h4>
                    <p className="text-[11px] text-slate-500">Pings CDN edge servers to verify handshake and publisher origin rules.</p>
                  </div>
                  <button
                    onClick={handleTestDeployment}
                    disabled={testResult === 'testing'}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testResult === 'testing' ? 'animate-spin' : ''}`} />
                    Run Test
                  </button>
                </div>

                {testResult === 'success' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deployment handshake verified! Origin '{selectedProperty.domain}' authorized for live widget streaming.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={() => setActiveStage(prev => Math.max(1, prev - 1))}
              disabled={activeStage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Stage
            </button>

            {activeStage < 8 ? (
              <button
                onClick={() => setActiveStage(prev => Math.min(8, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
              >
                Next: {stages[activeStage]?.title}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePublish(false)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handlePublish(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  Deploy to Website →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              {/* Header with Mode Switcher */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Live Widget Preview
                  </span>
                </div>

                {/* View Mode Toggle */}
                {hasScreenshot ? (
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('screenshot')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        previewMode === 'screenshot' 
                          ? 'bg-[#D6F938] text-slate-950 shadow-xs' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      On Site
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('standalone')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                        previewMode === 'standalone' 
                          ? 'bg-[#D6F938] text-slate-950 shadow-xs' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      Widget Only
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-200">STANDALONE CANVAS</span>
                )}
              </div>

              {/* 1. If Publisher Uploaded Screenshot & Screenshot Mode Active */}
              {showScreenshotInPreview ? (
                <div className="space-y-2">
                  {/* Simulated Host Browser / App Window Frame */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md flex flex-col">
                    {/* Window Title Bar */}
                    <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                      </div>
                      <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-full text-[10px] text-slate-600 font-mono truncate max-w-[200px] shadow-2xs">
                        🔒 {widgetState.targetPageUrl || 'https://gamezone-daily.com'}
                      </div>
                      {/* Device switch */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`p-1 rounded-md transition-colors ${previewDevice === 'desktop' ? 'text-blue-600 bg-white shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                          title="Desktop View"
                        >
                          <Monitor className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`p-1 rounded-md transition-colors ${previewDevice === 'mobile' ? 'text-blue-600 bg-white shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                          title="Mobile App View"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Screenshot Container with Live Embedded Widget */}
                    <div className="relative min-h-[360px] max-h-[460px] overflow-y-auto bg-slate-900 flex flex-col">
                      {/* Host Screenshot Image */}
                      <img
                        src={widgetState.customScreenshotUrl}
                        alt="Uploaded Host Screenshot"
                        className="w-full h-auto object-cover opacity-90 block pointer-events-none"
                      />

                      {/* Overlaid Injected Widget Container based on Placement */}
                      <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                        {/* Header Slot */}
                        {widgetState.placement === 'header' && (
                          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-blue-500/40 shadow-xl animate-fade-in w-full">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-[9px] uppercase font-bold text-blue-600 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Injected [Header Slot]
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {widgetState.appearance.sizePreset || 'Fluid'}
                              </span>
                            </div>
                            <DochWidgetRenderer 
                              config={widgetState} 
                              games={games} 
                              onPlayGame={onPlayGame} 
                            />
                          </div>
                        )}

                        {/* In-Content Slot */}
                        {widgetState.placement === 'in_content' && (
                          <div className="my-auto pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-blue-500/40 shadow-xl animate-fade-in w-full">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-[9px] uppercase font-bold text-blue-600 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Injected [Editorial In-Content]
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {widgetState.appearance.sizePreset || 'Fluid'}
                              </span>
                            </div>
                            <DochWidgetRenderer 
                              config={widgetState} 
                              games={games} 
                              onPlayGame={onPlayGame} 
                            />
                          </div>
                        )}

                        {/* Sidebar Slot */}
                        {widgetState.placement === 'sidebar' && (
                          <div className="my-auto ml-auto pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-blue-500/40 shadow-xl animate-fade-in w-full max-w-[260px]">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-[9px] uppercase font-bold text-blue-600 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Injected [Sidebar Rail]
                              </span>
                            </div>
                            <DochWidgetRenderer 
                              config={widgetState} 
                              games={games} 
                              onPlayGame={onPlayGame} 
                            />
                          </div>
                        )}

                        {/* Below Content / Footer Slot */}
                        {(widgetState.placement === 'below_content' || widgetState.placement === 'custom') && (
                          <div className="mt-auto pointer-events-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-blue-500/40 shadow-xl animate-fade-in w-full">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-[9px] uppercase font-bold text-blue-600 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Injected [Below Content Strip]
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">
                                {widgetState.appearance.sizePreset || 'Fluid'}
                              </span>
                            </div>
                            <DochWidgetRenderer 
                              config={widgetState} 
                              games={games} 
                              onPlayGame={onPlayGame} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Placement Switcher Quick Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">Move slot on screenshot:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'header', label: 'Top' },
                        { id: 'in_content', label: 'Mid' },
                        { id: 'sidebar', label: 'Side' },
                        { id: 'below_content', label: 'Bottom' }
                      ].map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setWidgetState(prev => ({ ...prev, placement: slot.id as any }))}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                            widgetState.placement === slot.id
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Standalone Widget Render */
                <div className="space-y-3">
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <DochWidgetRenderer 
                      config={widgetState} 
                      games={games} 
                      onPlayGame={onPlayGame} 
                    />
                  </div>

                  {!hasScreenshot && (
                    <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-[11px] text-slate-700 font-medium">
                          Want to preview on your actual site or app?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStage(1)}
                        className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold shrink-0 transition-colors shadow-xs"
                      >
                        Upload Screenshot
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status meta footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Layout: <strong className="text-slate-800">{widgetState.layout}</strong></span>
                <span>Size: <strong className="text-blue-600 font-bold">{widgetState.appearance.sizePreset || 'Full'}</strong></span>
              </div>
            </div>

            {/* Giga Mascot Helper Tip */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <GigaMascot 
                mood="helpful" 
                size="sm" 
                speechBubble={
                  hasScreenshot 
                    ? "Your uploaded screenshot is now active! The live preview simulates your widget rendered directly on your actual host page."
                    : "Tip: In Stage 1 (Property & Page), you can upload a screenshot of your website or app to see the live widget embedded directly on your site!"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
