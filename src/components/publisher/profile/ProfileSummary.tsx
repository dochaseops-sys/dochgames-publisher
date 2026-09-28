import React from 'react';
import { PublisherProfile, PublisherBusiness } from '../../../types/publisherProfile';
import { CheckCircle2, Building, Mail } from 'lucide-react';

interface ProfileSummaryProps {
  profile: PublisherProfile;
  business?: PublisherBusiness;
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  profile,
  business
}) => {
  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'P';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
      <div className="flex items-center gap-4">
        {/* Avatar or Initials Circle */}
        <div className="relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={`Profile photograph of ${profile.fullName}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
            />
          ) : (
            <div 
              aria-label={`Initials for ${profile.fullName}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-display font-black text-xl sm:text-2xl flex items-center justify-center shadow-md ring-2 ring-slate-100"
            >
              {initials}
            </div>
          )}
          <span 
            className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" 
            title="Account status: Active"
          />
        </div>

        {/* Identity Information */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 leading-tight">
              {profile.fullName}
            </h2>
            {profile.displayName && profile.displayName !== profile.fullName && (
              <span className="text-xs text-slate-500 font-medium">
                ({profile.displayName})
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              {profile.role}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {profile.status}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {profile.email}
            </span>
            {business?.name && (
              <>
                <span className="hidden sm:inline text-slate-300">·</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700 truncate">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {business.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
