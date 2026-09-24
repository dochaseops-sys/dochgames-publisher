import React, { useState } from 'react';
import { 
  WidgetConfig, PublisherProperty, WidgetLifecycleStatus, WidgetTemplateId 
} from '../../../types';
import { 
  Plus, Search, Filter, MoreVertical, Copy, Trash2, 
  Play, Pause, ExternalLink, Code, Edit3, AlertCircle, CheckCircle2, Clock 
} from 'lucide-react';
import { deleteWidget, duplicateWidget, pauseWidget, resumeWidget } from '../../../services/widgets';

interface WidgetsPageProps {
  widgets: WidgetConfig[];
  properties: PublisherProperty[];
  onCreateWidget: () => void;
  onSelectWidget: (widgetId: string, step?: 1 | 2 | 3) => void;
  onRefresh: () => void;
}

export const WidgetsPage: React.FC<WidgetsPageProps> = ({
  widgets,
  properties,
  onCreateWidget,
  onSelectWidget,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Widget to delete confirmation
  const [widgetToDelete, setWidgetToDelete] = useState<WidgetConfig | null>(null);

  // Filter widgets
  const filteredWidgets = widgets.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty = selectedPropertyId === 'all' || w.propertyId === selectedPropertyId;
    const matchesStatus = selectedStatus === 'all' || w.lifecycleStatus === selectedStatus;
    return matchesSearch && matchesProperty && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (widgetToDelete) {
      deleteWidget(widgetToDelete.id);
      setWidgetToDelete(null);
      onRefresh();
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateWidget(id);
    onRefresh();
  };

  const handleTogglePause = (widget: WidgetConfig) => {
    if (widget.lifecycleStatus === 'paused') {
      resumeWidget(widget.id);
    } else {
      pauseWidget(widget.id);
    }
    onRefresh();
  };

  const renderStatusBadge = (status?: WidgetLifecycleStatus) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Live
          </span>
        );
      case 'ready_to_install':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Code className="w-3 h-3 text-blue-600" />
            Ready to install
          </span>
        );
      case 'installation_error':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Needs check
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
            <Pause className="w-3 h-3 text-slate-500" />
            Paused
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            <Clock className="w-3 h-3 text-slate-400" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            Your Widgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Create, personalise, and monitor your embedded game widgets.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateWidget}
          className="px-5 py-2.5 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create new widget</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search widgets by name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
          />
        </div>

        {/* Website Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
          >
            <option value="all">All Websites</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="live">Live</option>
            <option value="ready_to_install">Ready to install</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Widgets Grid */}
      {filteredWidgets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No widgets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or filters, or create a brand new game widget.
          </p>
          <button
            type="button"
            onClick={onCreateWidget}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-colors"
          >
            Create new widget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWidgets.map(w => {
            const isLive = w.lifecycleStatus === 'live';
            const isPaused = w.lifecycleStatus === 'paused';

            return (
              <div
                key={w.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Status & Template Name */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {w.templateId || 'carousel'}
                    </span>
                    {renderStatusBadge(w.lifecycleStatus)}
                  </div>

                  {/* Widget Name & Property */}
                  <h3 className="text-base font-bold font-display text-slate-900 leading-snug line-clamp-1 mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Website: <span className="font-semibold text-slate-700">{w.propertyName}</span>
                  </p>

                  {/* Quick Performance Numbers */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Plays</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {(w.stats?.gameStarts || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Views</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {(w.stats?.impressions || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">CTR</span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-600">
                        {w.stats?.ctr || 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectWidget(w.id, 2)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Customise</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectWidget(w.id, 3)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Install code</span>
                    </button>
                  </div>

                  {/* Secondary actions: Duplicate, Pause, Delete */}
                  <div className="flex items-center justify-between pt-1 text-slate-500 text-xs">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(w.id)}
                      className="hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                      title="Duplicate widget"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePause(w)}
                      className="hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
                    >
                      {isPaused ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWidgetToDelete(w)}
                      className="hover:text-rose-600 flex items-center gap-1 font-medium transition-colors"
                      title="Delete widget"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {widgetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Delete widget?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">{widgetToDelete.name}</span>? Games will immediately stop rendering anywhere this embed code was placed.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWidgetToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
