import React, { useEffect } from 'react';
import { LogOut, X, CheckCircle2 } from 'lucide-react';

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSignOut: () => void;
}

export const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSignOut
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 id="sign-out-modal-title" className="text-base font-display font-black text-slate-900 leading-tight">
              Sign out of DochGames
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm ending your current publisher session.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            Signing out will end your active session on this device. You will need your login credentials to manage widgets and view analytics.
          </p>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> All game widgets currently embedded on your live websites will continue running normally without interruption.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmSignOut}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
