import React, { useState } from 'react';
import { 
  Gamepad2, Plus, MessageSquare, CheckCircle, Clock, 
  AlertCircle, Play, Eye, RefreshCw, Filter, Sparkles, Send, X 
} from 'lucide-react';
import { GameItem, GameReviewStatus, UserProfile } from '../../types';

interface MyGamesPageProps {
  games: GameItem[];
  currentUser: UserProfile;
  onAddNewGame: () => void;
  onPlayGame: (game: GameItem) => void;
  onResubmitGame: (gameId: string, note: string) => void;
}

export const MyGamesPage: React.FC<MyGamesPageProps> = ({
  games,
  currentUser,
  onAddNewGame,
  onPlayGame,
  onResubmitGame
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeFeedbackGame, setActiveFeedbackGame] = useState<GameItem | null>(null);
  const [resubmitMessage, setResubmitMessage] = useState<string>('');

  const filteredGames = games.filter(g => {
    if (statusFilter === 'all') return true;
    return g.status === statusFilter;
  });

  const getStatusBadge = (status: GameReviewStatus) => {
    switch (status) {
      case 'live':
        return <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">LIVE</span>;
      case 'approved':
        return <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">APPROVED</span>;
      case 'in_review':
        return <span className="bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">IN REVIEW</span>;
      case 'changes_required':
        return <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold">CHANGES REQUIRED</span>;
      case 'submitted':
        return <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">SUBMITTED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">{status.toUpperCase()}</span>;
    }
  };

  const handleSendResubmit = () => {
    if (!activeFeedbackGame || !resubmitMessage.trim()) return;
    onResubmitGame(activeFeedbackGame.id, resubmitMessage.trim());
    setResubmitMessage('');
    setActiveFeedbackGame(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Developer Game Portfolio & Review Queue
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Track status transitions, reviewer QA feedback, live syndication metrics, and resubmissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses ({games.length})</option>
            <option value="live">Live Titles</option>
            <option value="in_review">In Review</option>
            <option value="changes_required">Changes Required</option>
            <option value="submitted">Submitted</option>
          </select>

          <button
            onClick={onAddNewGame}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Submit New Title
          </button>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="space-y-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-150 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <img
                src={game.media.thumbnailUrl}
                alt={game.title}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-xs"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display font-bold text-base text-slate-900">
                    {game.title}
                  </h3>
                  {getStatusBadge(game.status)}
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-blue-600 font-mono font-semibold">v{game.version}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-500 font-medium">{game.genre}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                  {game.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                  <span>Studio: <strong className="text-slate-800">{game.studioName}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Plays: <strong className="text-slate-900 font-bold">{game.stats.totalPlays.toLocaleString()}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Rating: <strong className="text-amber-500 font-bold">★ {game.stats.rating}</strong></span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>Package: {game.technical.packageSizeMb} MB</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <button
                onClick={() => onPlayGame(game)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play Sandbox
              </button>

              {game.reviewNotes && game.reviewNotes.length > 0 && (
                <button
                  onClick={() => setActiveFeedbackGame(game)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-colors shadow-xs ${
                    game.status === 'changes_required'
                      ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Review Notes ({game.reviewNotes.length})
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Feedback & Resubmission Modal */}
      {activeFeedbackGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Reviewer Feedback: {activeFeedbackGame.title}
                </h3>
                <span className="text-xs text-slate-500">DochGames Submission Version {activeFeedbackGame.version}</span>
              </div>
              <button
                onClick={() => setActiveFeedbackGame(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {activeFeedbackGame.reviewNotes?.map(rn => (
                <div key={rn.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rn.author} ({rn.role})</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rn.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rn.comment}</p>
                </div>
              ))}
            </div>

            {/* Resubmission Response Box if Changes Required */}
            {activeFeedbackGame.status === 'changes_required' && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Resubmit with Fix Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain fixes applied (e.g. Updated 16:9 cover art, tuned touch drag steering on mobile)..."
                  value={resubmitMessage}
                  onChange={(e) => setResubmitMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleSendResubmit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Fixes for QA Approval
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGamesPage;
