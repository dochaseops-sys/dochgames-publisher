import React, { useState } from 'react';
import { 
  Play, ChevronLeft, ChevronRight, Sparkles, Flame, Star, 
  Gamepad2, Maximize2, ExternalLink, X 
} from 'lucide-react';
import { WidgetConfig, GameItem } from '../../types';

interface DochWidgetRendererProps {
  config: WidgetConfig;
  games: GameItem[];
  onPlayGame: (game: GameItem) => void;
  className?: string;
  isInteractive?: boolean;
}

export const DochWidgetRenderer: React.FC<DochWidgetRendererProps> = ({
  config,
  games,
  onPlayGame,
  className = '',
  isInteractive = true
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState<boolean>(true);

  // Filter games based on widget configuration
  const displayGames = games.filter(g => {
    if (config.gameSource === 'handpicked') {
      return config.selectedGameIds?.includes(g.id);
    }
    if (config.gameSource === 'category' && config.selectedCategory) {
      return g.genre.toLowerCase() === config.selectedCategory.toLowerCase();
    }
    return true; // 'all' or 'trending'
  }).slice(0, config.gameCount || 4);

  if (displayGames.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
        No games available matching widget rules.
      </div>
    );
  }

  const isCloud = config.appearance.theme === 'cloud';
  const primaryColor = config.appearance.primaryColor || '#2563EB';

  const getContrastColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 160 ? '#0f172a' : '#ffffff';
    }
    return '#ffffff';
  };
  const primaryTextColor = getContrastColor(primaryColor);

  const themeClasses = isCloud
    ? 'bg-white text-slate-900 border-slate-200/90 shadow-sm'
    : 'bg-[#071B4B] text-white border-slate-700/60';

  const outerBorderColor = isCloud ? undefined : `${primaryColor}40`;

  const cardRadius = { borderRadius: `${config.appearance.cornerRadius ?? 12}px` };
  const cardSpacing = config.appearance.cardSpacing ?? 12;

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % displayGames.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + displayGames.length) % displayGames.length);
  };

  // Sizing Calculations based on Appearance configuration
  const sizePreset = config.appearance.sizePreset || 'full_width';
  const widthMode = config.appearance.widthMode || 'responsive_full';
  const customWidth = config.appearance.customWidth || 720;
  const customHeight = config.appearance.customHeight || 0;
  const scale = config.appearance.scale || 1;

  let maxWidth = '100%';
  if (widthMode === 'fixed_pixels') {
    maxWidth = `${customWidth}px`;
  } else {
    switch (sizePreset) {
      case 'compact':
        maxWidth = '360px';
        break;
      case 'standard':
        maxWidth = '720px';
        break;
      case 'large':
        maxWidth = '1040px';
        break;
      case 'custom':
        maxWidth = `${customWidth}px`;
        break;
      case 'full_width':
      default:
        maxWidth = '100%';
        break;
    }
  }

  const containerWrapperStyle: React.CSSProperties = {
    maxWidth,
    width: '100%',
    margin: '0 auto',
    ...(customHeight > 0 ? { maxHeight: `${customHeight}px`, overflowY: 'auto' } : {}),
    ...(scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'top center' } : {})
  };

  const renderLayoutContent = () => {
    // 1. Expandable Slit Reel Layout
    if (config.layout === 'expandable_slit_reel') {
      return (
        <div 
          className={`w-full p-3 sm:p-4 border transition-all duration-200 ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: primaryColor }}
              />
              <span 
                className="font-display font-semibold text-sm uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Trending Instant Games
              </span>
            </div>
            {config.appearance.showDochBranding && (
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                ⚡ DochGames Slit
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: `${cardSpacing}px` }}>
            {displayGames.map((game) => {
              const isHovered = hoveredGameId === game.id;
              return (
                <div
                  key={game.id}
                  onMouseEnter={() => setHoveredGameId(game.id)}
                  onMouseLeave={() => setHoveredGameId(null)}
                  onClick={() => onPlayGame(game)}
                  style={{
                    ...cardRadius,
                    borderColor: isHovered ? primaryColor : undefined,
                    boxShadow: isHovered ? `0 4px 20px -2px ${primaryColor}40` : undefined
                  }}
                  className="group relative h-40 overflow-hidden cursor-pointer border border-slate-700/60 transition-all duration-300 shadow-md transform hover:-translate-y-1"
                >
                  <img
                    src={game.media.thumbnailUrl}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040f2b] via-[#040f2b]/40 to-transparent flex flex-col justify-end p-2.5">
                    <span 
                      className="text-[10px] font-medium leading-none mb-1"
                      style={{ color: primaryColor }}
                    >
                      {game.genre}
                    </span>
                    <h4 className="font-display font-semibold text-xs text-white leading-tight truncate">
                      {game.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                        ★ {game.stats.rating}
                      </span>
                      <button 
                        className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold shadow transition-transform hover:scale-105"
                        style={{ backgroundColor: primaryColor, color: primaryTextColor }}
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 2. Coverflow Layout
    if (config.layout === 'coverflow') {
      const currGame = displayGames[activeIndex] || displayGames[0];
      return (
        <div 
          className={`w-full p-4 border text-center transition-all duration-200 overflow-hidden ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" style={{ color: primaryColor }} />
              <span className="font-display font-bold text-sm tracking-wide">
                Featured 3D Carousel
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handlePrev} 
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext} 
                className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D stage */}
          <div className="relative h-56 flex items-center justify-center perspective-[800px]">
            {displayGames.map((game, i) => {
              const offset = i - activeIndex;
              const isCenter = offset === 0;
              const isLeft = offset === -1 || (offset === displayGames.length - 1 && activeIndex === 0);
              const isRight = offset === 1 || (offset === -(displayGames.length - 1) && activeIndex === displayGames.length - 1);

              let transform = 'scale(0.7) opacity-0 pointer-events-none';
              let zIndex = 0;

              if (isCenter) {
                transform = 'scale(1) translateZ(0px) rotateY(0deg)';
                zIndex = 10;
              } else if (isLeft) {
                transform = 'scale(0.82) translateX(-110px) rotateY(25deg)';
                zIndex = 5;
              } else if (isRight) {
                transform = 'scale(0.82) translateX(110px) rotateY(-25deg)';
                zIndex = 5;
              }

              return (
                <div
                  key={game.id}
                  onClick={() => {
                    if (isCenter) onPlayGame(game);
                    else setActiveIndex(i);
                  }}
                  className={`absolute w-48 sm:w-60 h-44 rounded-xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 border-2 ${
                    isCenter ? '' : 'border-slate-700/60 opacity-60'
                  }`}
                  style={{
                    transform: transform.split(' ')[0] + ' ' + (transform.split(' ')[1] || ''),
                    zIndex,
                    borderColor: isCenter ? primaryColor : undefined,
                    boxShadow: isCenter ? `0 0 20px 2px ${primaryColor}66` : undefined
                  }}
                >
                  <img src={game.media.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-left">
                    <span className="text-[10px] font-semibold" style={{ color: primaryColor }}>{game.genre}</span>
                    <h4 className="font-display text-xs font-bold text-white leading-tight truncate">{game.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={() => onPlayGame(currGame)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow hover:opacity-95 transition-all transform hover:scale-105"
              style={{ backgroundColor: primaryColor, color: primaryTextColor }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play {currGame.title} Now
            </button>
          </div>
        </div>
      );
    }

    // 3. Horizontal Stacked Layout
    if (config.layout === 'horizontal_stacked') {
      return (
        <div 
          className={`w-full p-3 border transition-all duration-200 overflow-x-auto ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          <div className="flex items-center min-w-max pb-1" style={{ gap: `${cardSpacing}px` }}>
            {displayGames.map(game => {
              const isHovered = hoveredGameId === game.id;
              return (
                <div
                  key={game.id}
                  onMouseEnter={() => setHoveredGameId(game.id)}
                  onMouseLeave={() => setHoveredGameId(null)}
                  onClick={() => onPlayGame(game)}
                  style={{
                    borderColor: isHovered ? primaryColor : undefined,
                    boxShadow: isHovered ? `0 4px 16px -2px ${primaryColor}30` : undefined
                  }}
                  className={`flex items-center gap-3 p-2.5 ${
                    isCloud 
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900' 
                      : 'bg-[#040f2b]/60 hover:bg-[#040f2b] border-slate-700/60 text-white'
                  } border rounded-xl cursor-pointer transition-all duration-200 w-64 shadow-xs`}
                >
                  <img src={game.media.thumbnailUrl} alt={game.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold" style={{ color: primaryColor }}>{game.genre}</span>
                    <h5 className={`font-display text-xs font-bold ${isCloud ? 'text-slate-900' : 'text-white'} truncate leading-tight`}>{game.title}</h5>
                    <span className="text-[10px] text-slate-500">★ {game.stats.rating}</span>
                  </div>
                  <button 
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: isHovered ? primaryColor : `${primaryColor}20`,
                      color: isHovered ? primaryTextColor : primaryColor
                    }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. Sidebar Mini Reel Layout (compact layout)
    if (config.layout === 'sidebar_mini_reel') {
      return (
        <div 
          className={`w-full p-3.5 border transition-all duration-200 ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
            <span 
              className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: primaryColor }}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Quick Play Rail
            </span>
            <span className="text-[10px] text-slate-500">⚡ Fast</span>
          </div>

          <div className="flex flex-col" style={{ gap: `${cardSpacing}px` }}>
            {displayGames.map(game => {
              const isHovered = hoveredGameId === game.id;
              return (
                <div
                  key={game.id}
                  onMouseEnter={() => setHoveredGameId(game.id)}
                  onMouseLeave={() => setHoveredGameId(null)}
                  onClick={() => onPlayGame(game)}
                  style={{
                    borderColor: isHovered ? primaryColor : undefined,
                    boxShadow: isHovered ? `0 2px 12px -2px ${primaryColor}25` : undefined
                  }}
                  className={`group flex items-center gap-2.5 p-2 rounded-xl ${
                    isCloud 
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' 
                      : 'bg-[#040f2b]/80 hover:bg-[#0d276b] border-slate-700/50'
                  } border cursor-pointer transition-all duration-200`}
                >
                  <img
                    src={game.media.thumbnailUrl}
                    alt={game.title}
                    className="w-11 h-11 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className={`font-display text-xs font-bold ${isCloud ? 'text-slate-900' : 'text-white'} truncate leading-snug`}>
                      {game.title}
                    </h5>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-slate-500">{game.genre}</span>
                      <span className="text-[10px] text-amber-500 font-mono font-semibold">★ {game.stats.rating}</span>
                    </div>
                  </div>
                  <Play 
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-1" 
                    style={{ color: primaryColor }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 5. Featured + Filmstrip Layout
    if (config.layout === 'featured_filmstrip') {
      const heroGame = displayGames[0];
      const filmstrip = displayGames.slice(1);
      const isHeroHovered = hoveredGameId === heroGame?.id;
      return (
        <div 
          className={`w-full p-4 border transition-all duration-200 ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          {heroGame && (
            <div 
              onClick={() => onPlayGame(heroGame)}
              onMouseEnter={() => setHoveredGameId(heroGame.id)}
              onMouseLeave={() => setHoveredGameId(null)}
              style={{
                borderColor: isHeroHovered ? primaryColor : undefined,
                boxShadow: isHeroHovered ? `0 6px 24px -2px ${primaryColor}40` : undefined
              }}
              className="relative h-48 rounded-xl overflow-hidden cursor-pointer mb-3 group border border-slate-700 transition-all duration-200"
            >
              <img src={heroGame.media.thumbnailUrl} alt={heroGame.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span 
                  className="text-[11px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: primaryColor }}
                >
                  Spotlight Feature · {heroGame.genre}
                </span>
                <h3 className="font-display text-lg font-extrabold text-white leading-tight">
                  {heroGame.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1 mt-1">{heroGame.shortDescription}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button 
                    className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold shadow transition-transform hover:scale-105"
                    style={{ backgroundColor: primaryColor, color: primaryTextColor }}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Spotlight
                  </button>
                  <span className="text-xs text-amber-300 font-mono">★ {heroGame.stats.rating} Rating</span>
                </div>
              </div>
            </div>
          )}

          {filmstrip.length > 0 && (
            <div className="grid grid-cols-3" style={{ gap: `${cardSpacing}px` }}>
              {filmstrip.map(game => {
                const isItemHovered = hoveredGameId === game.id;
                return (
                  <div
                    key={game.id}
                    onMouseEnter={() => setHoveredGameId(game.id)}
                    onMouseLeave={() => setHoveredGameId(null)}
                    onClick={() => onPlayGame(game)}
                    style={{
                      borderColor: isItemHovered ? primaryColor : undefined,
                      boxShadow: isItemHovered ? `0 2px 12px -2px ${primaryColor}30` : undefined
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-[#040f2b]/80 hover:bg-[#0d276b] border border-slate-700/60 cursor-pointer transition-colors"
                  >
                    <img src={game.media.thumbnailUrl} alt={game.title} className="w-10 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-display text-[11px] font-bold text-white truncate">{game.title}</h5>
                      <span className="text-[9px] block font-medium" style={{ color: primaryColor }}>{game.genre}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // 6. Overlapping Card Deck Layout
    if (config.layout === 'overlapping_card_deck') {
      return (
        <div 
          className={`w-full p-4 border transition-all duration-200 ${themeClasses} ${className}`}
          style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span 
              className="font-display font-semibold text-xs uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              Curated Deck
            </span>
            <span className="text-[11px] text-slate-400">Click card to launch</span>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="flex -space-x-8 hover:-space-x-2 transition-all duration-300">
              {displayGames.map((game) => {
                const isHovered = hoveredGameId === game.id;
                return (
                  <div
                    key={game.id}
                    onMouseEnter={() => setHoveredGameId(game.id)}
                    onMouseLeave={() => setHoveredGameId(null)}
                    onClick={() => onPlayGame(game)}
                    style={{
                      borderColor: isHovered ? primaryColor : undefined,
                      boxShadow: isHovered ? `0 8px 25px -3px ${primaryColor}50` : undefined
                    }}
                    className="w-36 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 hover:z-20 cursor-pointer transform hover:-translate-y-3 transition-all duration-200 relative group"
                  >
                    <img src={game.media.thumbnailUrl} alt={game.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-left">
                      <span className="text-[10px] font-semibold leading-tight" style={{ color: primaryColor }}>{game.genre}</span>
                      <h5 className="font-display text-xs font-bold text-white leading-tight truncate">{game.title}</h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 7. Floating Launcher Button Layout
    if (config.layout === 'floating_button') {
      return (
        <div className={`w-full p-4 relative flex flex-col items-end ${className}`}>
          {isFloatingOpen && (
            <div 
              className={`mb-3 w-72 sm:w-80 border shadow-2xl transition-all duration-200 overflow-hidden ${themeClasses}`}
              style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
            >
              <div className="flex items-center justify-between p-3 border-b border-slate-200/20 bg-slate-500/5">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">
                    Instant Games
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {config.appearance.showDochBranding && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ⚡ DochGames
                    </span>
                  )}
                  <button 
                    onClick={() => setIsFloatingOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
                    title="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2 space-y-2 max-h-72 overflow-y-auto">
                {displayGames.map(game => (
                  <div
                    key={game.id}
                    onClick={() => onPlayGame(game)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
                      isCloud ? 'hover:bg-slate-100' : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <img 
                      src={game.media.thumbnailUrl} 
                      alt={game.title} 
                      className="w-12 h-12 rounded-lg object-cover shrink-0 shadow-xs" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold" style={{ color: primaryColor }}>{game.genre}</span>
                        <span className="text-[10px] text-amber-400 font-mono">★ {game.stats.rating}</span>
                      </div>
                      <h5 className={`font-display text-xs font-bold leading-tight truncate ${isCloud ? 'text-slate-900' : 'text-white'}`}>
                        {game.title}
                      </h5>
                    </div>
                    <button 
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg shrink-0 shadow-xs transition-opacity hover:opacity-90"
                      style={{ backgroundColor: primaryColor, color: primaryTextColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayGame(game);
                      }}
                    >
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* The Launcher Button */}
          <button
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-white/20"
            style={{ backgroundColor: primaryColor, color: primaryTextColor }}
          >
            <Gamepad2 className="w-4 h-4 animate-bounce" />
            <span>Play Games</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/20 rounded-full">
              {displayGames.length}
            </span>
          </button>
        </div>
      );
    }

    // Default Grid or Vertical Stacked
    return (
      <div 
        className={`w-full p-4 border transition-all duration-200 ${themeClasses} ${className}`}
        style={{ ...cardRadius, ...(outerBorderColor ? { borderColor: outerBorderColor } : {}) }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: `${cardSpacing}px` }}>
          {displayGames.map(game => {
            const isHovered = hoveredGameId === game.id;
            return (
              <div
                key={game.id}
                onMouseEnter={() => setHoveredGameId(game.id)}
                onMouseLeave={() => setHoveredGameId(null)}
                onClick={() => onPlayGame(game)}
                style={{
                  ...cardRadius,
                  borderColor: isHovered ? primaryColor : undefined,
                  boxShadow: isHovered ? `0 4px 20px -2px ${primaryColor}30` : undefined
                }}
                className={`p-2.5 rounded-2xl ${
                  isCloud 
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' 
                    : 'bg-[#040f2b]/70 hover:bg-[#0d276b] border-slate-700/60'
                } border cursor-pointer transition-all duration-200 flex flex-col group shadow-xs`}
              >
                <div className="h-28 rounded-xl overflow-hidden relative mb-2">
                  <img src={game.media.thumbnailUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-amber-300 font-mono">
                    ★ {game.stats.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold" style={{ color: primaryColor }}>{game.genre}</span>
                  <span className="text-[10px] text-slate-400 font-mono">★ {game.stats.rating}</span>
                </div>
                <h5 className={`font-display text-xs font-bold ${isCloud ? 'text-slate-900' : 'text-white'} truncate`}>{game.title}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{game.shortDescription}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center justify-end">
                  <button 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: primaryColor, color: primaryTextColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayGame(game);
                    }}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    Play
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="doch-widget-outer w-full flex justify-center transition-all duration-200">
      <div className="w-full transition-all duration-200" style={containerWrapperStyle}>
        {renderLayoutContent()}
      </div>
    </div>
  );
};
