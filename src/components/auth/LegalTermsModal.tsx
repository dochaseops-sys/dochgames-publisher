import React, { useEffect } from 'react';
import { X, FileText, Shield } from 'lucide-react';

interface LegalTermsModalProps {
  isOpen: boolean;
  docType: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalTermsModal: React.FC<LegalTermsModalProps> = ({
  isOpen,
  docType,
  onClose
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

  const isTerms = docType === 'terms';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col"
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

        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            {isTerms ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <h3 id="legal-modal-title" className="text-base font-display font-black text-slate-900 leading-tight">
              {isTerms ? 'Publisher Agreement' : 'Privacy Policy'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              DochGames for Publishers · Effective September 2026
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-600 leading-relaxed">
          {isTerms ? (
            <>
              <p>
                By creating a DochGames for Publishers account, you agree to syndicate web games onto your authorized websites under the following key principles:
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">1. Distribution License</p>
                <p>You receive a non-exclusive license to embed DochGames widgets on registered domains. Games remain property of their respective creators and DochGames.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">2. Revenue Share & Reporting</p>
                <p>Ad revenue generated through your widgets is tracked transparently and credited to your account balance with monthly automated reporting.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">3. Brand & Quality Safety</p>
                <p>You agree not to embed widgets in deceptive frames or alongside malicious content. DochGames ensures games are malware-free and family-friendly.</p>
              </div>
            </>
          ) : (
            <>
              <p>
                We value your privacy and only collect information essential for operating your publisher account and widgets:
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">1. Data Collected</p>
                <p>We store your account name, work email address, and verified website domains to provide widgets, metrics, and security notifications.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">2. Player Privacy</p>
                <p>DochGames widgets do not track individual reader identities across other websites. Game sessions are aggregated anonymously.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900">3. Data Control</p>
                <p>You can export or delete your publisher account and associated widget logs at any time from your Profile &amp; Settings page.</p>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};
