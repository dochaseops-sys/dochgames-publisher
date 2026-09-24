import React, { useState } from 'react';
import { PublisherSecurityInfo } from '../../../types/publisherProfile';
import { PasswordChangeModal } from './PasswordChangeModal';
import { 
  ShieldCheck, Lock, KeyRound, Smartphone, Laptop, 
  MapPin, LogOut, CheckCircle2, Clock 
} from 'lucide-react';

interface SecuritySettingsProps {
  securityInfo: PublisherSecurityInfo;
  onChangePassword: (current: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  onSignOut: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  securityInfo,
  onChangePassword,
  onSignOut
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLastUpdated, setPasswordLastUpdated] = useState(securityInfo.passwordLastChanged);

  const handlePasswordSubmit = async (current: string, newPass: string) => {
    const res = await onChangePassword(current, newPass);
    if (res.success) {
      setPasswordLastUpdated(new Date().toISOString().split('T')[0]);
    }
    return res;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-display font-black text-slate-900">
          Account Security
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your sign-in credentials, authentication method and active sessions.
        </p>
      </div>

      {/* Sign-in Method & Password Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Password & Sign-in</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Sign-in email: <span className="font-medium text-slate-700">{securityInfo.signInEmail}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Password last changed: {passwordLastUpdated}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/70 text-slate-900 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto"
          >
            Change password
          </button>
        </div>
      </div>

      {/* Two-Step Verification (2FA) Status */}
      <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Two-Step Verification (2FA)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Coming soon
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Two-step verification is not available yet for DochGames Publisher accounts. In the meantime, your account is guarded by your private password, encrypted session tokens, and automated IP anomaly detection.
            </p>
          </div>
        </div>
      </div>

      {/* Active Session Information */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Current Device & Session
        </h4>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>{securityInfo.currentSession.device} · {securityInfo.currentSession.browser}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  {securityInfo.currentSession.lastActive}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{securityInfo.currentSession.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-900">Sign out of DochGames Publisher</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Signing out will end your active session on this device. Your widgets will continue running uninterrupted.
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 hover:text-rose-800 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Password Change Dialog */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};
