import React, { useState } from 'react';
import { WidgetConfig } from '../../../types';
import { 
  BarChart3, TrendingUp, Play, Eye, Clock, 
  DollarSign, Sparkles, ArrowUpRight, Lightbulb, CheckCircle2 
} from 'lucide-react';

interface PublisherAnalyticsPageProps {
  widgets: WidgetConfig[];
  onSelectWidget: (widgetId: string, step?: 1 | 2 | 3) => void;
}

export const PublisherAnalyticsPage: React.FC<PublisherAnalyticsPageProps> = ({
  widgets,
  onSelectWidget
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Aggregate stats
  const totalImpressions = widgets.reduce((acc, w) => acc + (w.stats?.impressions || 0), 0);
  const totalPlays = widgets.reduce((acc, w) => acc + (w.stats?.gameStarts || 0), 0);
  const avgCtr = widgets.length > 0 
    ? (widgets.reduce((acc, w) => acc + (w.stats?.ctr || 0), 0) / widgets.length).toFixed(1)
    : '0.0';
  const estimatedRevenue = (totalPlays * 0.042).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            Performance & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track visitor engagement, play times, and syndication revenue from your game widgets.
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-xs w-full sm:w-auto justify-between sm:justify-start">
          {[
            { id: '7d', label: 'Last 7 days' },
            { id: '30d', label: 'Last 30 days' },
            { id: '90d', label: 'All time' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeRange(t.id as any)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                timeRange === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Outcome Metrics */}
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
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.2% vs previous period</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Widget Views</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Avg CTR: {avgCtr}%</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Avg. Engagement</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            3m 42s
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            <span>3.2x typical web article read time</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Estimated Rev-Share</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-600">
            ${estimatedRevenue}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Paid monthly via direct transfer</span>
          </div>
        </div>
      </div>

      {/* Performance by Widget Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
              Breakdown by Widget Placement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review which widgets generate the most engagement on your websites.
            </p>
          </div>
        </div>

        {widgets.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No widgets available to display statistics.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[580px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Widget Name</th>
                  <th className="py-3 px-3">Website</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3 text-right">Views</th>
                  <th className="py-3 px-3 text-right">Game Plays</th>
                  <th className="py-3 px-3 text-right">CTR</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {widgets.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {w.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {w.propertyName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full text-[11px] capitalize">
                        {w.templateId || 'carousel'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono">
                      {(w.stats?.impressions || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                      {(w.stats?.gameStarts || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-600 font-bold">
                      {w.stats?.ctr || 0}%
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectWidget(w.id, 2)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Optimise →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 sm:hidden mt-2 text-center">
            ← Swipe horizontally to see complete statistics →
          </p>
        </div>
        )}
      </div>

      {/* Optimisation Tips & Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border border-blue-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span>Publisher Optimisation Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-blue-100 space-y-1">
            <div className="font-bold text-xs text-slate-900">Place high on article pages</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Carousels placed immediately below the article headline achieve 42% higher click-through than footer placements.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-blue-100 space-y-1">
            <div className="font-bold text-xs text-slate-900">Match website colour theme</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Widgets with accent colours matching your brand identity generate 28% more initial interactions.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-blue-100 space-y-1">
            <div className="font-bold text-xs text-slate-900">Try a Floating Game Button</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If your editorial team is sensitive to page layout shifts, use the Floating Button format for seamless integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
