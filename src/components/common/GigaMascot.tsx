import React from 'react';

interface GigaMascotProps {
  mood?: 'happy' | 'helpful' | 'thinking' | 'celebrating' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  speechBubble?: string;
  className?: string;
}

export const GigaMascot: React.FC<GigaMascotProps> = ({
  mood = 'helpful',
  size = 'md',
  speechBubble,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const getEyeExpression = () => {
    switch (mood) {
      case 'celebrating':
        return (
          <>
            {/* Happy curved eyes */}
            <path d="M18 25 Q23 20 28 25" stroke="#11D9FF" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M36 25 Q41 20 46 25" stroke="#11D9FF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx="23" cy="24" r="3" fill="#11D9FF" />
            <circle cx="41" cy="22" r="4.5" fill="#11D9FF" />
          </>
        );
      case 'alert':
        return (
          <>
            <circle cx="23" cy="24" r="4" fill="#FFB51A" />
            <circle cx="41" cy="24" r="4" fill="#FFB51A" />
          </>
        );
      default:
        return (
          <>
            <circle cx="23" cy="24" r="4" fill="#11D9FF" />
            <circle cx="41" cy="24" r="4" fill="#11D9FF" />
            <circle cx="25" cy="22" r="1.5" fill="#FFFFFF" />
            <circle cx="43" cy="22" r="1.5" fill="#FFFFFF" />
          </>
        );
    }
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className={`relative shrink-0 ${sizeClasses[size]}`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Antenna */}
          <rect x="30" y="3" width="4" height="10" rx="2" fill="#2563EB" />
          <circle cx="32" cy="4" r="4" fill="#D6F938" />
          
          {/* Head Body */}
          <rect x="10" y="12" width="44" height="38" rx="14" fill="#0F172A" stroke="#2563EB" strokeWidth="2.5" />
          
          {/* Visor Area */}
          <rect x="15" y="18" width="34" height="18" rx="7" fill="#020617" />
          
          {/* Eyes */}
          {getEyeExpression()}

          {/* Cheerful blush */}
          <circle cx="16" cy="30" r="2.5" fill="#F43F5E" opacity="0.6" />
          <circle cx="48" cy="30" r="2.5" fill="#F43F5E" opacity="0.6" />

          {/* Mouth */}
          {mood === 'celebrating' ? (
            <path d="M26 31 Q32 37 38 31" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : mood === 'thinking' ? (
            <path d="M28 32 L36 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M27 31 Q32 35 37 31" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Floating Game Pad Accent Ear pieces */}
          <rect x="6" y="24" width="4" height="14" rx="2" fill="#2563EB" />
          <rect x="54" y="24" width="4" height="14" rx="2" fill="#2563EB" />
        </svg>
      </div>

      {speechBubble && (
        <div className="relative bg-slate-50 border border-slate-200/90 text-slate-700 text-xs px-3.5 py-2.5 rounded-2xl max-w-sm shadow-xs leading-relaxed">
          <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-50 border-l border-b border-slate-200/90 rotate-45" />
          {speechBubble}
        </div>
      )}
    </div>
  );
};
