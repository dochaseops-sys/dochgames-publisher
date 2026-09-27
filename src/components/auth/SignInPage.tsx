import React, { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const errors: { email?: string; password?: string } = {};
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Enter your password.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.email) {
        emailInputRef.current?.focus();
      } else if (errors.password) {
        passwordInputRef.current?.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.signIn({
        email: cleanEmail,
        password: password.trim(),
        rememberMe
      });

      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setServerError(res.message || 'Unable to sign in. Please check your credentials.');
      }
    } catch {
      setServerError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setFieldErrors({});
    setServerError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInDemo();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setServerError('Could not open demo workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFieldErrors({});
    setServerError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setServerError('Could not sign in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-600 font-normal leading-relaxed">
          Sign in to manage your websites, widgets and performance.
        </p>
      </div>

      {/* Top Level Server Error Banner */}
      {serverError && (
        <div 
          className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-xs font-medium"
          aria-live="polite"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Google Single Sign-On */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs"
        >
          {/* Official Google G Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

      {/* Divider with matching white background */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 absolute">
          Or continue with email
        </span>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <input
              ref={emailInputRef}
              id="signin-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
              }}
              placeholder="name@yourpublication.com"
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium ${
                fieldErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
              {fieldErrors.email}
            </p>
          )}
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
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              ref={passwordInputRef}
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
              }}
              placeholder="Enter your password"
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium ${
                fieldErrors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
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
          {fieldErrors.password && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {/* Keep Me Signed In */}
        <div className="flex items-center text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
            />
            <span>Keep me signed in</span>
          </label>
        </div>

        {/* Primary Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-black text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LogIn className="w-4 h-4 stroke-[2.5]" />
          <span>{isLoading ? 'Signing in…' : 'Sign in'}</span>
        </button>
      </form>

      {/* Account Switcher Link */}
      <div className="pt-2 text-center text-sm text-slate-600">
        New to DochGames?{' '}
        <button
          type="button"
          onClick={onNavigateToSignUp}
          className="text-blue-600 hover:text-blue-800 font-bold transition-colors inline-block"
        >
          Create an account
        </button>
      </div>

      {/* Quiet Tertiary Demo Link (Moved below the form) */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium hover:underline"
        >
          <span>Just exploring? Open the demo workspace</span>
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
