import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Calendar, 
  Filter, Play, Smartphone, Monitor, Tablet, Info, 
  Download, Clock, ArrowUpRight, ChevronRight, Sparkles,
  Layers, Code2, Globe, CheckCircle
} from 'lucide-react';
import { WidgetConfig, GameItem, PublisherProperty } from '../../types';

interface PublisherAnalyticsPageProps {
  widgets: WidgetConfig[];
  properties: PublisherProperty[];
  games: GameItem[];
  onNavigateToDeployment?: (widgetId?: string) => void;
  onNavigateToBuilder?: (widget?: WidgetConfig) => void;
  onPlayGame?: (game: GameItem) => void;
}

export const PublisherAnalyticsPage: React.FC<PublisherAnalyticsPageProps> = ({
  widgets,
  properties,
  games,
  onNavigateToDeployment,
  onNavigateToBuilder,
  onPlayGame
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedWidgetFilter, setSelectedWidgetFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filtered widgets based on selected property
  const filteredWidgets = widgets.filter(w => {
    if (selectedPropertyId !== 'all' && w.propertyId !== selectedPropertyId) return false;
    if (selectedWidgetFilter !== 'all' && w.id !== selectedWidgetFilter) return false;
    return true;
  });

  const totalImpressions = filteredWidgets.reduce((acc, w) => acc + w.stats.impressions, 0);
  const totalGameStarts = filteredWidgets.reduce((acc, w) => acc + w.stats.gameStarts, 0);
  const avgCtr = filteredWidgets.length > 0 
    ? (filteredWidgets.reduce((acc, w) => acc + w.stats.ctr, 0) / filteredWidgets.length).toFixed(1) 
    : '7.8';
  const estimatedRevenue = (totalGameStarts * 0.042).toFixed(2);
  const avgDwellTime = '4m 18s';

  // Daily trend dataset based on selected time range
  const dailyData = timeRange === '24h' ? [
    { label: '00:00', impressions: 4200, starts: 310 },
    { label: '04:00', impressions: 2100, starts: 160 },
    { label: '08:00', impressions: 8400, starts: 690 },
    { label: '12:00', impressions: 16800, starts: 1420 },
    { label: '16:00', impressions: 19400, starts: 1680 },
    { label: '20:00', impressions: 22100, starts: 1950 },
    { label: '23:59', impressions: 14300, starts: 1140 }
  ] : timeRange === '7d' ? [
    { label: 'Mon', impressions: 42000, starts: 3100 },
    { label: 'Tue', impressions: 48000, starts: 3750 },
    { label: 'Wed', impressions: 55000, starts: 4200 },
    { label: 'Thu', impressions: 51000, starts: 3900 },
    { label: 'Fri', impressions: 64000, starts: 5100 },
    { label: 'Sat', impressions: 82000, starts: 6900 },
    { label: 'Sun', impressions: 76000, starts: 6300 }
  ] : timeRange === '90d' ? [
    { label: 'Month 1', impressions: 240000, starts: 18500 },
    { label: 'Month 2', impressions: 310000, starts: 24900 },
    { label: 'Month 3', impressions: 418000, starts: 32800 }
  ] : [
    { label: 'Week 1', impressions: 82000, starts: 6400 },
    { label: 'Week 2', impressions: 98000, starts: 7900 },
    { label: 'Week 3', impressions: 112000, starts: 8900 },
    { label: 'Week 4', impressions: 126000, starts: 9640 }
  ];

  const maxImp = Math.max(...dailyData.map(d => d.impressions)) * 1.15 || 100000;
  const maxStarts = Math.max(...dailyData.map(d => d.starts)) * 1.15 || 10000;

  // Handle simulated CSV Export
  const handleExportCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      const rows = [
        ['Widget Name', 'Layout', 'Placement', 'Status', 'Impressions', 'Game Starts', 'CTR (%)', 'Est. Revenue ($)'],
        ...filteredWidgets.map(w => [
          `"${w.name}"`,
          w.layout,
          w.placement,
          w.status,
          w.stats.impressions,
          w.stats.gameStarts,
          w.stats.ctr,
          (w.stats.gameStarts * 0.042).toFixed(2)
        ])
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `dochgames-analytics-report-${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D6F938] text-slate-950 border border-[#c4e82b]">
              ANALYTICS & ATTRIBUTION
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Syndication Telemetry</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Widget Performance & Audience Insights
          </h1>
          <p className="text-slate-500 text-xs mt-1 max-w-2xl">
            Track reader engagement, click-to-play conversions, dwell time extension, and net advertising revenue across your host properties.
          </p>
        </div>

        {/* Filter Controls & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Property Selector */}
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.domain})</option>
            ))}
          </select>

          {/* Time range pills */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/70">
            {(['24h', '7d', '30d', '90d'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                  timeRange === tr 
                    ? 'bg-[#D6F938] text-slate-950 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tr.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export Report CTA */}
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Impressions */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold">Total Impressions</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalImpressions.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 mt-2.5 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +18.4% vs prev
            </div>
          </div>
        </div>

        {/* Game Starts */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold">Game Starts (Plays)</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
              {totalGameStarts.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 mt-2.5 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +24.1% velocity
            </div>
          </div>
        </div>

        {/* Click-to-Play CTR */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold">Click-to-Play CTR</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {avgCtr}%
            </div>
            <div className="text-[11px] text-slate-500 mt-2.5 font-medium">
              Industry benchmark: 3.2%
            </div>
          </div>
        </div>

        {/* Avg Dwell Time */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold">Avg. Dwell Time</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {avgDwellTime}
            </div>
            <div className="text-[11px] text-emerald-600 mt-2.5 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +3.2 min extension
            </div>
          </div>
        </div>

        {/* Estimated Ad Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-semibold">Estimated Net Revenue</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
              ${estimatedRevenue}
            </div>
            <div className="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" /> eCPM: ~$3.30 net
            </div>
          </div>
        </div>
      </div>

      {/* Main Trends Chart & Platform Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Audience Impressions vs. Game Starts
              </h3>
              <p className="text-slate-500 text-xs">
                Real-time volume telemetry with time filter ({timeRange.toUpperCase()})
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
                Impressions
              </span>
              <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
                Game Starts
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with TrendTide styling */}
          <div className="h-64 pt-6 flex items-end justify-between gap-3 border-b border-slate-100 pb-3">
            {dailyData.map((d, i) => {
              const impHeight = (d.impressions / maxImp) * 100;
              const startHeight = (d.starts / maxStarts) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-slate-900 border border-slate-800 p-2 rounded-xl text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <div>{d.impressions.toLocaleString()} views</div>
                    <div className="text-orange-400 font-bold">{d.starts.toLocaleString()} game starts</div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    {/* Impressions Bar */}
                    <div 
                      className="w-1/2 bg-slate-200 hover:bg-slate-300 rounded-t-md transition-all duration-300"
                      style={{ height: `${Math.max(8, impHeight)}%` }}
                    />
                    {/* Game Starts Bar */}
                    <div 
                      className="w-1/2 bg-orange-500 hover:bg-orange-600 rounded-t-md transition-all duration-300 shadow-xs"
                      style={{ height: `${Math.max(8, startHeight)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 truncate max-w-[60px] text-center">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Aggregated across {filteredWidgets.length} active widget endpoint(s)</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> 99.98% Telemetry Uptime
            </span>
          </div>
        </div>

        {/* Right Column: Device & Platform Split + Geo */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <h3 className="font-display font-bold text-base text-slate-900">
            Device & Platform Split
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Mobile Web (iOS & Android)
                </span>
                <span className="font-bold text-slate-900">64%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-indigo-600" />
                  Desktop Browsers
                </span>
                <span className="font-bold text-slate-900">29%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '29%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-600 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-purple-600" />
                  Tablet & Foldables
                </span>
                <span className="font-bold text-slate-900">7%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>

          {/* Geographic breakdown */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Top Geographic Markets</span>
              <Globe className="w-3.5 h-3.5 text-blue-600" />
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { country: 'United States', share: '42%' },
                { country: 'United Kingdom', share: '18%' },
                { country: 'Germany', share: '14%' },
                { country: 'Canada', share: '9%' },
                { country: 'Other Global', share: '17%' }
              ].map((geo, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-600">
                  <span>{geo.country}</span>
                  <span className="font-bold text-slate-900">{geo.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Widget-by-Widget Performance Breakdown Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Widget-by-Widget Performance Table
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Compare conversion rates, total game starts, and dwell time contribution per deployed widget.
            </p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {filteredWidgets.length} Deployed Endpoint(s)
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Widget Name</th>
                <th className="py-3 px-3">Layout & Slot</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Impressions</th>
                <th className="py-3 px-3 text-right">Plays</th>
                <th className="py-3 px-3 text-right">CTR</th>
                <th className="py-3 px-3 text-right">Revenue</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWidgets.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{w.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{w.propertyName}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {w.layout.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[10px] ml-1.5 capitalize">({w.placement})</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      w.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {w.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-900">
                    {w.stats.impressions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-blue-600">
                    {w.stats.gameStarts.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-bold text-slate-900">{w.stats.ctr}%</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-600">
                    ${(w.stats.gameStarts * 0.042).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {onNavigateToDeployment && (
                        <button
                          onClick={() => onNavigateToDeployment(w.id)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1"
                          title="Get Embed Code"
                        >
                          <Code2 className="w-3 h-3 text-blue-600" />
                          <span>Code</span>
                        </button>
                      )}
                      {onNavigateToBuilder && (
                        <button
                          onClick={() => onNavigateToBuilder(w)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                          title="Edit in Builder"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Syndicated Games */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Top Performing Syndicated Games
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Titles driving the highest player starts and retention across your audience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.slice(0, 3).map((game, idx) => (
            <div 
              key={game.id}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-3 group hover:border-blue-400 hover:bg-white transition-all shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                  <img
                    src={game.media.thumbnailUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-slate-900/80 text-[10px] text-white flex items-center justify-center font-bold font-mono">
                    #{idx + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{game.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{game.genre} · {game.studioName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-blue-600 font-mono">
                      {game.stats.totalPlays.toLocaleString()} plays
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      ★ {game.stats.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Avg Session: <strong className="text-slate-800 font-medium">3m 42s</strong>
                </span>
                {onPlayGame && (
                  <button
                    onClick={() => onPlayGame(game)}
                    className="px-3 py-1 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test Play</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublisherAnalyticsPage;
