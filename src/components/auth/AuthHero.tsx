import React from 'react';
import { Gamepad2, Zap, Trophy, ShieldCheck, ArrowUpRight, Play, Star } from 'lucide-react';

export const AuthHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between rounded-3xl lg:rounded-none h-full min-h-[580px]">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D6F938]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#D6F938] animate-pulse" />
          <span>DochGames Publisher Network</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.15] text-white">
          Turn your website visitors into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6F938] via-emerald-300 to-blue-400">
            active players
          </span>.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
          Syndicate 100+ curated HTML5 games onto your publication in under five minutes. Keep readers on your site longer and unlock transparent ad revenue share.
        </p>
      </div>

      {/* Interactive Miniature Widget Showcase Card */}
      <div className="relative z-10 my-8">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-slate-200">Live Widget Stream</span>
            </div>
            <span className="text-[11px] font-mono text-[#D6F938] font-bold">100% Responsive</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-600 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80"
                alt="Cyber Neon Racer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white truncate">Cyber Neon Racer</h4>
                <div className="flex items-center text-[10px] text-amber-400 gap-0.5 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="font-bold">4.9</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                Arcade · 3m 42s avg session
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  Instant Load
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Ad Monetised
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pills & Testimonial Bottom Row */}
      <div className="relative z-10 pt-4 border-t border-slate-800 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg sm:text-xl font-display font-black text-[#D6F938]">1,400+</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Active Sites</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg sm:text-xl font-display font-black text-white">12M+</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Monthly Plays</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg sm:text-xl font-display font-black text-emerald-400">99.9%</div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">Stream Uptime</div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          &ldquo;DochGames added 4 minutes to our average daily session time within 48 hours of installing our first widget.&rdquo;
          <span className="block not-italic font-semibold text-slate-300 mt-0.5">
            — Sarah Jenkins, Digital Director at DailyPlay Media
          </span>
        </p>
      </div>
    </div>
  );
};
