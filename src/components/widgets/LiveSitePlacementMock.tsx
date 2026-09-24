import React, { useState, useEffect } from 'react';
import { 
  Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, 
  Layers, Check, Sparkles, AlertCircle, Image as ImageIcon 
} from 'lucide-react';
import { WidgetConfig, GameItem } from '../../types';
import { DochWidgetRenderer } from './DochWidgetRenderer';

interface LiveSitePlacementMockProps {
  config: WidgetConfig;
  games: GameItem[];
  onPlayGame: (game: GameItem) => void;
}

export const LiveSitePlacementMock: React.FC<LiveSitePlacementMockProps> = ({
  config,
  games,
  onPlayGame
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hostTemplate, setHostTemplate] = useState<string>(
    config.customScreenshotUrl ? 'uploaded_screenshot' : 'gaming_news'
  );
  const [customUrl, setCustomUrl] = useState<string>(
    config.targetPageUrl || 'https://gamezone-daily.com/articles/cyberpunk-future'
  );

  useEffect(() => {
    if (config.customScreenshotUrl && hostTemplate !== 'uploaded_screenshot') {
      setHostTemplate('uploaded_screenshot');
    }
  }, [config.customScreenshotUrl]);

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="space-y-4">
      {/* Viewport & Simulation Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Placement:</span>
          <span className="px-2.5 py-1 rounded-full bg-[#D6F938] text-slate-950 font-bold border border-[#c4e82b] uppercase text-[10px] tracking-wide">
            {config.placement.replace('_', ' ')}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              device === 'desktop' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop 1440px</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              device === 'tablet' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet 768px</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              device === 'mobile' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile 390px</span>
          </button>
        </div>

        {/* Host Template Selection */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Host Template:</span>
          <select
            value={hostTemplate}
            onChange={(e) => setHostTemplate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 shadow-2xs focus:bg-white focus:border-blue-500 outline-none"
          >
            {config.customScreenshotUrl && (
              <option value="uploaded_screenshot">
                📸 {config.customScreenshotName || 'Uploaded Site Screenshot'}
              </option>
            )}
            <option value="gaming_news">GameZone Daily (Media/Reviews)</option>
            <option value="tech_magazine">TechPulse Digital (Tech News)</option>
            <option value="sports_portal">Apex Sports Arena (Editorial)</option>
          </select>
        </div>
      </div>

      {/* Simulated Browser Window Frame */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden flex flex-col items-center">
        {/* Browser Top Nav / Address bar */}
        <div className="w-full bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          </div>
          <div className="flex-1 max-w-lg mx-auto bg-white border border-slate-200 rounded-full px-3 py-1 text-xs text-slate-700 flex items-center justify-between shadow-2xs">
            <span className="truncate">{customUrl}</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">🔒 SSL 200 OK</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono font-medium">
            {device.toUpperCase()} MODE
          </div>
        </div>

        {/* Responsive Content Stage */}
        <div className="w-full bg-slate-100/70 p-4 sm:p-6 flex justify-center min-h-[640px] overflow-x-auto">
          {/* 1. Uploaded Screenshot Host Environment */}
          {hostTemplate === 'uploaded_screenshot' && config.customScreenshotUrl ? (
            <div className={`w-full ${getContainerWidth()} rounded-xl shadow-2xl overflow-hidden border border-slate-700 relative bg-[#040f2b] flex flex-col transition-all duration-300`}>
              {/* Screenshot as background with live widget positioned */}
              <div className="relative min-h-[700px] w-full bg-slate-950 overflow-hidden flex flex-col">
                {/* Background Screenshot Image */}
                <img
                  src={config.customScreenshotUrl}
                  alt="Uploaded Site Screenshot"
                  className="w-full h-auto object-cover opacity-90 block"
                />
                
                {/* Overlay layer with injected widget according to placement */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 sm:p-6">
                  {/* Top / Header Placement */}
                  {config.placement === 'header' && (
                    <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-blue-500/40 shadow-2xl animate-fade-in w-full">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Injected Live Widget [Header Placement]
                        </span>
                        <span className="font-mono text-slate-500 text-[9px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {config.appearance.sizePreset || 'Fluid Width'}
                        </span>
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}

                  {/* In-Content Placement (Centered) */}
                  {config.placement === 'in_content' && (
                    <div className="my-auto pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-blue-500/40 shadow-2xl animate-fade-in w-full max-w-4xl mx-auto">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Injected Live Widget [In-Content Editorial Slot]
                        </span>
                        <span className="font-mono text-slate-500 text-[9px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {config.appearance.sizePreset || 'Fluid Width'}
                        </span>
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}

                  {/* Sidebar Placement (Right column overlay) */}
                  {config.placement === 'sidebar' && (
                    <div className="my-auto ml-auto pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-blue-500/40 shadow-2xl animate-fade-in w-full max-w-sm">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Injected Live Widget [Sidebar Rail]
                        </span>
                        <span className="font-mono text-slate-500 text-[9px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Mini Rail
                        </span>
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}

                  {/* Below Content / Footer Placement */}
                  {(config.placement === 'below_content' || config.placement === 'custom') && (
                    <div className="mt-auto pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-blue-500/40 shadow-2xl animate-fade-in w-full">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Injected Live Widget [{config.placement === 'custom' ? 'Custom DOM Container' : 'Below Content / Recommendations'}]
                        </span>
                        <span className="font-mono text-slate-500 text-[9px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {config.appearance.sizePreset || 'Fluid Width'}
                        </span>
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer info bar */}
              <div className="bg-slate-100 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  Displaying on uploaded host site screenshot
                </span>
                <span className="text-[11px] font-mono text-blue-600 font-bold">Interactive Preview</span>
              </div>
            </div>
          ) : (
            /* 2. Default Pre-built Mock Host Layout */
            <div className={`w-full ${getContainerWidth()} bg-white text-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-300 flex flex-col transition-all duration-300`}>
              {/* Host Page Header */}
              <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">
                    {hostTemplate === 'gaming_news' ? 'GAMEZONE DAILY' : hostTemplate === 'tech_magazine' ? 'TECHPULSE' : 'APEX ARENA'}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">NEWS · REVIEWS · ESPORTS</span>
                </div>
                <div className="text-xs font-semibold text-blue-600 cursor-pointer">
                  Subscribe
                </div>
              </div>

              {/* Injected Widget in HEADER placement */}
              {config.placement === 'header' && (
                <div className="p-3 bg-slate-100 border-b border-blue-200 relative">
                  <div className="text-[10px] uppercase font-bold text-blue-600 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Live Injected Placement Slot [Header]
                  </div>
                  <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                </div>
              )}

              {/* Host Page Body Content */}
              <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                {/* Left / Main Content Column */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Exclusive Feature
                    </span>
                    <h1 className="text-2xl font-bold leading-tight text-slate-900">
                      The Next Evolution of Instant Browser Gaming & Syndication
                    </h1>
                    <p className="text-xs text-slate-500">
                      By Marcus Vance · Published Today · 5 min read
                    </p>
                  </div>

                  <div className="h-44 bg-slate-200 rounded-lg overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
                      alt="Article hero"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Web-based game syndication has unlocked unprecedented engagement for digital publishers. With zero install barriers and modern WebGL engines, audiences can explore frictionless entertainment right inside editorial articles.
                  </p>

                  {/* Injected Widget in IN_CONTENT placement */}
                  {config.placement === 'in_content' && (
                    <div className="my-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl relative">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Live Injected Placement Slot [In-Content Editorial]
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Publishers benefit from elevated dwell times and organic session extensions, with zero latency degradation or heavy script footprint.
                  </p>

                  {/* Injected Widget in BELOW_CONTENT placement */}
                  {(config.placement === 'below_content' || config.placement === 'custom') && (
                    <div className="mt-6 p-3 bg-blue-50/80 border border-blue-200 rounded-xl relative">
                      <div className="text-[10px] uppercase font-bold text-blue-600 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Live Injected Placement Slot [Below Content / Recommendations]
                      </div>
                      <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                    </div>
                  )}
                </div>

                {/* Sidebar Column (Desktop/Tablet) */}
                {device !== 'mobile' && (
                  <div className="w-72 shrink-0 space-y-4">
                    {/* Injected Widget in SIDEBAR placement */}
                    {config.placement === 'sidebar' && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="text-[10px] uppercase font-bold text-blue-600 mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Injected [Sidebar Mini Reel]
                        </div>
                        <DochWidgetRenderer config={config} games={games} onPlayGame={onPlayGame} />
                      </div>
                    )}

                    {/* Standard Host Sidebar Cards */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase">Top Stories</h4>
                      <ul className="text-xs text-slate-600 space-y-2">
                        <li className="hover:text-blue-600 cursor-pointer">· Next-gen hardware architecture revealed</li>
                        <li className="hover:text-blue-600 cursor-pointer">· Indie game festival award finalists 2026</li>
                        <li className="hover:text-blue-600 cursor-pointer">· WebAssembly speeds reach desktop parity</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                      Host Ad Space 300x250
                    </div>
                  </div>
                )}
              </div>

              {/* Host Page Footer */}
              <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>© 2026 Host Publisher Network. All rights reserved.</span>
                <span>Powered by DochGames Syndication Engine</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
