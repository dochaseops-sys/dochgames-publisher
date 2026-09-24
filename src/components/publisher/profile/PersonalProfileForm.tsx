import React, { useState, useEffect } from 'react';
import { PublisherProfile } from '../../../types/publisherProfile';
import { AvatarUploader } from './AvatarUploader';
import { validateRequiredText, validatePhone } from '../../../utils/profileValidation';
import { Check, AlertCircle, Lock, Save, RotateCcw } from 'lucide-react';

interface PersonalProfileFormProps {
  initialProfile: PublisherProfile;
  onSave: (updated: Partial<PublisherProfile>) => Promise<void>;
  onDirtyChange?: (isDirty: boolean) => void;
}

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Ireland',
  'Nigeria',
  'South Africa',
  'Kenya',
  'India',
  'Singapore',
  'Japan',
  'Brazil',
  'Other'
];

const TIMEZONES = [
  { value: 'Europe/London', label: 'London, Edinburgh, Dublin (GMT / BST)' },
  { value: 'America/New_York', label: 'New York, Toronto, Miami (Eastern Time)' },
  { value: 'America/Chicago', label: 'Chicago, Dallas, Mexico City (Central Time)' },
  { value: 'America/Denver', label: 'Denver, Phoenix, Calgary (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles, Vancouver, Seattle (Pacific Time)' },
  { value: 'Europe/Paris', label: 'Paris, Berlin, Amsterdam, Madrid (CET / CEST)' },
  { value: 'Africa/Lagos', label: 'Lagos, Accra, Douala (WAT)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg, Cape Town, Nairobi (SAST / EAT)' },
  { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi, Muscat (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai, New Delhi, Bengaluru (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore, Kuala Lumpur, Hong Kong (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Seoul (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney, Melbourne, Canberra (AEST / AEDT)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
];

const LANGUAGES = [
  { value: 'English (UK)', label: 'English (UK)' },
  { value: 'English (US)', label: 'English (US)' },
  { value: 'French', label: 'Français (French)' },
  { value: 'Spanish', label: 'Español (Spanish)' },
  { value: 'German', label: 'Deutsch (German)' },
  { value: 'Japanese', label: '日本語 (Japanese)' }
];

export const PersonalProfileForm: React.FC<PersonalProfileFormProps> = ({
  initialProfile,
  onSave,
  onDirtyChange
}) => {
  const [fullName, setFullName] = useState(initialProfile.fullName || '');
  const [displayName, setDisplayName] = useState(initialProfile.displayName || '');
  const [phone, setPhone] = useState(initialProfile.phone || '');
  const [jobTitle, setJobTitle] = useState(initialProfile.jobTitle || '');
  const [country, setCountry] = useState(initialProfile.country || 'United Kingdom');
  const [timezone, setTimezone] = useState(initialProfile.timezone || 'Europe/London');
  const [preferredLanguage, setPreferredLanguage] = useState(initialProfile.preferredLanguage || 'English (UK)');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialProfile.avatarUrl);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Check if form is dirty
  const isDirty =
    fullName !== (initialProfile.fullName || '') ||
    displayName !== (initialProfile.displayName || '') ||
    phone !== (initialProfile.phone || '') ||
    jobTitle !== (initialProfile.jobTitle || '') ||
    country !== (initialProfile.country || 'United Kingdom') ||
    timezone !== (initialProfile.timezone || 'Europe/London') ||
    preferredLanguage !== (initialProfile.preferredLanguage || 'English (UK)') ||
    avatarUrl !== initialProfile.avatarUrl;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleReset = () => {
    setFullName(initialProfile.fullName || '');
    setDisplayName(initialProfile.displayName || '');
    setPhone(initialProfile.phone || '');
    setJobTitle(initialProfile.jobTitle || '');
    setCountry(initialProfile.country || 'United Kingdom');
    setTimezone(initialProfile.timezone || 'Europe/London');
    setPreferredLanguage(initialProfile.preferredLanguage || 'English (UK)');
    setAvatarUrl(initialProfile.avatarUrl);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessBanner(null);

    const validationErrors: Record<string, string> = {};
    const nameErr = validateRequiredText(fullName, 'Full name');
    if (nameErr) validationErrors.fullName = nameErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) validationErrors.phone = phoneErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        fullName: fullName.trim(),
        displayName: displayName.trim() || undefined,
        phone: phone.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        country,
        timezone,
        preferredLanguage,
        avatarUrl
      });
      setSuccessBanner('Your profile details have been saved successfully.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch {
      setErrors({ form: 'An error occurred while saving your profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-black text-slate-900">
              Personal Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your individual contact details and local preferences.
            </p>
          </div>
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-medium">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>{successBanner}</span>
        </div>
      )}

      {/* Form Error */}
      {errors.form && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Avatar Uploader Section */}
      <div className="pt-2 pb-6 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Profile Photograph
        </label>
        <AvatarUploader
          currentAvatarUrl={avatarUrl}
          fullName={fullName || initialProfile.fullName}
          onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
        />
      </div>

      {/* Personal Identity Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label htmlFor="full-name" className="block text-xs font-bold text-slate-700 mb-1.5">
            Full name <span className="text-rose-500">*</span>
          </label>
          <input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
              errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="e.g. Alex Mercer"
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Display / Preferred Name */}
        <div>
          <label htmlFor="display-name" className="block text-xs font-bold text-slate-700 mb-1.5">
            Display name <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="e.g. Alex"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Shown on your workspace greeting and in-app messages.
          </p>
        </div>

        {/* Email Address (Read-only with explanation) */}
        <div>
          <label htmlFor="account-email" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Email address</span>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" /> Read-only
            </span>
          </label>
          <div className="relative">
            <input
              id="account-email"
              type="email"
              value={initialProfile.email}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 cursor-not-allowed pr-9 font-medium"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Your login email is managed securely. To update this address, please contact{' '}
            <a href="mailto:support@dochgames.com" className="text-blue-600 hover:underline">
              support@dochgames.com
            </a>.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="profile-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
            Phone number <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
              errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="e.g. +44 20 7946 0991"
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400">Used for urgent publisher alerts if requested.</p>
          )}
        </div>

        {/* Job Title */}
        <div className="sm:col-span-2">
          <label htmlFor="job-title" className="block text-xs font-bold text-slate-700 mb-1.5">
            Job title or role in organisation <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="job-title"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="e.g. Head of Digital Publishing, Editorial Director, Product Lead"
          />
        </div>
      </div>

      {/* Regional & Timezone Preferences */}
      <div className="pt-6 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Regional & Local Preferences
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Country */}
          <div>
            <label htmlFor="profile-country" className="block text-xs font-bold text-slate-700 mb-1.5">
              Country
            </label>
            <select
              id="profile-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="profile-timezone" className="block text-xs font-bold text-slate-700 mb-1.5">
              Timezone
            </label>
            <select
              id="profile-timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Language */}
          <div>
            <label htmlFor="profile-language" className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred language
            </label>
            <select
              id="profile-language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 order-2 sm:order-1">
          {isDirty ? 'Remember to save your changes before leaving this page.' : 'All changes are up to date.'}
        </p>
        <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs ${
              isDirty && !isSaving
                ? 'bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 shadow-sm active:scale-98 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isSaving ? 'Saving…' : 'Save changes'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
