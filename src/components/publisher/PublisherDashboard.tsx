import React, { useState } from 'react';
import { 
  Globe, Layout, BarChart3, Plus, Key, CheckCircle, 
  ArrowRight, ShieldCheck, Flame, Play, AlertCircle, X, ChevronRight, Eye,
  Copy, Check, Code2, Sparkles, TrendingUp
} from 'lucide-react';
import { PublisherProperty, WidgetConfig, GameItem, ActivityEvent, UserProfile } from '../../types';
import { GigaMascot } from '../common/GigaMascot';
import { DochWidgetRenderer } from '../widgets/DochWidgetRenderer';

interface PublisherDashboardProps {
  currentUser: UserProfile;
  properties: PublisherProperty[];
  widgets: WidgetConfig[];
  games: GameItem[];
  activities?: ActivityEvent[];
  onOpenConnectModal: () => void;
  onNavigateToBuilder: () => void;
  onNavigateToDeployment: (widgetId?: string) => void;
  onNavigateToAnalytics: () => void;
  onNavigateToWidgets: () => void;
  onPlayGame: (game: GameItem) => void;
  onOpenNotifications?: () => void;
}

export const PublisherDashboard: React.FC<PublisherDashboardProps> = ({
  currentUser,
  properties,
  widgets,
  games,
  onOpenConnectModal,
  onNavigateToBuilder,
  onNavigateToDeployment,
  onNavigateToAnalytics,
  onNavigateToWidgets,
  onPlayGame
}) => {
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const totalImpressions = widgets.reduce((acc, w) => acc + w.stats.impressions, 0);
  const totalGameStarts = widgets.reduce((acc, w) => acc + w.stats.gameStarts, 0);
  const activeWidgetsCount = widgets.filter(w => w.status === 'published').length;
  const verifiedDomainsCount = properties.filter(p => p.verified).length;

  const onboardingCards = [
    {
      step: 1,
      title: 'Pillar 1: Configure your Smart Widget',
      desc: 'Pick your layout (Slit Reel, Coverflow, Stacked Deck, Mini Reel) and customize game curation, sizing, and theme.',
      cta: 'Open Widget Builder',
      action: onNavigateToBuilder
    },
    {
      step: 2,
      title: 'Pillar 2: Deploy & Embed on your Website',
      desc: 'Get your 1-click HTML script, iFrame, React, or WordPress code snippet, and verify live edge pings.',
      cta: 'Open Deployment Hub',
      action: () => onNavigateToDeployment()
    },
    {
      step: 3,
      title: 'Pillar 3: Inspect Live Engagement Analytics',
      desc: 'Monitor real-time audience dwell time, click-to-play CTR conversions, and net ad syndication revenue.',
      cta: 'View Analytics',
      action: onNavigateToAnalytics
    }
  ];

  const currentOnboarding = onboardingCards[onboardingStep - 1] || onboardingCards[0];
  const primaryProperty = properties[0];

  const copyEmbedSnippet = () => {
    const snippet = `<script async src="https://cdn.dochgames.com/sdk/v2/loader.js" data-publisher-key="${primaryProperty?.publisherKey || 'pub_live_demo'}"></script>\n<div id="doch-widget-root"></div>`;
    navigator.clipboard.writeText(snippet);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
              Publisher Workspace
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{currentUser.companyOrStudio || 'Media Network'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-slate-500 text-xs mt-1 max-w-xl">
            Syndicate DochGames across your properties. Generate publisher keys, customize interactive reels, and inspect live player attribution.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            Connect Site/App
          </button>

          <button
            onClick={() => onNavigateToDeployment()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Code2 className="w-4 h-4 text-blue-600" />
            Deploy Widget
          </button>

          <button
            onClick={onNavigateToBuilder}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Build Widget
          </button>
        </div>
      </div>

      {/* Progressive Onboarding Card (Section 4 UX requirement) */}
      {!onboardingDismissed && (
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border border-blue-100 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-4">
            <GigaMascot mood="happy" size="sm" className="hidden sm:block" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Quick Start Walkthrough ({onboardingStep}/3)
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                {currentOnboarding.title}
              </h3>
              <p className="text-slate-600 text-xs mt-0.5 max-w-xl leading-relaxed">
                {currentOnboarding.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <button
              onClick={currentOnboarding.action}
              className="px-4 py-2 rounded-full bg-[#D6F938] text-slate-950 text-xs font-bold hover:bg-[#cbf026] shadow-xs transition-colors"
            >
              {currentOnboarding.cta}
            </button>

            {onboardingStep < 3 ? (
              <button
                onClick={() => setOnboardingStep(prev => prev + 1)}
                className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setOnboardingDismissed(true)}
                className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                Complete
              </button>
            )}

            <button
              onClick={() => setOnboardingDismissed(true)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
              title="Skip onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid - Matching TrendTide Metric Card Anatomy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div 
          onClick={onNavigateToWidgets}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Active Widgets</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeWidgetsCount} <span className="text-xs font-normal text-slate-400">/ {widgets.length} total</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-3 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> All endpoints operational
          </div>
        </div>

        <div 
          onClick={onNavigateToAnalytics}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Total Impressions</span>
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-3 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> ↑ 18.4% this month
          </div>
        </div>

        <div 
          onClick={onNavigateToAnalytics}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Game Starts (Plays)</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
            {totalGameStarts.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-3">
            Avg. 7.9% click-to-play rate
          </div>
        </div>

        <div 
          onClick={onOpenConnectModal}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Verified Properties</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {verifiedDomainsCount} <span className="text-xs font-normal text-slate-400">Domains</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-1 font-mono">
            <Key className="w-3 h-3 text-blue-600" /> Keys verified & active
          </div>
        </div>
      </div>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Syndication Spotlight (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Widgets Spotlight */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Active Live Widgets
                </h3>
                <p className="text-slate-500 text-xs">Currently deployed across your connected domains</p>
              </div>
              <button
                onClick={onNavigateToWidgets}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                View all ({widgets.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {widgets[0] && (
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span>Showing: <strong className="text-slate-900 font-semibold">{widgets[0].name}</strong> ({widgets[0].placement})</span>
                  <span className="text-emerald-600 font-mono font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full text-[10px]">
                    ● LIVE 200 OK
                  </span>
                </div>
                <DochWidgetRenderer 
                  config={widgets[0]} 
                  games={games} 
                  onPlayGame={onPlayGame} 
                />
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Ready to inject into your host layout</span>
                  <button
                    onClick={() => onNavigateToDeployment(widgets[0].id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-bold text-xs transition-all shadow-xs"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Deploy to Site →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Launch Widget Formats */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Deploy New Widget Format
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">High-CTR layouts pre-optimized for desktop and mobile web</p>
              </div>
              <button
                onClick={onNavigateToBuilder}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                Open Builder →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div 
                onClick={onNavigateToBuilder}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">Slit Reel Bar</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-semibold">Editorial Fit</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Ultra-sleek horizontal marquee embedded beneath article headers or review bodies.
                </p>
              </div>

              <div 
                onClick={onNavigateToBuilder}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">Coverflow Reel</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono font-semibold">High CTR</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Interactive 3D carousel that lets readers swipe through game covers with instant launch.
                </p>
              </div>

              <div 
                onClick={onNavigateToBuilder}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">Floating Overlay (FAB)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-semibold">Zero Layout Shift</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Docked corner launcher opening a slide-out game drawer without taking up layout space.
                </p>
              </div>

              <div 
                onClick={onNavigateToBuilder}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 hover:bg-white cursor-pointer transition-all shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">Stacked Grid Arcade</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono font-semibold">Hub Destination</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Full multi-row responsive gaming grid for dedicated entertainment landing pages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Connected Properties & Fast Embed */}
        <div className="space-y-6">
          {/* Connected Properties & Credentials Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Connected Host Properties
              </h3>
              <button
                onClick={onOpenConnectModal}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold"
              >
                + Connect
              </button>
            </div>

            <div className="space-y-2">
              {properties.map(p => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {p.name}
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.2 rounded-full">
                        Verified
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                      {p.domain}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-600 font-mono text-[11px] block">
                      {p.totalWidgets || 1} widget(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick 1-Click Embed Snippet Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-600" />
                Publisher Embed Code
              </h4>
              <button
                onClick={copyEmbedSnippet}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-slate-500 text-[11px]">
              Paste this loader script into your site's <code className="text-blue-600 font-mono bg-blue-50 px-1 py-0.5 rounded">&lt;head&gt;</code> or template.
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl font-mono text-[11px] overflow-x-auto select-all shadow-inner">
              &lt;script async src="https://cdn.dochgames.com/sdk/v2/loader.js" data-publisher-key="{primaryProperty?.publisherKey || 'pub_live_9921'}"&gt;&lt;/script&gt;
            </div>
          </div>

          {/* Developer Integration Docs Shortcut */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2 text-xs">
            <h4 className="font-display font-bold text-slate-900">Developer Integration Docs</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Need shadow DOM style isolation or custom CMP consent flags? Read our developer guides.
            </p>
            <div className="pt-1">
              <span className="text-blue-600 font-bold cursor-pointer hover:underline">
                View API & Embed Documentation →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;
