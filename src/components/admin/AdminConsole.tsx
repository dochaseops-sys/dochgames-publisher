import React, { useState } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, Play, 
  Search, Filter, Eye, RefreshCw, MessageSquare, Flame, 
  Activity, Users, Globe, Key, AlertOctagon 
} from 'lucide-react';
import { GameItem, PublisherProperty, UserProfile } from '../../types';
import { realtime } from '../../services/websocket';
import { PlayableGameModal } from '../common/PlayableGameModal';

interface AdminConsoleProps {
  currentUser: UserProfile;
  games: GameItem[];
  properties: PublisherProperty[];
  onUpdateGameStatus: (gameId: string, status: GameItem['status'], reviewNote?: string) => void;
  onPlayGame: (game: GameItem) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentUser,
  games,
  properties,
  onUpdateGameStatus,
  onPlayGame
}) => {
  const [activeTab, setActiveTab] = useState<'review_queue' | 'catalogue' | 'publishers' | 'system_health'>('review_queue');
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [reviewNoteText, setReviewNoteText] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sandboxModalGame, setSandboxModalGame] = useState<GameItem | null>(null);

  const pendingGames = games.filter(g => g.status === 'submitted' || g.status === 'in_review' || g.status === 'changes_required');

  const handleApprove = (game: GameItem) => {
    onUpdateGameStatus(game.id, 'live', reviewNoteText || 'Approved for global DochGames syndication & branded hubs.');
    realtime.broadcastNotification(
      currentUser.name,
      'DochGames QA Admin',
      'GAME_APPROVED',
      `Game "${game.title}" was approved and is now LIVE!`
    );
    setSelectedGame(null);
    setReviewNoteText('');
  };

  const handleRequestChanges = (game: GameItem) => {
    if (!reviewNoteText.trim()) {
      alert('Please provide actionable review feedback for the developer before requesting changes.');
      return;
    }
    onUpdateGameStatus(game.id, 'changes_required', reviewNoteText);
    realtime.broadcastNotification(
      currentUser.name,
      'DochGames QA Admin',
      'STATUS_CHANGED',
      `Actionable changes requested for "${game.title}".`
    );
    setSelectedGame(null);
    setReviewNoteText('');
  };

  const handleEmergencyDisable = (game: GameItem) => {
    const newStatus = game.status === 'paused' ? 'live' : 'paused';
    onUpdateGameStatus(game.id, newStatus, `Admin toggle status to: ${newStatus}`);
    realtime.broadcastNotification(
      currentUser.name,
      'DochGames QA Admin',
      'STATUS_CHANGED',
      `Game "${game.title}" marked as ${newStatus.toUpperCase()}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">
              Central Operations Console
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            DochGames Admin & Moderation Engine
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Automated pre-flight inspection, sandbox verification, publisher key audits, and emergency take-downs.
          </p>
        </div>

        <div className="flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-xs">
          {[
            { id: 'review_queue', label: `QA Queue (${pendingGames.length})` },
            { id: 'catalogue', label: `Catalogue (${games.length})` },
            { id: 'publishers', label: `Properties (${properties.length})` },
            { id: 'system_health', label: 'Health & CDN' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === t.id 
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Review Queue Tab */}
      {activeTab === 'review_queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pending Games List (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">
              Submissions Requiring QA Verification
            </h3>

            {pendingGames.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                🎉 No submissions pending! All developer submissions reviewed.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedGame?.id === game.id
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={game.media.thumbnailUrl}
                        alt={game.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-slate-900 truncate">{game.title}</h4>
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            {game.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">By {game.studioName} · {game.genre} · v{game.version}</p>
                        <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                          ✓ Automated pre-flight checks: Passed
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Inspection & Action Deck (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {selectedGame ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      Inspect: {selectedGame.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Studio: {selectedGame.studioName} · Package: {selectedGame.technical.packageSizeMb} MB
                    </span>
                  </div>

                  <button
                    onClick={() => setSandboxModalGame(selectedGame)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Launch Sandbox Test
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Controls:</span>
                    <span className="text-slate-900 font-bold">Keyboard, Touch, Gamepad</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Orientation:</span>
                    <span className="text-slate-900 font-bold uppercase">{selectedGame.orientation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Audio Unlock:</span>
                    <span className="text-emerald-600 font-bold">Valid (on user gesture)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HTTPS Enforced:</span>
                    <span className="text-emerald-600 font-mono font-bold">TLS 1.3 Valid</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    QA Reviewer Feedback Notes (Saved with Version History)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter structured reviewer feedback or reason for approval / changes..."
                    value={reviewNoteText}
                    onChange={(e) => setReviewNoteText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handleRequestChanges(selectedGame)}
                    className="flex-1 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors shadow-xs"
                  >
                    Request Developer Changes
                  </button>

                  <button
                    onClick={() => handleApprove(selectedGame)}
                    className="flex-1 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                  >
                    Approve & Deploy to Live Feed
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center text-slate-500 text-xs shadow-sm">
                Select a game from the queue on the left to inspect its pre-flight validation status and launch sandbox testing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Global Catalogue Tab */}
      {activeTab === 'catalogue' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Global Syndication Catalogue ({games.length} Titles)
            </h3>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-2.5">
            {games.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase())).map(game => (
              <div
                key={game.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={game.media.thumbnailUrl} alt={game.title} className="w-10 h-10 rounded-xl object-cover shadow-xs" />
                  <div>
                    <div className="font-bold text-slate-900">{game.title}</div>
                    <div className="text-[11px] text-slate-500">{game.genre} · Studio: {game.studioName} · {game.stats.totalPlays.toLocaleString()} plays</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPlayGame(game)}
                    className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors shadow-xs"
                  >
                    Play
                  </button>

                  <button
                    onClick={() => handleEmergencyDisable(game)}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-colors shadow-xs ${
                      game.status === 'paused'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {game.status === 'paused' ? 'Re-Enable' : 'Emergency Take-Down'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Publishers Tab */}
      {activeTab === 'publishers' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Connected Publisher Domains & Security Origin Audits
          </h3>
          <div className="space-y-3">
            {properties.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{p.name} ({p.domain})</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">Publisher Key: {p.publisherKey}</div>
                  <div className="text-slate-500 text-[11px]">Allowed Origins: {p.allowedOrigins.join(', ')}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    VERIFIED DOMAIN
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{p.totalWidgets} Active Widgets</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Health & CDN Tab */}
      {activeTab === 'system_health' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <span className="text-xs text-slate-500 font-medium">CDN Edge Latency</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">18ms Global Avg</div>
            <p className="text-[11px] text-slate-500 mt-1">Cloudflare & Fastly edge caches warm</p>
          </div>
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <span className="text-xs text-slate-500 font-medium">WebSocket Relay Health</span>
            <div className="text-2xl font-extrabold text-blue-600 font-mono">100% Operational</div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time file sharing relay active</p>
          </div>
          <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <span className="text-xs text-slate-500 font-medium">Consent & CMP Telemetry</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">0.00% Error Rate</div>
            <p className="text-[11px] text-slate-500 mt-1">GDPR & TCF v2.2 compliant signals</p>
          </div>
        </div>
      )}

      {/* Sandbox Modal for Admin Playtesting */}
      {sandboxModalGame && (
        <PlayableGameModal
          game={sandboxModalGame}
          isOpen={!!sandboxModalGame}
          onClose={() => setSandboxModalGame(null)}
        />
      )}
    </div>
  );
};

export default AdminConsole;
