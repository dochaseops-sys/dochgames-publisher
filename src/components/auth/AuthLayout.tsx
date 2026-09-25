import React from 'react';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import { AuthHero } from './AuthHero';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';
import { AuthUser } from '../../types/auth';

interface AuthLayoutProps {
  initialMode?: 'signin' | 'signup';
  onAuthSuccess: (user: AuthUser) => void;
  onBackToApp?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
  onBackToApp
}) => {
  const [mode, setMode] = React.useState<'signin' | 'signup'>(initialMode);

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex flex-col font-sans selection:bg-[#D6F938] selection:text-slate-950">
      {/* Top Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                Publisher Suite
              </span>
            </div>
          </div>

          {/* Right Header Navigation / Switcher */}
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to platform</span>
              </button>
            )}

            <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-bold border border-slate-200/80">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  mode === 'signup'
                    ? 'bg-[#D6F938] text-slate-950 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Auth Split Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Column: Visual Brand Hero */}
          <div className="lg:col-span-6 xl:col-span-7 bg-slate-950">
            <AuthHero />
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-6 xl:col-span-5 p-6 sm:p-10 lg:p-12 flex items-center justify-center bg-white">
            {mode === 'signin' ? (
              <SignInPage
                onSuccess={onAuthSuccess}
                onNavigateToSignUp={() => setMode('signup')}
              />
            ) : (
              <SignUpPage
                onSuccess={onAuthSuccess}
                onNavigateToSignIn={() => setMode('signin')}
              />
            )}
          </div>
        </div>
      </main>

      {/* Clean, Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">DochGames Publisher Suite</span>
            <span className="text-slate-300">·</span>
            <span>Game Syndication & Monetisation</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="mailto:support@dochgames.com" className="hover:text-blue-600 transition-colors">
              support@dochgames.com
            </a>
            <span className="text-slate-300">·</span>
            <span className="text-slate-400">© 2026 DochGames Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
