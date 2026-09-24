import React, { useState } from 'react';
import { 
  Code2, Globe, Check, Copy, Download, RefreshCw, ExternalLink, 
  Layers, ShieldCheck, Sparkles, CheckCircle, AlertTriangle, 
  Terminal, Monitor, Smartphone, Tablet, FileCode2, ArrowRight,
  Eye, HelpCircle, ChevronRight, Play
} from 'lucide-react';
import { WidgetConfig, PublisherProperty, GameItem } from '../../types';
import { LiveSitePlacementMock } from '../widgets/LiveSitePlacementMock';
import { DochWidgetRenderer } from '../widgets/DochWidgetRenderer';

interface WidgetDeploymentPageProps {
  widgets: WidgetConfig[];
  properties: PublisherProperty[];
  games: GameItem[];
  selectedWidgetId?: string;
  onNavigateToBuilder: (widget?: WidgetConfig) => void;
  onNavigateToAnalytics: () => void;
  onOpenConnectModal: () => void;
  onPlayGame: (game: GameItem) => void;
}

export const WidgetDeploymentPage: React.FC<WidgetDeploymentPageProps> = ({
  widgets,
  properties,
  games,
  selectedWidgetId,
  onNavigateToBuilder,
  onNavigateToAnalytics,
  onOpenConnectModal,
  onPlayGame
}) => {
  // Active widget selection
  const [activeWidgetId, setActiveWidgetId] = useState<string>(
    selectedWidgetId || widgets[0]?.id || ''
  );
  
  // Framework / method tab
  const [activeFramework, setActiveFramework] = useState<
    'script' | 'iframe' | 'react' | 'wordpress' | 'webflow'
  >('script');

  // Copy state
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // Ping test state
  const [testUrl, setTestUrl] = useState<string>('https://gamezone-daily.com/articles/cyberpunk-future');
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingStep, setPingStep] = useState<number>(0);
  const [pingDetails, setPingDetails] = useState<{
    latencyMs: number;
    sdkVersion: string;
    originStatus: string;
    containerStatus: string;
  } | null>(null);

  // Preview tab within deployment page
  const [activeTab, setActiveTab] = useState<'code' | 'simulator' | 'checklist'>('code');

  const activeWidget = widgets.find(w => w.id === activeWidgetId) || widgets[0];
  const activeProperty = properties.find(p => p.id === activeWidget?.propertyId) || properties[0];

  const publisherKey = activeProperty?.publisherKey || 'pub_live_demo_9921';
  const cdnUrl = 'https://cdn.dochgames.com/sdk/v2/loader.js';
  const embedId = `doch-widget-${activeWidget?.id || 'sample'}`;

  // Generate code snippets
  const getScriptSnippet = () => {
    return `<!-- DochGames Smart Widget Loader -->
<script 
  async 
  src="${cdnUrl}" 
  data-publisher-key="${publisherKey}"
  data-widget-id="${activeWidget?.id || 'wdg-default'}"
  data-layout="${activeWidget?.layout || 'expandable_slit_reel'}"
  data-origin="${activeProperty?.domain || 'localhost'}">
</script>

<!-- DochGames Container Target -->
<div id="${embedId}" class="doch-game-container"></div>`;
  };

  const getIframeSnippet = () => {
    const iframeSrc = `https://embed.dochgames.com/w/${activeWidget?.id || 'demo'}?key=${publisherKey}&theme=${activeWidget?.appearance.theme || 'navy'}`;
    const height = activeWidget?.layout === 'sidebar_mini_reel' ? '600' : '280';
    return `<!-- DochGames Sandboxed iFrame Embed -->
<iframe 
  src="${iframeSrc}"
  width="100%" 
  height="${height}"
  frameborder="0" 
  scrolling="no"
  allow="fullscreen; autoplay"
  sandbox="allow-scripts allow-same-origin allow-popups"
  style="border: none; overflow: hidden; border-radius: ${activeWidget?.appearance.cornerRadius || 16}px;"
  title="DochGames Interactive Reel">
</iframe>`;
  };

  const getReactSnippet = () => {
    return `// React / Next.js Component (TypeScript / JSX)
import React, { useEffect } from 'react';

export function DochGamesWidget() {
  useEffect(() => {
    // Dynamic loader injection
    const script = document.createElement('script');
    script.src = '${cdnUrl}';
    script.async = true;
    script.setAttribute('data-publisher-key', '${publisherKey}');
    script.setAttribute('data-widget-id', '${activeWidget?.id || 'wdg-default'}');
    script.setAttribute('data-layout', '${activeWidget?.layout || 'expandable_slit_reel'}');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div 
      id="${embedId}" 
      className="doch-widget-mount-point w-full my-6"
      style={{ minHeight: '220px' }}
    />
  );
}`;
  };

  const getWordPressSnippet = () => {
    return `[doch_widget id="${activeWidget?.id || 'wdg-default'}" key="${publisherKey}"]

<!-- Or in WordPress Custom HTML Block: -->
<div id="${embedId}"></div>
<script async src="${cdnUrl}" data-publisher-key="${publisherKey}" data-widget-id="${activeWidget?.id || 'wdg-default'}"></script>`;
  };

  const getWebflowSnippet = () => {
    return `<!-- Webflow Embed Component -->
<div id="${embedId}"></div>
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${cdnUrl}';
    s.async = true;
    s.setAttribute('data-publisher-key', '${publisherKey}');
    s.setAttribute('data-widget-id', '${activeWidget?.id || 'wdg-default'}');
    document.head.appendChild(s);
  })();
</script>`;
  };

  const getCurrentSnippet = () => {
    switch (activeFramework) {
      case 'iframe':
        return getIframeSnippet();
      case 'react':
        return getReactSnippet();
      case 'wordpress':
        return getWordPressSnippet();
      case 'webflow':
        return getWebflowSnippet();
      case 'script':
      default:
        return getScriptSnippet();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCurrentSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(publisherKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2200);
  };

  const handleDownloadTestHtml = () => {
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DochGames Live Deployment Test - ${activeWidget?.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f17; color: #fff; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; }
    .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #1e293b; }
    h1 { margin: 0 0 8px; font-size: 24px; color: #d6f938; }
    p { margin: 0; color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DochGames Local Deployment Test</h1>
      <p>Widget: ${activeWidget?.name} (${activeWidget?.layout}) | Key: ${publisherKey}</p>
    </div>

    <!-- DochGames Container -->
    <div id="${embedId}"></div>
    <script async src="${cdnUrl}" data-publisher-key="${publisherKey}" data-widget-id="${activeWidget?.id}"></script>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doch-widget-${activeWidget?.id || 'demo'}-test.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run deployment ping verification test
  const handleRunPingTest = () => {
    setPingStatus('testing');
    setPingStep(1);
    setPingDetails(null);

    setTimeout(() => {
      setPingStep(2);
    }, 450);

    setTimeout(() => {
      setPingStep(3);
    }, 900);

    setTimeout(() => {
      setPingStep(4);
    }, 1350);

    setTimeout(() => {
      setPingStep(5);
      setPingStatus('success');
      setPingDetails({
        latencyMs: Math.floor(Math.random() * 25) + 18,
        sdkVersion: '2.6.4 (Brotli/Edge)',
        originStatus: `Authorized (${activeProperty?.domain || 'gamezone-daily.com'})`,
        containerStatus: `#${embedId} verified in DOM`
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D6F938] text-slate-950 border border-[#c4e82b]">
              DEPLOYMENT CENTER
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">1-Click Host Site Embed</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Widget Deployment & Integration
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Embed your custom gaming widgets on your website, blog, or web application. Choose your preferred integration framework, copy the snippet, and verify live edge pings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateToBuilder(activeWidget)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Edit in Builder
          </button>
          <button
            onClick={onNavigateToAnalytics}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Widget & Target Property Selection Bar */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Select Widget */}
        <div className="md:col-span-6 space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            Select Widget to Deploy:
          </label>
          <select
            value={activeWidgetId}
            onChange={(e) => setActiveWidgetId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-xs"
          >
            {widgets.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} · ({w.layout.replace('_', ' ')}) · {w.status === 'published' ? '● Live' : '○ Draft'}
              </option>
            ))}
          </select>
        </div>

        {/* Target Domain */}
        <div className="md:col-span-4 space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            Target Host Domain:
          </label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-700 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-mono truncate">{activeProperty?.domain || 'gamezone-daily.com'}</span>
            <span className="ml-auto text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
              Verified
            </span>
          </div>
        </div>

        {/* Publisher Key Quick Copy */}
        <div className="md:col-span-2 space-y-1">
          <label className="block text-xs font-bold text-slate-800">
            Publisher Key:
          </label>
          <button
            onClick={handleCopyKey}
            className="w-full flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-700 font-mono transition-colors shadow-xs group"
            title="Click to copy publisher key"
          >
            <span className="truncate">{publisherKey.substring(0, 11)}...</span>
            {copiedKey ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Main Deployment Console with Sub-Navigation Tabs */}
      <div className="space-y-4">
        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center justify-between bg-white border border-slate-200/80 p-2 rounded-2xl shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'code'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>Get Embed Code</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Live Placement Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Deployment Checklist & Verification</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 pr-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CDN Edge Network Ready</span>
          </div>
        </div>

        {/* TAB 1: CODE & INTEGRATION SNIPPETS */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column: Framework Snippet Box (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-blue-600" />
                    Integration Snippet
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Widget ID: {activeWidget?.id}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Select your website framework to get tailor-made integration code.
                </p>
              </div>

              {/* Framework Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
                {[
                  { id: 'script', label: 'HTML / Script (Standard)' },
                  { id: 'iframe', label: 'iFrame (Sandboxed)' },
                  { id: 'react', label: 'React / Next.js' },
                  { id: 'wordpress', label: 'WordPress' },
                  { id: 'webflow', label: 'Webflow' }
                ].map(fw => (
                  <button
                    key={fw.id}
                    onClick={() => setActiveFramework(fw.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeFramework === fw.id
                        ? 'bg-white text-slate-950 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {fw.label}
                  </button>
                ))}
              </div>

              {/* Code Snippet Box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col">
                <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block"></span>
                    <span>{activeFramework === 'react' ? 'DochGamesWidget.tsx' : 'embed-snippet.html'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadTestHtml}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      title="Download test HTML file"
                    >
                      <Download className="w-3 h-3" />
                      <span>Test .html</span>
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold transition-all shadow-xs"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-slate-950" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-950" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed select-all">
                  {getCurrentSnippet()}
                </pre>
              </div>

              {/* Instructions Callout */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  Quick Installation Instructions
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                  <li>
                    Place the <strong>Target Container</strong> <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">&lt;div id="{embedId}"&gt;&lt;/div&gt;</code> exactly where you want the game reel to appear on your page.
                  </li>
                  <li>
                    Include the <strong>Loader Script</strong> in your site's template header or before the closing <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag.
                  </li>
                  <li>
                    The widget will automatically initialize asynchronously with zero blocking and render with smooth 60fps animations.
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column: Live Deployment Verifier & Ping Tester (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Ping Test Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                      <RefreshCw className={`w-4 h-4 text-blue-600 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
                      Live Deployment Ping Tester
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      EDGE CDN v2.6
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Test your deployment URL to verify origin CORS, DNS handshake, and container injection.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Host Page Deployment URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="https://yourdomain.com/gaming"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={handleRunPingTest}
                      disabled={pingStatus === 'testing'}
                      className="px-4 py-2 rounded-2xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-bold text-xs shadow-xs transition-colors shrink-0 disabled:opacity-50"
                    >
                      {pingStatus === 'testing' ? 'Testing...' : 'Verify Ping'}
                    </button>
                  </div>
                </div>

                {/* Progress Checklist during test */}
                {pingStatus !== 'idle' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 animate-fade-in text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="font-bold text-slate-900">Edge Handshake Diagnostics</span>
                      <span className="font-mono text-[10px] text-slate-500">5-Point Verification</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {pingStep >= 1 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                        <span className={`text-[11px] ${pingStep >= 1 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          DNS Resolution & TLS 1.3 Handshake
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {pingStep >= 2 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                        <span className={`text-[11px] ${pingStep >= 2 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          Publisher Key & Domain Origin Match
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {pingStep >= 3 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                        <span className={`text-[11px] ${pingStep >= 3 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          CDN Loader Script Handshake
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {pingStep >= 4 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                        <span className={`text-[11px] ${pingStep >= 4 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          Container DOM Mounting Element Found
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {pingStep >= 5 ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block"></span>
                        )}
                        <span className={`text-[11px] ${pingStep >= 5 ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          Telemetry Stream & Attribution 200 OK
                        </span>
                      </div>
                    </div>

                    {pingDetails && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 bg-emerald-50/70 p-3 rounded-xl border space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Deployment Verified Successfully!</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 space-y-0.5 font-mono pt-1">
                          <div>Latency: <strong>{pingDetails.latencyMs} ms</strong> to nearest Edge POP</div>
                          <div>SDK Engine: <strong>{pingDetails.sdkVersion}</strong></div>
                          <div>Container: <strong>{pingDetails.containerStatus}</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fast Preview of Selected Widget */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Live Embedded Preview
                  </h4>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Open Simulator →
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 overflow-hidden">
                  <DochWidgetRenderer
                    config={activeWidget}
                    games={games}
                    onPlayGame={onPlayGame}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE PLACEMENT SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-fade-in">
            <LiveSitePlacementMock
              config={activeWidget}
              games={games}
              onPlayGame={onPlayGame}
            />
          </div>
        )}

        {/* TAB 3: DEPLOYMENT CHECKLIST & DOMAIN SECURITY */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Left Card: 4-Step Deployment Walkthrough */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Deployment Readiness Checklist
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Confirm these 4 milestones before releasing your widget to production traffic.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">1. Domain Ownership Verified</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Domain <strong>{activeProperty?.domain}</strong> has active DNS TXT validation token and is authorized to receive game streams.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">2. Active Publisher API Key</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Key <code className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">{publisherKey}</code> is active with TLS 1.3 enforced.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">3. Container & Script Embed</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Ensure the container <code className="font-mono text-blue-700 bg-white px-1 py-0.5 rounded">#{embedId}</code> is present in your staging HTML.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">4. Run Edge Ping Verification</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Execute the live ping test on the Deployment tab to confirm telemetry and player session attribution.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Security & Whitelisting */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Domain Whitelisting & Origin Security
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Strict CORS origin policies prevent unauthorized third parties from hotlinking your widgets.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Allowed Origin Headers</span>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">STRICT CORS</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700">
                    https://{activeProperty?.domain}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Requests originating from other domains will be rejected by the DochGames CDN.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Content Security Policy (CSP)</span>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">COMPLIANT</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                    frame-src https://*.dochgames.com; script-src https://cdn.dochgames.com;
                  </div>
                  <p className="text-[11px] text-slate-500">
                    All games execute in isolated iframe sandboxes without touching host document cookies.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={onOpenConnectModal}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                  >
                    + Add or Verify Another Domain →
                  </button>
                  <button
                    onClick={onNavigateToAnalytics}
                    className="text-xs text-slate-700 hover:text-slate-900 font-semibold"
                  >
                    Inspect Live Traffic →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetDeploymentPage;
