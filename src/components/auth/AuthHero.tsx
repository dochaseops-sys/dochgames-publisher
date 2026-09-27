import React from 'react';
import { Play, Star, Clock, Smartphone, BarChart3, CheckCircle2 } from 'lucide-react';

export const AuthHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between h-full min-h-[520px]">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#D6F938]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Core Pitch */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#D6F938]" />
          <span>DochGames for Publishers</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-[1.15] text-white">
          Turn readers into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6F938] via-emerald-300 to-blue-400">
            players
          </span>.
        </h1>

        <p className="text-sm text-slate-300 max-w-md leading-relaxed font-normal">
          Add engaging web games to your publication, keep visitors active for longer and track performance from one simple dashboard.
        </p>

        {/* Credible Benefit Points */}
        <div className="pt-2 space-y-2.5 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#D6F938] shrink-0" />
            <span>Add your first widget in minutes</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#D6F938] shrink-0" />
            <span>Designed for desktop and mobile</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#D6F938] shrink-0" />
            <span>Track views, game starts and engagement</span>
          </div>
        </div>
      </div>

      {/* Widget Preview Card */}
      <div className="relative z-10 my-6">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl max-w-sm">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-700/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-slate-200">Widget preview</span>
            </div>
            <span className="text-[11px] font-mono text-[#D6F938] font-bold">
              Desktop + mobile
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-600 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80"
                alt="Cyber Neon Racer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
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
                Arcade · Instant play
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  Ready in minutes
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Revenue enabled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <Clock className="w-4 h-4 text-[#D6F938] mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-200">5-min setup</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <Smartphone className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-200">All screens</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <BarChart3 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <div className="text-[11px] font-bold text-slate-200">Live reporting</div>
        </div>
      </div>
    </div>
  );
};
