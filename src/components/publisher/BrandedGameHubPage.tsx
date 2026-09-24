import React, { useState } from 'react';
import { 
  Globe, Sparkles, ExternalLink, Settings, Eye, CheckCircle, 
  Gamepad2, Flame, RefreshCw, Palette, Layers, Play 
} from 'lucide-react';
import { BrandedGameHub, GameItem, PublisherProperty } from '../../types';

interface BrandedGameHubPageProps {
  hubs: BrandedGameHub[];
  properties: PublisherProperty[];
  games: GameItem[];
  onPlayGame: (game: GameItem) => void;
  onSaveHub: (hub: BrandedGameHub) => void;
}

export const BrandedGameHubPage: React.FC<BrandedGameHubPageProps> = ({
  hubs,
  properties,
  games,
  onPlayGame,
  onSaveHub
}) => {
  const [selectedHub, setSelectedHub] = useState<BrandedGameHub>(() => {
    return hubs[0] || {
      id: `hub-${Date.now()}`,
      propertyId: properties[0]?.id || 'prop-01',
      name: 'GameZone Arcade Hub',
      subdomain: 'gamezone.dochgames.com',
      customDomain: 'games.gamezone-daily.com',
      customDomainVerified: true,
      brandName: 'GameZone Arcade',
      logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
      themeColor: '#129BFF',
      heroHeadline: 'Instant Arcade Fun. No Installs Needed.',
      heroSubheadline: 'Handpicked free-to-play web games powered by DochGames. Play immediately on mobile & desktop.',
      categories: ['Racing', 'Arcade', 'Puzzle', 'Casual', 'Strategy'],
      featuredGameId: 'game-001',
      status: 'live',
      createdAt: new Date().toISOString(),
      stats: {
        monthlyVisitors: 64200,
        averageSessionMinutes: 8.4,
        totalGameStarts: 182400
      }
    };
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState<boolean>(false);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  const featuredGame = games.find(g => g.id === selectedHub.featuredGameId) || games[0];

  const handleSave = () => {
    onSaveHub(selectedHub);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleVerifyCustomDomain = () => {
    setIsVerifyingDomain(true);
    setTimeout(() => {
      setIsVerifyingDomain(false);
      setSelectedHub(prev => ({
        ...prev,
        customDomainVerified: true
      }));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Product Distinction Explainer Banner as required in Section 4.7 */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Branded Game Hub
            </h2>
          </div>
          <p className="text-slate-500 text-xs max-w-2xl leading-relaxed">
            <strong className="text-slate-800">Use Widgets</strong> to add games to an existing product or editorial page. <strong className="text-slate-800">Use Branded Game Hub</strong> to launch a complete, standalone gaming destination under your subdomain or custom domain with zero infrastructure maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            {activeTab === 'editor' ? 'View Live Hub Preview' : 'Back to Hub Settings'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium animate-fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Branded Game Hub configuration updated and deployed to edge nodes.</span>
        </div>
      )}

      {/* Editor View */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Left Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Domain & Brand Identity
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Game Hub Brand Title
              </label>
              <input
                type="text"
                value={selectedHub.brandName}
                onChange={(e) => setSelectedHub(prev => ({ ...prev, brandName: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  DochGames Subdomain
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <input
                    type="text"
                    value={selectedHub.subdomain.split('.')[0]}
                    onChange={(e) => setSelectedHub(prev => ({ ...prev, subdomain: `${e.target.value}.dochgames.com` }))}
                    className="bg-transparent focus:outline-none flex-1 font-mono text-slate-900"
                  />
                  <span className="text-slate-400">.dochgames.com</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Custom Domain (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="games.yourbrand.com"
                    value={selectedHub.customDomain || ''}
                    onChange={(e) => setSelectedHub(prev => ({ ...prev, customDomain: e.target.value }))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    onClick={handleVerifyCustomDomain}
                    disabled={isVerifyingDomain || selectedHub.customDomainVerified}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedHub.customDomainVerified
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {selectedHub.customDomainVerified ? 'Verified' : isVerifyingDomain ? 'Checking...' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hero Headline
              </label>
              <input
                type="text"
                value={selectedHub.heroHeadline}
                onChange={(e) => setSelectedHub(prev => ({ ...prev, heroHeadline: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hero Subheadline / Mission
              </label>
              <textarea
                rows={2}
                value={selectedHub.heroSubheadline}
                onChange={(e) => setSelectedHub(prev => ({ ...prev, heroSubheadline: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Featured Spotlight Title
              </label>
              <select
                value={selectedHub.featuredGameId}
                onChange={(e) => setSelectedHub(prev => ({ ...prev, featuredGameId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {games.map(g => (
                  <option key={g.id} value={g.id}>{g.title} ({g.genre})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                {['#2563EB', '#7C3AED', '#06B6D4', '#EC4899', '#10B981'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedHub(prev => ({ ...prev, themeColor: c }))}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      selectedHub.themeColor === c ? 'scale-125 ring-4 ring-slate-200 shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Right Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Hub Audience & Reach
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 block">Monthly Visitors</span>
                  <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{selectedHub.stats.monthlyVisitors.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
                  <span className="text-[11px] text-slate-500 block">Total Game Starts</span>
                  <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{selectedHub.stats.totalGameStarts.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Avg. Player Session:</span>
                  <span className="font-bold text-slate-900">{selectedHub.stats.averageSessionMinutes} mins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Hub Status:</span>
                  <span className="text-emerald-700 font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">{selectedHub.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">DNS SSL Certificate:</span>
                  <span className="text-emerald-700 font-mono text-[11px] font-semibold">Issued & Valid</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('preview')}
                className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                Launch Full-Screen Hub Preview
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Live Hub Interactive Preview */
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl">
          {/* Simulated Hub Window Chrome / Navigation Bar */}
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Browser control dots */}
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              </div>
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                style={{ backgroundColor: selectedHub.themeColor }}
              >
                🎮
              </div>
              <span className="font-display font-bold text-base text-slate-900">
                {selectedHub.brandName}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="text-slate-900 font-bold">All Games</span>
              <span className="hover:text-slate-900 cursor-pointer">Trending</span>
              <span className="hover:text-slate-900 cursor-pointer">Categories</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-full">https://{selectedHub.subdomain}</span>
            </div>
          </div>

          {/* Hero Spotlight */}
          <div className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-b-none">
            <div className="max-w-2xl space-y-3 z-10 relative">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#D6F938]">
                Featured Destination
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {selectedHub.heroHeadline}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedHub.heroSubheadline}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onPlayGame(featuredGame)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-sm font-bold shadow-lg transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Play {featuredGame.title}
                </button>
              </div>
            </div>
          </div>

          {/* Games Catalogue Grid */}
          <div className="p-8 space-y-4 bg-[#F4F6FA]">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Instant Play Catalogue
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {games.length} Titles Available Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {games.map(game => (
                <div
                  key={game.id}
                  onClick={() => onPlayGame(game)}
                  className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 shadow-xs hover:shadow-md"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img 
                      src={game.media.thumbnailUrl} 
                      alt={game.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] text-amber-300 font-semibold">
                      ★ {game.stats.rating}
                    </div>
                  </div>
                  <div className="p-3.5">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{game.genre}</span>
                    <h4 className="font-display font-bold text-sm text-slate-900 truncate mt-0.5">{game.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{game.shortDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandedGameHubPage;
