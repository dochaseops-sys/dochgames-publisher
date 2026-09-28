import React, { useState } from 'react';
import { Gamepad2, ArrowLeft, Clock, Smartphone, BarChart3 } from 'lucide-react';
import { AuthHero } from './AuthHero';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';
import { AuthUser } from '../../types/auth';

interface AuthLayoutProps {
  initialMode?: 'signin' | 'signup';
  onAuthSuccess: (user: AuthUser, isNewUser?: boolean) => void;
  onBackToApp?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  onBackToApp
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex flex-col font-sans selection:bg-[#D6F938] selection:text-slate-950">
      {/* Top Header - Clean, Compact, No Duplicate Segmented Control */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={onBackToApp}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-black text-lg text-slate-900 tracking-tight">
                Doch<span className="text-blue-600">Games</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                For Publishers
              </span>
            </div>
          </div>

          {/* Right Action (Return to platform if available) */}
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to platform</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container: Desktop Split (44% marketing / 56% form), Mobile Form-First */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1100px] w-full mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Desktop Left Marketing Panel (44% width: ~5 cols of 12) - Hidden on Mobile */}
          <div className="hidden lg:flex lg:col-span-5 bg-slate-950 flex-col justify-center">
            <AuthHero />
          </div>

          {/* Form Panel (56% width: ~7 cols of 12) - Shown First on Mobile */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            {mode === 'signin' ? (
              <SignInPage
                onSuccess={(user) => onAuthSuccess(user, false)}
                onNavigateToSignUp={() => setMode('signup')}
              />
            ) : (
              <SignUpPage
                onSuccess={(user) => onAuthSuccess(user, true)}
                onNavigateToSignIn={() => setMode('signin')}
              />
            )}

            {/* Mobile-Only Compact Benefit Strip below the form */}
            <div className="lg:hidden mt-8 pt-6 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
                  <span className="font-semibold text-[11px]">Ready in minutes</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
                  <span className="font-semibold text-[11px]">Desktop & mobile</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <BarChart3 className="w-3.5 h-3.5 text-purple-600 mx-auto mb-1" />
                  <span className="font-semibold text-[11px]">Live reporting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Clean Page Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">DochGames for Publishers</span>
            <span className="text-slate-300">·</span>
            <span>Web Game Syndication</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="mailto:support@dochgames.com" className="hover:text-blue-600 transition-colors">
              support@dochgames.com
            </a>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">© 2026 DochGames Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
