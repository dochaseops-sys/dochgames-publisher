import React, { useState } from 'react';
import { 
  Sparkles, Globe, Layers, Code, Check, ArrowRight, ArrowLeft, 
  Copy, ExternalLink, Gamepad2, X, CheckCircle2, ShieldCheck, Play 
} from 'lucide-react';
import { PublisherProperty, WidgetConfig, WidgetTemplateId, InstallationPlatform } from '../../types';
import { addWebsite, getWebsites, normalizeDomain } from '../../services/websites';
import { createNewWidgetDraft, saveWidget } from '../../services/widgets';
import { generateEmbedCode } from '../../utils/embedCode';
import { mockGames } from '../../data/mockData';

interface PublisherOnboardingModalProps {
  isOpen: boolean;
  userEmail?: string;
  initialDomain?: string;
  initialCompanyName?: string;
  onClose: () => void;
  onFinishToDashboard: () => void;
  onCustomiseWidget: (widgetId: string) => void;
}

export const PublisherOnboardingModal: React.FC<PublisherOnboardingModalProps> = ({
  isOpen,
  userEmail,
  initialDomain = '',
  initialCompanyName = '',
  onClose,
  onFinishToDashboard,
  onCustomiseWidget
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Website
  const [websiteName, setWebsiteName] = useState(() => {
    if (initialCompanyName) return initialCompanyName;
    if (initialDomain) {
      const clean = normalizeDomain(initialDomain);
      const prefix = clean.split('.')[0] || '';
      return prefix ? `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} Media` : 'My Gaming Site';
    }
    return 'My First Website';
  });
  const [websiteDomain, setWebsiteDomain] = useState(() => normalizeDomain(initialDomain) || 'mygamewebsite.com');
  const [platform, setPlatform] = useState<InstallationPlatform>('wordpress');
  const [savedProperty, setSavedProperty] = useState<PublisherProperty | null>(null);

  // Step 2: Widget Template & Theme
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplateId>('carousel');
  const [themeMode, setThemeMode] = useState<'cloud' | 'navy'>('cloud');
  const [createdWidget, setCreatedWidget] = useState<WidgetConfig | null>(null);

  // Step 3: Embed Snippet & Copy
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Handle Step 1 -> Step 2
  const handleProceedFromStep1 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanDomain = normalizeDomain(websiteDomain) || 'example.com';
    const cleanName = websiteName.trim() || cleanDomain;

    // Check if property exists or create it
    const existing = getWebsites().find(w => w.domain === cleanDomain);
    const prop = existing || addWebsite(cleanName, cleanDomain, platform);
    setSavedProperty(prop);
    setCurrentStep(2);
  };

  // Handle Step 2 -> Step 3
  const handleProceedFromStep2 = () => {
    const propId = savedProperty?.id || getWebsites()[0]?.id;
    // Create starter widget draft
    const widget = createNewWidgetDraft(selectedTemplate, propId);
    
    // Apply chosen theme
    const updatedWidget: WidgetConfig = {
      ...widget,
      name: `${websiteName} ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Widget`,
      appearance: {
        ...widget.appearance,
        theme: themeMode,
        primaryColor: themeMode === 'navy' ? '#3B82F6' : '#2563EB'
      }
    };
    const saved = saveWidget(updatedWidget);
    setCreatedWidget(saved);
    setCurrentStep(3);
  };

  // Embed snippet for Step 3
  const embedSnippet = createdWidget && savedProperty
    ? generateEmbedCode({
        widgetId: createdWidget.id,
        publisherKey: savedProperty.publisherKey,
        layout: createdWidget.layout,
        platform
      })
    : `<script src="https://cdn.dochgames.com/widget.js" data-publisher="${savedProperty?.publisherKey || 'pub_key'}" async></script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header with Stepper */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6F938] bg-slate-800 px-2 py-0.5 rounded-full">
                  Quick Start Wizard
                </span>
                <span className="text-xs text-slate-400">Step {currentStep} of 3</span>
              </div>
              <h2 id="onboarding-modal-title" className="text-base sm:text-lg font-display font-black text-white leading-tight mt-0.5">
                {currentStep === 1 && '1. Connect your website'}
                {currentStep === 2 && '2. Choose your game widget'}
                {currentStep === 3 && '3. Ready to launch games!'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Skip onboarding"
            aria-label="Skip to dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1 shrink-0">
          <div 
            className="bg-[#D6F938] h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* STEP 1: WEBSITE SETUP */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedFromStep1} className="space-y-5">
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold block text-sm mb-0.5">Welcome to DochGames Publisher Platform!</span>
                  Connect your primary website to generate your verified publisher key and embed responsive web games.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Website / Publication Name
                </label>
                <input
                  type="text"
                  required
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="e.g. Arcade Pulse Daily"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Website Domain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={websiteDomain}
                    onChange={(e) => setWebsiteDomain(e.target.value)}
                    onBlur={() => setWebsiteDomain(normalizeDomain(websiteDomain))}
                    placeholder="e.g. arcadepulse.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter your root domain. Protocol (https://) is configured automatically.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select CMS / Website Platform
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'wordpress', label: 'WordPress' },
                    { id: 'shopify', label: 'Shopify' },
                    { id: 'webflow', label: 'Webflow' },
                    { id: 'wix', label: 'Wix' },
                    { id: 'react', label: 'React / Next.js' },
                    { id: 'other', label: 'Custom HTML' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id as InstallationPlatform)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        platform === p.id
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Skip to dashboard
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-98"
                >
                  <span>Continue to Widget Picker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: TEMPLATE SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Select a starter layout format
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose how games will appear on <span className="font-semibold text-slate-800">{websiteDomain}</span>. You can change colours and game lists at any time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Format 1: Carousel */}
                <div
                  onClick={() => setSelectedTemplate('carousel')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTemplate === 'carousel'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                    {selectedTemplate === 'carousel' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Carousel Slider</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Swipeable horizontal row of trending games. Best for editorial articles.
                  </p>
                  <div className="mt-3 flex gap-1 h-8 rounded-lg bg-slate-900 p-1">
                    <div className="w-1/3 bg-blue-500 rounded"></div>
                    <div className="w-1/3 bg-purple-500 rounded"></div>
                    <div className="w-1/3 bg-emerald-500 rounded"></div>
                  </div>
                </div>

                {/* Format 2: Featured Spotlight */}
                <div
                  onClick={() => setSelectedTemplate('featured')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTemplate === 'featured'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      High Impact
                    </span>
                    {selectedTemplate === 'featured' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Featured Spotlight</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Large hero banner with 1-click playable game. Best for dedicated entertainment hubs.
                  </p>
                  <div className="mt-3 flex gap-1 h-8 rounded-lg bg-slate-900 p-1">
                    <div className="w-2/3 bg-rose-500 rounded flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                    <div className="w-1/3 bg-slate-800 rounded"></div>
                  </div>
                </div>

                {/* Format 3: Floating Launcher */}
                <div
                  onClick={() => setSelectedTemplate('floating')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedTemplate === 'floating'
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Zero Layout Shift
                    </span>
                    {selectedTemplate === 'floating' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Floating Button</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Corner action button opening a drawer of games. Never interrupts layout.
                  </p>
                  <div className="mt-3 flex justify-end h-8 rounded-lg bg-slate-100 p-1 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <Gamepad2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Theme Colour
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setThemeMode('cloud')}
                    className={`py-2 px-3 rounded-xl border flex items-center gap-2 transition-all ${
                      themeMode === 'cloud'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-slate-300" />
                    <span className="text-xs">Light Background</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setThemeMode('navy')}
                    className={`py-2 px-3 rounded-xl border flex items-center gap-2 transition-all ${
                      themeMode === 'navy'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-700" />
                    <span className="text-xs">Navy Dark Mode</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to website</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedFromStep2}
                  className="px-6 py-2.5 rounded-xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-98"
                >
                  <span>Generate Embed Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EMBED CODE & LAUNCH */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  <span className="font-bold block text-sm mb-0.5">Your widget has been created!</span>
                  Paste this lightweight snippet into your <span className="font-bold capitalize">{platform}</span> site template. Games stream instantly with zero external dependencies.
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-mono text-[11px] text-slate-300">Embed Snippet</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#D6F938] hover:bg-[#cbf028] text-slate-950'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="font-mono text-xs text-blue-200 overflow-x-auto whitespace-pre-wrap break-all pt-1">
                  {embedSnippet}
                </pre>
              </div>

              {/* Quick Platform Hint */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Tip for {platform}:</strong> Add this as a Custom HTML block or place before the closing &lt;/body&gt; tag in your layout.
                </span>
              </div>

              {/* Finish Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                {createdWidget && (
                  <button
                    type="button"
                    onClick={() => {
                      onCustomiseWidget(createdWidget.id);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Customise games & colours first
                  </button>
                )}

                <button
                  type="button"
                  onClick={onFinishToDashboard}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <span>Go to Publisher Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
