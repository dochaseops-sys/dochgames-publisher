import React, { useState } from 'react';
import { 
  Plus, Edit3, Copy, Trash2, Play, Pause, Code, 
  ExternalLink, Sparkles, Filter, CheckCircle, Eye, AlertCircle, X
} from 'lucide-react';
import { WidgetConfig, GameItem, PublisherProperty } from '../../types';
import { DochWidgetRenderer } from '../widgets/DochWidgetRenderer';

interface MyWidgetsPageProps {
  widgets: WidgetConfig[];
  properties: PublisherProperty[];
  games: GameItem[];
  onCreateNew: () => void;
  onEditWidget: (widget: WidgetConfig) => void;
  onDuplicateWidget: (widget: WidgetConfig) => void;
  onToggleStatus: (widgetId: string) => void;
  onDeleteWidget: (widgetId: string) => void;
  onPlayGame: (game: GameItem) => void;
  onNavigateToDeployment?: (widgetId: string) => void;
}

export const MyWidgetsPage: React.FC<MyWidgetsPageProps> = ({
  widgets,
  properties,
  games,
  onCreateNew,
  onEditWidget,
  onDuplicateWidget,
  onToggleStatus,
  onDeleteWidget,
  onPlayGame,
  onNavigateToDeployment
}) => {
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [previewWidget, setPreviewWidget] = useState<WidgetConfig | null>(null);
  const [activeCodeModalWidget, setActiveCodeModalWidget] = useState<WidgetConfig | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const filteredWidgets = widgets.filter(w => {
    if (filterProperty === 'all') return true;
    return w.propertyId === filterProperty;
  });

  const getEmbedCode = (w: WidgetConfig) => {
    const prop = properties.find(p => p.id === w.propertyId);
    const pubKey = prop?.publisherKey || 'pub_live_xxxxxxxx';
    return `<script 
  src="https://cdn.dochgames.com/v1/widget.js" 
  data-publisher="${pubKey}" 
  data-widget="${w.id}" 
  async>
</script>
<div id="dochgames-widget-${w.id}"></div>`;
  };

  const handleCopyCode = (w: WidgetConfig) => {
    navigator.clipboard.writeText(getEmbedCode(w));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Syndicated Widgets
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manage your live embedded game reels, placement slots, and real-time CTR analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Properties ({widgets.length})</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Build New Widget
          </button>
        </div>
      </div>

      {/* Widgets Table / Cards */}
      <div className="space-y-4">
        {filteredWidgets.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/80 rounded-3xl shadow-sm">
            <h4 className="font-display text-lg font-bold text-slate-900 mb-2">No widgets found</h4>
            <p className="text-slate-500 text-xs mb-4">You have not created any widgets for this property yet.</p>
            <button
              onClick={onCreateNew}
              className="px-5 py-2.5 rounded-full bg-[#D6F938] text-slate-950 text-xs font-bold hover:bg-[#cbf026] shadow-xs"
            >
              Build Your First Widget
            </button>
          </div>
        ) : (
          filteredWidgets.map(widget => (
            <div
              key={widget.id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display font-bold text-base text-slate-900">
                    {widget.name}
                  </h3>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    widget.status === 'published' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}>
                    {widget.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-500">v{widget.version}</span>
                  {widget.version > (widget.publishedVersion || 1) && (
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      Unpublished Draft Edits
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>Property: <strong className="text-slate-800">{widget.propertyName}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Placement: <strong className="text-blue-600 uppercase font-semibold">{widget.placement}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Layout: <strong>{widget.layout.replace('_', ' ')}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Games: <strong>{widget.gameCount}</strong></span>
                </div>

                {/* Metrics row */}
                <div className="flex items-center gap-5 pt-1.5 text-xs">
                  <div className="text-slate-500">
                    Impressions: <strong className="text-slate-900 font-bold">{widget.stats.impressions.toLocaleString()}</strong>
                  </div>
                  <div className="text-slate-500">
                    Game Starts: <strong className="text-blue-600 font-bold">{widget.stats.gameStarts.toLocaleString()}</strong>
                  </div>
                  <div className="text-slate-500">
                    CTR: <strong className="text-emerald-600 font-bold">{widget.stats.ctr}%</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                <button
                  onClick={() => setPreviewWidget(widget)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  Preview
                </button>

                {onNavigateToDeployment ? (
                  <button
                    onClick={() => onNavigateToDeployment(widget.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-bold text-xs transition-all shadow-xs"
                  >
                    <Code className="w-3.5 h-3.5" />
                    Deploy
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveCodeModalWidget(widget)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 transition-colors shadow-xs"
                  >
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    Get Code
                  </button>
                )}

                <button
                  onClick={() => onEditWidget(widget)}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
                  title="Edit Widget"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDuplicateWidget(widget)}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
                  title="Duplicate Widget"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onToggleStatus(widget.id)}
                  className={`p-2 rounded-full border transition-colors shadow-xs ${
                    widget.status === 'published'
                      ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                  }`}
                  title={widget.status === 'published' ? 'Pause Widget' : 'Activate Widget'}
                >
                  {widget.status === 'published' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onDeleteWidget(widget.id)}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-xs"
                  title="Delete Widget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Standalone Preview Modal */}
      {previewWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {previewWidget.name} (Live Interactive Preview)
              </h3>
              <button
                onClick={() => setPreviewWidget(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
              <DochWidgetRenderer 
                config={previewWidget} 
                games={games} 
                onPlayGame={onPlayGame} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Code Snippet Modal */}
      {activeCodeModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Integration Embed Snippet
              </h3>
              <button
                onClick={() => setActiveCodeModalWidget(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Insert this script into your HTML page where you want the widget to appear:
            </p>

            <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-400 overflow-x-auto select-all shadow-inner">
              {getEmbedCode(activeCodeModalWidget)}
            </pre>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopyCode(activeCodeModalWidget)}
                className="px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
              >
                {copiedCode ? 'Copied!' : 'Copy Code Snippet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWidgetsPage;
