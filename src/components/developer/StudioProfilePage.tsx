import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Building, Globe, Mail, DollarSign, CheckCircle, Shield } from 'lucide-react';

interface StudioProfilePageProps {
  currentUser: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export const StudioProfilePage: React.FC<StudioProfilePageProps> = ({
  currentUser,
  onUpdateProfile
}) => {
  const [studioName, setStudioName] = useState(currentUser.companyOrStudio || 'Velocity Pixel Labs');
  const [legalName, setLegalName] = useState('Velocity Interactive Corp.');
  const [contactEmail, setContactEmail] = useState(currentUser.email);
  const [country, setCountry] = useState(currentUser.country || 'United States');
  const [website, setWebsite] = useState(currentUser.website || 'https://velocitypixel.dev');
  const [payoutMethod, setPayoutMethod] = useState<'wire' | 'stripe' | 'paypal'>('stripe');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateProfile({
      companyOrStudio: studioName,
      email: contactEmail,
      country,
      website
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200/80 p-6 sm:p-7 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Studio Profile & Payout Settings</h2>
          <p className="text-slate-500 text-xs mt-1">Manage public studio information and commercial payout agreements.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
        >
          Save Studio Profile
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Studio settings updated successfully.</span>
        </div>
      )}

      {/* Public profile */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-600" />
          Public Studio Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Studio Display Name</label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Studio Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country / Territory</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Commercial / Payout agreement separated from public fields (Section 5.2 requirement) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-amber-500" />
          Commercial Agreements & Payout Destination
        </h3>
        <p className="text-slate-500 text-xs">
          Commercial terms and payout accounts are strictly confidential and separated from public-facing catalogue profiles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Legal Entity / Registered Business Name</label>
            <input
              type="text"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Payout Channel</label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="stripe">Stripe Connect (Standard Rev-Share)</option>
              <option value="wire">Direct Bank Wire (SWIFT / IBAN)</option>
              <option value="paypal">PayPal Mass Pay</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Developer Commercial Agreement 2026: <strong className="text-slate-900 font-bold">Accepted & Signed</strong></span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Net-30 Terms</span>
        </div>
      </div>
    </div>
  );
};

export default StudioProfilePage;
