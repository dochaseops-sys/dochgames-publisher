import React, { useState, useRef } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Globe, Building2, 
  ArrowRight, ArrowLeft, AlertCircle, Check, Sparkles 
} from 'lucide-react';
import { authService } from '../../services/authService';
import { AuthUser } from '../../types/auth';
import { normalizeDomain } from '../../services/websites';
import { LegalTermsModal } from './LegalTermsModal';

interface SignUpPageProps {
  onSuccess: (user: AuthUser) => void;
  onNavigateToSignIn: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateToSignIn
}) => {
  // Step 1 or 2
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2 fields
  const [websiteDomain, setWebsiteDomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false); // Unchecked by default!

  // Modals & UI states
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<'terms' | 'privacy'>('terms');

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Input refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const termsCheckboxRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpperOrSymbol = /[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && (hasNumber || hasUpperOrSymbol);

  // Handle domain auto-cleaning and publication name suggestion
  const handleDomainChange = (val: string) => {
    setWebsiteDomain(val);
    if (fieldErrors.websiteDomain) {
      setFieldErrors(prev => ({ ...prev, websiteDomain: '' }));
    }
  };

  const handleDomainBlur = () => {
    if (websiteDomain) {
      const clean = normalizeDomain(websiteDomain);
      setWebsiteDomain(clean);
      if (!companyName && clean) {
        // Suggest publication name from domain
        const domainPrefix = clean.split('.')[0];
        const formatted = domainPrefix.charAt(0).toUpperCase() + domainPrefix.slice(1);
        setCompanyName(`${formatted} Media`);
      }
    }
  };

  // Open Legal Terms Modal
  const handleOpenLegal = (e: React.MouseEvent, type: 'terms' | 'privacy') => {
    e.preventDefault();
    setLegalDocType(type);
    setLegalModalOpen(true);
  };

  // Step 1: Continue
  const handleContinueStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const errors: Record<string, string> = {};
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      errors.fullName = 'Enter your full name.';
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      errors.email = 'Enter a valid email address.';
    }
    if (!hasMinLength) {
      errors.password = 'Use at least 8 characters.';
    } else if (!hasNumber && !hasUpperOrSymbol) {
      errors.password = 'Include at least one number or symbol.';
    }
    if (!agreedToTerms) {
      errors.agreedToTerms = 'You must accept the Publisher Agreement.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.fullName) nameInputRef.current?.focus();
      else if (errors.email) emailInputRef.current?.focus();
      else if (errors.password) passwordInputRef.current?.focus();
      else if (errors.agreedToTerms) termsCheckboxRef.current?.focus();
      return;
    }

    setStep(2);
  };

  // Step 2: Finalize Account Creation
  const handleCreateAccount = async (skipWebsite = false) => {
    setFieldErrors({});
    setServerError(null);

    let cleanDomain = '';
    if (!skipWebsite && websiteDomain.trim()) {
      cleanDomain = normalizeDomain(websiteDomain);
      if (!cleanDomain || !cleanDomain.includes('.')) {
        setFieldErrors({ websiteDomain: 'Enter a valid website address.' });
        websiteInputRef.current?.focus();
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await authService.signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        websiteDomain: cleanDomain || undefined,
        companyName: companyName.trim() || undefined,
        agreedToTerms: true,
        newsletterOptIn
      });

      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setServerError(res.message || 'Could not complete registration. Please try again.');
      }
    } catch {
      setServerError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setFieldErrors({});
    setServerError(null);
    setIsLoading(true);
    try {
      const res = await authService.signInWithGoogle();
      if (res.success && res.user) {
        onSuccess(res.user);
      }
    } catch {
      setServerError('Could not complete Google sign-up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Step Indicator Pill */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <span className={step === 1 ? 'text-blue-600 font-extrabold' : 'text-slate-700'}>
          1 Account details
        </span>
        <span className="text-slate-300">→</span>
        <span className={step === 2 ? 'text-blue-600 font-extrabold' : 'text-slate-400'}>
          2 Your website
        </span>
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

      {/* ================= STEP 1: CREATE YOUR ACCOUNT ================= */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Heading */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              Create your publisher account
            </h2>
            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Start adding playable games to your website in minutes. No coding required.
            </p>
          </div>

          {/* Google SSO */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-2xs"
            >
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
              Or create an account with email
            </span>
          </div>

          {/* Step 1 Form */}
          <form onSubmit={handleContinueStep1} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <input
                  ref={nameInputRef}
                  id="signup-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Alex Mercer"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium ${
                    fieldErrors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
              </div>
              {fieldErrors.fullName && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Work email
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  id="signup-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="alex@yourpublication.com"
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

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Create a strong password"
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

              {/* Password Guidance and Requirement Checks */}
              <div className="mt-2 space-y-1.5" aria-live="polite">
                <p className="text-[13px] text-slate-500 font-normal">
                  Use at least 8 characters, including a number or symbol.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-xs">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'}`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${hasNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'}`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUpperOrSymbol ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${hasUpperOrSymbol ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'}`}>
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Capital or symbol</span>
                  </div>
                </div>
              </div>

              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  ref={termsCheckboxRef}
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (fieldErrors.agreedToTerms) setFieldErrors(prev => ({ ...prev, agreedToTerms: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer shrink-0"
                  required
                />
                <span className="leading-snug">
                  I agree to the{' '}
                  <a
                    href="#terms"
                    onClick={(e) => handleOpenLegal(e, 'terms')}
                    className="text-blue-600 hover:text-blue-800 underline font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 rounded-xs"
                  >
                    Publisher Agreement
                  </a>{' '}
                  and{' '}
                  <a
                    href="#privacy"
                    onClick={(e) => handleOpenLegal(e, 'privacy')}
                    className="text-blue-600 hover:text-blue-800 underline font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 rounded-xs"
                  >
                    Privacy Policy
                  </a>.
                </span>
              </label>
              {fieldErrors.agreedToTerms && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
                  {fieldErrors.agreedToTerms}
                </p>
              )}
            </div>

            {/* Primary Continue Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-black text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Switcher */}
          <div className="pt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="text-blue-600 hover:text-blue-800 font-bold transition-colors inline-block"
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: ADD YOUR WEBSITE ================= */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to account details</span>
          </button>

          {/* Heading */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              Add your website
            </h2>
            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              Tell us where you plan to show your DochGames widgets. You can verify and configure it later.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAccount(false);
            }} 
            className="space-y-4" 
            noValidate
          >
            {/* Website Address */}
            <div>
              <label htmlFor="website-domain" className="block text-xs font-bold text-slate-700 mb-1.5">
                Website address
              </label>
              <div className="relative">
                <input
                  ref={websiteInputRef}
                  id="website-domain"
                  type="text"
                  name="url"
                  autoComplete="url"
                  value={websiteDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  onBlur={handleDomainBlur}
                  placeholder="yourpublication.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium ${
                    fieldErrors.websiteDomain ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-1 text-[13px] text-slate-500 font-normal">
                Enter the website where you want visitors to discover and play games.
              </p>
              {fieldErrors.websiteDomain && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium" aria-live="polite">
                  {fieldErrors.websiteDomain}
                </p>
              )}
            </div>

            {/* Publication or Company Name */}
            <div>
              <label htmlFor="company-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Publication or company name
              </label>
              <div className="relative">
                <input
                  id="company-name"
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. DailyPlay Media Group"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-1 text-[13px] text-slate-500 font-normal">
                Optional—we can suggest a name from your website.
              </p>
            </div>

            {/* Newsletter Option (Unchecked by default) */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={(e) => setNewsletterOptIn(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <span className="leading-snug">
                  Send me occasional product updates, new-game announcements and optimisation tips.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 font-black text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>{isLoading ? 'Creating account…' : 'Create account'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateAccount(true)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                I’ll add my website later
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Legal Terms Modal */}
      <LegalTermsModal
        isOpen={legalModalOpen}
        docType={legalDocType}
        onClose={() => setLegalModalOpen(false)}
      />
    </div>
  );
};
