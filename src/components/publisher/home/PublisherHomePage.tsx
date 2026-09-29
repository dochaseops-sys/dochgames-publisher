import React from 'react';
import { WidgetConfig, PublisherProperty, GameItem } from '../../../types';
import { 
  Sparkles, Plus, ArrowRight, Play, Eye, Clock, 
  DollarSign, CheckCircle2, Circle, AlertCircle, ExternalLink, HelpCircle,
  Edit3, Code, Layers
} from 'lucide-react';

interface PublisherHomePageProps {
  widgets: WidgetConfig[];
  properties: PublisherProperty[];
  onCreateWidget: () => void;
  onSelectWidget: (widgetId: string, step?: 1 | 2 | 3) => void;
  onNavigateTab: (tab: 'widgets' | 'analytics' | 'websites' | 'help') => void;
  onConnectWebsite: () => void;
  onOpenOnboarding?: () => void;
}

export const PublisherHomePage: React.FC<PublisherHomePageProps> = ({
  widgets,
  properties,
  onCreateWidget,
  onSelectWidget,
  onNavigateTab,
  onConnectWebsite,
  onOpenOnboarding
}) => {
  // Aggregate stats
  const totalImpressions = widgets.reduce((acc, w) => acc + (w.stats?.impressions || 0), 0);
  const totalPlays = widgets.reduce((acc, w) => acc + (w.stats?.gameStarts || 0), 0);
  const activeWidgets = widgets.filter(w => w.lifecycleStatus === 'live');
  const draftWidgets = widgets.filter(w => w.lifecycleStatus === 'draft' || w.lifecycleStatus === 'ready_to_install');

  // Checklist items
  const hasWebsite = properties.length > 0;
  const hasWidget = widgets.length > 0;
  const hasLiveWidget = activeWidgets.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-[#D6F938]" /> DochGames Publisher Platform
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight leading-tight">
            Engage your audience with instant web games
          </h1>
          <p className="mt-2 text-xs sm:text-base text-slate-300 leading-relaxed">
            Add responsive, ad-monetised web games to your site in minutes without writing code. Keep visitors on your pages up to 3x longer.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onCreateWidget}
              className="w-full sm:w-auto justify-center px-5 py-3 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create new widget</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('websites')}
              className="w-full sm:w-auto justify-center px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <span>Manage websites</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="w-full sm:w-auto justify-center px-4 py-3 rounded-2xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D6F938]" />
                <span>Launch Quick Wizard</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-12 translate-y-12">
          <div className="w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
        </div>
      </div>

      {/* Setup Checklist (Always visible until live widget exists) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
              Quick Setup Checklist
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these simple steps to start streaming games on your property.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenOnboarding && (
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                title="Open 3-step setup walkthrough"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Guided wizard</span>
              </button>
            )}
            <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              {[hasWebsite, hasWidget, hasLiveWidget].filter(Boolean).length} of 3 complete
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Connect Website */}
          <div
            onClick={!hasWebsite ? onConnectWebsite : () => onNavigateTab('websites')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              hasWebsite
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">1. Connect website</span>
              {hasWebsite ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-xs text-slate-600">
              {hasWebsite
                ? `${properties.length} website(s) connected`
                : 'Add your domain to get an embed key.'}
            </p>
          </div>

          {/* Step 2: Create Widget */}
          <div
            onClick={!hasWidget ? onCreateWidget : () => onNavigateTab('widgets')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              hasWidget
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">2. Pick a template</span>
              {hasWidget ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-xs text-slate-600">
              {hasWidget
                ? `${widgets.length} widget(s) created`
                : 'Choose a carousel, grid, or floating button.'}
            </p>
          </div>

          {/* Step 3: Install & Go Live */}
          <div
            onClick={() => {
              if (widgets[0]) {
                onSelectWidget(widgets[0].id, 3);
              } else {
                onCreateWidget();
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              hasLiveWidget
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-slate-50 border-slate-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">3. Install & verify</span>
              {hasLiveWidget ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-xs text-slate-600">
              {hasLiveWidget
                ? `${activeWidgets.length} widget(s) active on site`
                : 'Paste the snippet on your site and verify.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Game Plays</span>
            <Play className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {totalPlays.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>↑ +18.4% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Widget Impressions</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            <span>Across all websites</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Avg. Play Duration</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            3m 42s
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>+210% session duration</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Widgets</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {activeWidgets.length} <span className="text-sm font-normal text-slate-400">/ {widgets.length}</span>
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1 cursor-pointer" onClick={() => onNavigateTab('widgets')}>
            <span>View all widgets →</span>
          </div>
        </div>
      </div>

      {/* Recent Widgets Table / List */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
              Your Widgets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your game placements across your connected sites.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('widgets')}
            className="whitespace-nowrap shrink-0 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5 sm:mt-0"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {widgets.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">No widgets created yet.</p>
            <button
              type="button"
              onClick={onCreateWidget}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Create your first widget
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {widgets.slice(0, 5).map(w => {
              const isLive = w.lifecycleStatus === 'live';
              const isDraft = w.lifecycleStatus === 'draft';
              const isReady = w.lifecycleStatus === 'ready_to_install';

              return (
                <div
                  key={w.id}
                  className="py-3.5 px-2 rounded-2xl hover:bg-slate-50/70 transition-colors"
                >
                  {/* Top row: Format icon, Name (truncated), Status badge (shrink-0) */}
                  <div className="flex items-center justify-between gap-2.5 w-full">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 truncate" title={w.name}>
                        {w.name}
                      </h3>
                    </div>

                    {/* Status Badge: shrink-0 & whitespace-nowrap prevents it from overflowing */}
                    <div className="shrink-0 whitespace-nowrap pl-1">
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Live
                        </span>
                      )}
                      {isDraft && (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600">
                          Draft
                        </span>
                      )}
                      {isReady && (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                          Ready to install
                        </span>
                      )}
                      {w.lifecycleStatus === 'installation_error' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                          Needs check
                        </span>
                      )}
                      {w.lifecycleStatus === 'paused' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-600">
                          Paused
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtitle row */}
                  <p className="text-xs text-slate-500 mt-1 pl-9 truncate">
                    <span className="font-medium text-slate-700">{w.propertyName}</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span>{w.gameCount} games</span>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span>{(w.stats?.gameStarts || 0).toLocaleString()} plays</span>
                  </p>

                  {/* Actions row: refined touch buttons */}
                  <div className="flex items-center gap-2 mt-2.5 pl-0 sm:pl-9">
                    <button
                      type="button"
                      onClick={() => onSelectWidget(w.id, 2)}
                      className="flex-1 sm:flex-initial text-center px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Customise</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectWidget(w.id, 3)}
                      className="flex-1 sm:flex-initial text-center px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Install code</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
