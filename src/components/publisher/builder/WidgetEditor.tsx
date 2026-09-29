import React, { useState } from 'react';
import { 
  WidgetConfig, GameItem, PublisherProperty, WidgetPlacement 
} from '../../../types';
import { DochWidgetRenderer } from '../../widgets/DochWidgetRenderer';
import { 
  Monitor, Smartphone, ChevronDown, ChevronUp, Palette, 
  Layers, Gamepad2, Settings2, ArrowLeft, ArrowRight, Check, Sparkles 
} from 'lucide-react';

interface WidgetEditorProps {
  widget: WidgetConfig;
  properties: PublisherProperty[];
  games: GameItem[];
  onChange: (updated: WidgetConfig) => void;
  onPlayGame: (game: GameItem) => void;
  onBack: () => void;
  onContinue: () => void;
  lastSavedAt?: string;
}

const PRESET_COLOURS = [
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Electric Violet', hex: '#7B2CF5' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Ruby Crimson', hex: '#EF4444' },
  { name: 'Midnight Charcoal', hex: '#0F172A' }
];

const GENRES = [
  'All Genres',
  'Arcade',
  'Racing',
  'Action',
  'Puzzle',
  'Sports',
  'Casual'
];

export const WidgetEditor: React.FC<WidgetEditorProps> = ({
  widget,
  properties,
  games,
  onChange,
  onPlayGame,
  onBack,
  onContinue,
  lastSavedAt
}) => {
  // Mobile tab state: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  
  // Preview device mode: 'desktop' | 'mobile'
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Advanced options collapsible drawer
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Helper updaters
  const updateAppearance = (updates: Partial<WidgetConfig['appearance']>) => {
    onChange({
      ...widget,
      appearance: {
        ...widget.appearance,
        ...updates
      }
    });
  };

  const updateBehaviour = (updates: Partial<WidgetConfig['behaviour']>) => {
    onChange({
      ...widget,
      behaviour: {
        ...widget.behaviour,
        ...updates
      }
    });
  };

  const updateAdvanced = (updates: Partial<WidgetConfig['advanced']>) => {
    onChange({
      ...widget,
      advanced: {
        ...widget.advanced,
        ...updates
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Change template"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight">
              Customise & preview
            </h1>
            <p className="text-xs text-slate-600">
              Personalise your widget to match your website theme and audience.
            </p>
          </div>
        </div>

        {/* Right side: Auto-save status */}
        <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Draft auto-saved</span>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible on small screens only) */}
      <div className="flex lg:hidden mb-4 bg-slate-200/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'editor'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Customise Settings
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Settings */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            mobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Section 1: Basic Identity */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">
                General details
              </h2>
            </div>

            {/* Widget Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Widget name
              </label>
              <input
                type="text"
                value={widget.name}
                onChange={(e) => onChange({ ...widget, name: e.target.value })}
                placeholder="e.g. Homepage Top Arcade"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
              />
            </div>

            {/* Target Website */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website
              </label>
              <select
                value={widget.propertyId}
                onChange={(e) => {
                  const prop = properties.find(p => p.id === e.target.value);
                  onChange({
                    ...widget,
                    propertyId: e.target.value,
                    propertyName: prop?.name || widget.propertyName,
                    targetPageUrl: prop ? `https://${prop.domain}` : widget.targetPageUrl
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium bg-white"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.domain})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Game Content Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Gamepad2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">
                Game content
              </h2>
            </div>

            {/* Game Source */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Which games to show
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...widget, gameSource: 'trending' })}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    widget.gameSource === 'trending'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold">Trending games</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Automatically curated top-played
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...widget, gameSource: 'category' })}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    widget.gameSource === 'category'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold">By genre</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Match your site category
                  </div>
                </button>
              </div>
            </div>

            {/* Category Dropdown (if genre selected) */}
            {widget.gameSource === 'category' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected genre
                </label>
                <select
                  value={widget.selectedCategory || 'Racing'}
                  onChange={(e) => onChange({ ...widget, selectedCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium bg-white"
                >
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Number of games */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Number of games displayed: <span className="font-bold text-blue-600">{widget.gameCount}</span>
              </label>
              <div className="flex gap-2">
                {[3, 4, 6, 8].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onChange({ ...widget, gameCount: count })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      widget.gameCount === count
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {count} games
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Appearance & Colours */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Palette className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">
                Design & colour
              </h2>
            </div>

            {/* Theme Toggle (Cloud vs Navy) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateAppearance({ theme: 'cloud' })}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2.5 ${
                    widget.appearance.theme === 'cloud'
                      ? 'border-blue-600 bg-blue-50/50 text-slate-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-300 shadow-xs shrink-0" />
                  <div>
                    <div className="font-bold">Cloud (Light)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Best for bright websites</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateAppearance({ theme: 'navy' })}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2.5 ${
                    widget.appearance.theme === 'navy'
                      ? 'border-blue-600 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#071B4B] border border-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold">Navy (Dark)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Sleek gaming dark mode</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Accent Colour */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Accent colour
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLOURS.map(c => {
                  const isSelected = widget.appearance.primaryColor?.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateAppearance({ primaryColor: c.hex })}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                        isSelected ? 'scale-110 ring-2 ring-offset-2 ring-blue-600' : 'hover:scale-105'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  );
                })}

                {/* Custom Color Input */}
                <div className="flex items-center gap-1.5 ml-2 border border-slate-200 rounded-lg px-2 py-1">
                  <input
                    type="color"
                    value={widget.appearance.primaryColor || '#2563EB'}
                    onChange={(e) => updateAppearance({ primaryColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-600">
                    {widget.appearance.primaryColor || '#2563EB'}
                  </span>
                </div>
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Corner shape
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Sharp', radius: 4 },
                  { label: 'Rounded', radius: 12 },
                  { label: 'Extra Soft', radius: 20 }
                ].map(opt => (
                  <button
                    key={opt.radius}
                    type="button"
                    onClick={() => updateAppearance({ cornerRadius: opt.radius })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      widget.appearance.cornerRadius === opt.radius
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Progressive Disclosure (Advanced settings) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Advanced options</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Branding, sizing, lazy loading)
                </span>
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showAdvanced && (
              <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50/50">
                {/* DochGames Branding Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Show DochGames watermark badge
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Displays a subtle &quot;⚡ DochGames&quot; tag
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={widget.appearance.showDochBranding}
                    onChange={(e) => updateAppearance({ showDochBranding: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                {/* Lazy Loading */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Fast lazy loading
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Loads game assets only when visible to protect page speed
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={widget.advanced.lazyLoading}
                    onChange={(e) => updateAdvanced({ lazyLoading: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                {/* Width Sizing Preset */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Widget container width
                  </label>
                  <select
                    value={widget.appearance.sizePreset || 'full_width'}
                    onChange={(e) => updateAppearance({ sizePreset: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                  >
                    <option value="full_width">Full width (100% responsive)</option>
                    <option value="large">Large (Max 1040px)</option>
                    <option value="standard">Standard (Max 720px)</option>
                    <option value="compact">Compact (Max 360px)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Live Preview */}
        <div
          className={`lg:col-span-7 lg:sticky lg:top-20 space-y-4 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Preview Container Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-800">
                  Live Preview
                </span>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline">
                  Interactive — Click any game to test
                </span>
              </div>

              {/* Desktop / Mobile Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    deviceMode === 'desktop'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    deviceMode === 'mobile'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Mobile Preview (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Preview Viewport Frame */}
            <div
              className={`transition-all duration-300 mx-auto flex items-center justify-center p-2 sm:p-4 rounded-2xl ${
                widget.appearance.theme === 'navy'
                  ? 'bg-slate-950 border border-slate-800'
                  : 'bg-slate-100/70 border border-slate-200/60'
              } ${
                deviceMode === 'mobile'
                  ? 'max-w-[375px] shadow-xl ring-8 ring-slate-800 rounded-[36px] my-4'
                  : 'w-full'
              }`}
            >
              <div className="w-full">
                <DochWidgetRenderer
                  config={widget}
                  games={games}
                  onPlayGame={onPlayGame}
                  isInteractive={true}
                />
              </div>
            </div>

            {/* Preview Hint */}
            <p className="text-[11px] text-slate-600 text-center mt-4">
              ✨ This live preview uses your actual widget settings. Games launched here run the playable demo modal.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change template</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <span>Continue to Install</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
