import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface SignInPageProps {
  onSuccess: (user: AuthUser) => void;
  onNavigateToSignUp: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateToSignUp
}) => {
  const [email, setEmail] = useState('alex.mercer@gamezone-daily.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.signIn({
        email: email.trim(),
        password: password.trim(),
        rememberMe
      });

      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.message || 'Unable to sign in. Please check your credentials.');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInDemo();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setError('Could not sign in with demo account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setError('Could not sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title & Introduction */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          Sign in to DochGames
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Access your publisher portal, live widgets, and ad revenue stats.
        </p>
      </div>

      {/* Quick Demo Access Pill */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-semibold min-w-0">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">Evaluating platform? Use 1-click demo</span>
        </div>
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
        >
          Sign in as Alex
        </button>
      </div>

      {/* Social Single Sign-On Options */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2.5 shadow-2xs"
        >
          {/* Official Google G Logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-[#F4F6FA] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
          Or with email
        </span>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Work email address
          </label>
          <div className="relative">
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.mercer@gamezone-daily.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="signin-password" className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
            />
            <span>Remember this device for 30 days</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-black text-xs transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn className="w-4 h-4 stroke-[2.5]" />
          <span>{isLoading ? 'Signing in…' : 'Sign in to publisher portal'}</span>
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="pt-2 text-center text-xs text-slate-500">
        New to DochGames?{' '}
        <button
          type="button"
          onClick={onNavigateToSignUp}
          className="text-blue-600 hover:text-blue-800 font-bold transition-colors inline-flex items-center gap-0.5"
        >
          <span>Create a publisher account</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        initialEmail={email}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
