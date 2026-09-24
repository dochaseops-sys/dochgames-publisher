import React, { useState, useEffect } from 'react';
import { PublisherBusiness, PublisherBusinessType } from '../../../types/publisherProfile';
import { PublisherProperty } from '../../../types';
import { BusinessLogoUploader } from './BusinessLogoUploader';
import { 
  validateRequiredText, 
  validateEmail, 
  validatePhone, 
  validateDescription 
} from '../../../utils/profileValidation';
import { Save, RotateCcw, Check, AlertCircle, ExternalLink, Globe } from 'lucide-react';

interface PublishingBusinessFormProps {
  initialBusiness: PublisherBusiness;
  properties: PublisherProperty[];
  onSave: (updated: Partial<PublisherBusiness>) => Promise<void>;
  onDirtyChange?: (isDirty: boolean) => void;
  onNavigateToWebsites?: () => void;
}

const BUSINESS_TYPES: PublisherBusinessType[] = [
  'Gaming website',
  'News publisher',
  'Blog or online magazine',
  'Entertainment platform',
  'Community website',
  'Media network',
  'Mobile application',
  'Other'
];

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

export const PublishingBusinessForm: React.FC<PublishingBusinessFormProps> = ({
  initialBusiness,
  properties,
  onSave,
  onDirtyChange,
  onNavigateToWebsites
}) => {
  const [name, setName] = useState(initialBusiness.name || '');
  const [type, setType] = useState<PublisherBusinessType>(initialBusiness.type || 'Gaming website');
  const [otherTypeDescription, setOtherTypeDescription] = useState(initialBusiness.otherTypeDescription || '');
  const [primaryWebsiteId, setPrimaryWebsiteId] = useState(initialBusiness.primaryWebsiteId || '');
  const [country, setCountry] = useState(initialBusiness.country || 'United Kingdom');
  const [address, setAddress] = useState(initialBusiness.address || '');
  const [contactEmail, setContactEmail] = useState(initialBusiness.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(initialBusiness.contactPhone || '');
  const [description, setDescription] = useState(initialBusiness.description || '');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialBusiness.logoUrl);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Dirty detection
  const isDirty =
    name !== (initialBusiness.name || '') ||
    type !== (initialBusiness.type || 'Gaming website') ||
    otherTypeDescription !== (initialBusiness.otherTypeDescription || '') ||
    primaryWebsiteId !== (initialBusiness.primaryWebsiteId || '') ||
    country !== (initialBusiness.country || 'United Kingdom') ||
    address !== (initialBusiness.address || '') ||
    contactEmail !== (initialBusiness.contactEmail || '') ||
    contactPhone !== (initialBusiness.contactPhone || '') ||
    description !== (initialBusiness.description || '') ||
    logoUrl !== initialBusiness.logoUrl;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleReset = () => {
    setName(initialBusiness.name || '');
    setType(initialBusiness.type || 'Gaming website');
    setOtherTypeDescription(initialBusiness.otherTypeDescription || '');
    setPrimaryWebsiteId(initialBusiness.primaryWebsiteId || '');
    setCountry(initialBusiness.country || 'United Kingdom');
    setAddress(initialBusiness.address || '');
    setContactEmail(initialBusiness.contactEmail || '');
    setContactPhone(initialBusiness.contactPhone || '');
    setDescription(initialBusiness.description || '');
    setLogoUrl(initialBusiness.logoUrl);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessBanner(null);

    const validationErrors: Record<string, string> = {};

    const nameErr = validateRequiredText(name, 'Business name');
    if (nameErr) validationErrors.name = nameErr;

    if (type === 'Other') {
      const otherErr = validateRequiredText(otherTypeDescription, 'Specific business type');
      if (otherErr) validationErrors.otherTypeDescription = otherErr;
    }

    const emailErr = validateEmail(contactEmail);
    if (emailErr) validationErrors.contactEmail = emailErr;

    const phoneErr = validatePhone(contactPhone);
    if (phoneErr) validationErrors.contactPhone = phoneErr;

    const descErr = validateDescription(description, 300);
    if (descErr) validationErrors.description = descErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const selectedProp = properties.find((p) => p.id === primaryWebsiteId);

    try {
      setIsSaving(true);
      await onSave({
        name: name.trim(),
        type,
        otherTypeDescription: type === 'Other' ? otherTypeDescription.trim() : undefined,
        primaryWebsiteId: primaryWebsiteId || undefined,
        primaryWebsiteDomain: selectedProp ? selectedProp.domain : undefined,
        country,
        address: address.trim() || undefined,
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        description: description.trim() || undefined,
        logoUrl
      });
      setSuccessBanner('Publishing business details have been saved successfully.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch {
      setErrors({ form: 'An error occurred while saving business details. Please try again.' });
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
              Publishing Business
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your company entity, brand information and primary connected website.
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

      {/* Brand Logo Section */}
      <div className="pt-2 pb-6 border-b border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Publisher Brand Logo
        </label>
        <BusinessLogoUploader
          currentLogoUrl={logoUrl}
          businessName={name || initialBusiness.name}
          onLogoChange={(newUrl) => setLogoUrl(newUrl)}
        />
      </div>

      {/* Organization Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Business Name */}
        <div>
          <label htmlFor="biz-name" className="block text-xs font-bold text-slate-700 mb-1.5">
            Business or publication name <span className="text-rose-500">*</span>
          </label>
          <input
            id="biz-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
              errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="e.g. GameZone Daily Media"
            required
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>}
        </div>

        {/* Business Type */}
        <div>
          <label htmlFor="biz-type" className="block text-xs font-bold text-slate-700 mb-1.5">
            Business type
          </label>
          <select
            id="biz-type"
            value={type}
            onChange={(e) => setType(e.target.value as PublisherBusinessType)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
          >
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
        </div>

        {/* Other Business Type Details (conditional) */}
        {type === 'Other' && (
          <div className="sm:col-span-2">
            <label htmlFor="other-biz-type" className="block text-xs font-bold text-slate-700 mb-1.5">
              Specify business type <span className="text-rose-500">*</span>
            </label>
            <input
              id="other-biz-type"
              type="text"
              value={otherTypeDescription}
              onChange={(e) => setOtherTypeDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.otherTypeDescription ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
              }`}
              placeholder="e.g. Student Newspaper, Non-profit Portal, Discord Community"
            />
            {errors.otherTypeDescription && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.otherTypeDescription}</p>
            )}
          </div>
        )}

        {/* Primary Website */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="primary-website" className="block text-xs font-bold text-slate-700">
              Primary connected website
            </label>
            {onNavigateToWebsites && (
              <button
                type="button"
                onClick={onNavigateToWebsites}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Manage connected websites</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              id="primary-website"
              value={primaryWebsiteId}
              onChange={(e) => setPrimaryWebsiteId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
            >
              <option value="">-- No primary website selected --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Used as the default domain for performance summaries and widget previews.
          </p>
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="biz-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Business contact email <span className="text-rose-500">*</span>
          </label>
          <input
            id="biz-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
              errors.contactEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="e.g. publishing@gamezone-daily.com"
            required
          />
          {errors.contactEmail ? (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.contactEmail}</p>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400">Where business inquiries and invoicing notices go.</p>
          )}
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="biz-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
            Business contact phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="biz-phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all ${
              errors.contactPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="e.g. +44 20 7946 0991"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.contactPhone}</p>
          )}
        </div>

        {/* Country */}
        <div className="sm:col-span-2">
          <label htmlFor="biz-country" className="block text-xs font-bold text-slate-700 mb-1.5">
            Headquarters country
          </label>
          <select
            id="biz-country"
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

        {/* Registered Address */}
        <div className="sm:col-span-2">
          <label htmlFor="biz-address" className="block text-xs font-bold text-slate-700 mb-1.5">
            Registered business address <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="biz-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
            placeholder="e.g. 48 Chancery Lane, London WC2A 1JF"
          />
        </div>

        {/* Description / About */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="biz-desc" className="block text-xs font-bold text-slate-700">
              Publication description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                description.length > 300 ? 'text-rose-600 font-bold' : 'text-slate-400'
              }`}
            >
              {description.length} / 300
            </span>
          </div>
          <textarea
            id="biz-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all resize-none ${
              errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
            }`}
            placeholder="Brief overview of your website audience, editorial niche, or community…"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
          )}
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
