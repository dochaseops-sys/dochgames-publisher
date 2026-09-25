import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Globe, Building2, 
  ArrowRight, AlertCircle, Check, Sparkles 
} from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';
import { normalizeDomain } from '../../services/websites';

interface SignUpPageProps {
  onSuccess: (user: AuthUser) => void;
  onNavigateToSignIn: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteDomain, setWebsiteDomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-clean website domain on change or blur
  const handleDomainChange = (val: string) => {
    setWebsiteDomain(val);
  };

  const handleDomainBlur = () => {
    if (websiteDomain) {
      const clean = normalizeDomain(websiteDomain);
      setWebsiteDomain(clean);
      if (!companyName && clean) {
        // Suggest company name from domain name
        const suggested = clean.split('.')[0];
        setCompanyName(suggested.charAt(0).toUpperCase() + suggested.slice(1) + ' Media');
      }
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; colour: string } => {
    if (!pass) return { score: 0, label: '', colour: 'bg-slate-200' };
    if (pass.length < 8) return { score: 1, label: 'Too short (min 8 characters)', colour: 'bg-rose-500' };

    let score = 1;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, label: 'Fair password', colour: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good password', colour: 'bg-blue-500' };
    return { score: 4, label: 'Strong password', colour: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanDomain = normalizeDomain(websiteDomain);

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (!cleanDomain) {
      setError('Please enter your primary website domain.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Publisher Terms of Service to continue.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.signUp({
        fullName: cleanName,
        email: cleanEmail,
        websiteDomain: cleanDomain,
        companyName: companyName.trim() || undefined,
        password,
        agreedToTerms,
        newsletterOptIn
      });

      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.message || 'Could not complete registration. Please try again.');
      }
    } catch {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setError('Could not complete Google sign-up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Title & Introduction */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          Create a publisher account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Start syndicating games and earning ad revenue in under five minutes.
        </p>
      </div>

      {/* Social Single Sign-On Options */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
          <span>Sign up with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-[#F4F6FA] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
          Or register with email
        </span>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 mb-1">
            Full name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 mb-1">
            Work email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@gamezone-daily.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Website Domain */}
        <div>
          <label htmlFor="signup-domain" className="block text-xs font-bold text-slate-700 mb-1">
            Website address or domain <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-domain"
              type="text"
              value={websiteDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              onBlur={handleDomainBlur}
              placeholder="gamezone-daily.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Where you plan to install your game widgets.
          </p>
        </div>

        {/* Company Name (Optional) */}
        <div>
          <label htmlFor="signup-company" className="block text-xs font-bold text-slate-700 mb-1">
            Company or publication name <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="signup-company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. GameZone Media Group"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 mb-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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

          {/* Password strength meter */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1 h-1.5 w-full">
                <div className={`flex-1 rounded-full transition-all ${strength.score >= 1 ? strength.colour : 'bg-slate-200'}`} />
                <div className={`flex-1 rounded-full transition-all ${strength.score >= 2 ? strength.colour : 'bg-slate-200'}`} />
                <div className={`flex-1 rounded-full transition-all ${strength.score >= 3 ? strength.colour : 'bg-slate-200'}`} />
                <div className={`flex-1 rounded-full transition-all ${strength.score >= 4 ? strength.colour : 'bg-slate-200'}`} />
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {strength.label}
              </div>
            </div>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
              required
            />
            <span>
              I agree to the <span className="text-blue-600 font-semibold hover:underline">Publisher Agreement</span> and{' '}
              <span className="text-blue-600 font-semibold hover:underline">Privacy Policy</span>.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-500 select-none">
            <input
              type="checkbox"
              checked={newsletterOptIn}
              onChange={(e) => setNewsletterOptIn(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
            />
            <span>Receive weekly game release highlights and widget placement tips.</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !agreedToTerms}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-black text-xs transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>{isLoading ? 'Creating account…' : 'Create publisher account'}</span>
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Already have a publisher account?{' '}
        <button
          type="button"
          onClick={onNavigateToSignIn}
          className="text-blue-600 hover:text-blue-800 font-bold transition-colors inline-flex items-center gap-0.5"
        >
          <span>Sign in</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
