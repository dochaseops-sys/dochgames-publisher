import React from 'react';
import { 
  Gamepad2, Plus, CheckCircle, Clock, AlertTriangle, 
  BarChart3, ArrowRight, Play, Users, Globe, ExternalLink, Sparkles, TrendingUp 
} from 'lucide-react';
import { GameItem, UserProfile } from '../../types';
import { GigaMascot } from '../common/GigaMascot';

interface DeveloperDashboardProps {
  currentUser: UserProfile;
  games: GameItem[];
  onNavigateToSubmit: () => void;
  onNavigateToPortfolio: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToProfile: () => void;
  onPlayGame: (game: GameItem) => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  currentUser,
  games,
  onNavigateToSubmit,
  onNavigateToPortfolio,
  onNavigateToAnalytics,
  onNavigateToProfile,
  onPlayGame
}) => {
  const liveCount = games.filter(g => g.status === 'live').length;
  const inReviewCount = games.filter(g => g.status === 'in_review' || g.status === 'submitted').length;
  const changesCount = games.filter(g => g.status === 'changes_required').length;
  const totalPlays = games.reduce((acc, g) => acc + g.stats.totalPlays, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
              Developer Studio Console
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{currentUser.companyOrStudio || 'Independent Studio'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Studio Dashboard · {currentUser.name}
          </h2>
          <p className="text-slate-500 text-xs mt-1 max-w-xl">
            Distribute HTML5 & WebGL titles globally. Take advantage of automated pre-flight testing, fast human review, and real-time build synchronization.
          </p>
        </div>

        {/* Primary CTA Submit a Game */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Submit a Game
          </button>
        </div>
      </div>

      {/* Actionable Feedback Alert if Changes Required */}
      {changesCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-xs block">
                {changesCount} submission requires actionable developer revisions
              </span>
              <span className="text-[11px] text-slate-600 mt-0.5 block">
                DochGames QA reviewers have left specific notes on media or controls.
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToPortfolio}
            className="px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shrink-0 shadow-xs"
          >
            View Notes & Resubmit
          </button>
        </div>
      )}

      {/* Portfolio Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div 
          onClick={onNavigateToPortfolio}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Live Distributed Titles</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {liveCount} <span className="text-xs font-normal text-slate-400">/ {games.length} submitted</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-3 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            Active on 180+ publisher domains
          </div>
        </div>

        <div 
          onClick={onNavigateToPortfolio}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">In Review Queue</span>
            <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tracking-tight">
            {inReviewCount} <span className="text-xs font-normal text-slate-400">Titles</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-3">
            Turnaround time &lt; 24 hours
          </div>
        </div>

        <div 
          onClick={onNavigateToAnalytics}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Total Player Starts</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalPlays.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-3 inline-flex items-center gap-1 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> +32% month-over-month
          </div>
        </div>

        <div 
          onClick={onNavigateToProfile}
          className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-3">
            <span className="font-medium">Studio Profile Status</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified
          </div>
          <div className="text-[11px] text-slate-500 mt-3 font-mono">
            Direct Wire & PayPal Connected
          </div>
        </div>
      </div>

      {/* Live Titles Spotlight & Giga Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Your Top Performing Games
            </h3>
            <button
              onClick={onNavigateToPortfolio}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              View Full Portfolio →
            </button>
          </div>

          <div className="space-y-3">
            {games.slice(0, 3).map(g => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={g.media.thumbnailUrl}
                    alt={g.title}
                    className="w-14 h-14 rounded-xl object-cover shadow-xs"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">{g.title}</h4>
                    <span className="text-xs text-slate-500 font-medium">{g.genre} · v{g.version} · ★ {g.stats.rating}</span>
                    <div className="text-[11px] text-blue-600 font-bold mt-0.5">
                      {g.stats.totalPlays.toLocaleString()} total plays
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onPlayGame(g)}
                  className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current inline mr-1" />
                  Play
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot & Distribution Specs */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-2.5 text-xs">
            <h4 className="font-display font-bold text-slate-900 text-sm">
              Real-Time Build Distribution
            </h4>
            <p className="text-slate-600 leading-relaxed">
              When you upload builds (.zip or HTML5 packages), our WebSocket distribution relay immediately hashes and distributes them to connected publishers and QA testing sandboxes.
            </p>
          </div>

          <GigaMascot
            mood="helpful"
            size="md"
            speechBubble="Always make sure your audio context resumes on user touch to pass automated validation on mobile viewports!"
          />
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
