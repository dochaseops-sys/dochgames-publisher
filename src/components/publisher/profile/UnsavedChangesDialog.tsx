import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  sectionName: string;
  onStay: () => void;
  onDiscardAndLeave: () => void;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  sectionName,
  onStay,
  onDiscardAndLeave
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onStay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-amber-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onStay}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="unsaved-changes-title" className="text-base font-display font-black text-slate-900 leading-tight">
              Unsaved changes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              You have unsaved changes in <span className="font-semibold text-slate-800">{sectionName}</span>.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          If you switch sections now without saving, any modifications you made will be lost. Would you like to stay and save your changes, or discard them?
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onDiscardAndLeave}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors"
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={onStay}
            className="px-5 py-2 rounded-xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-black transition-all shadow-xs active:scale-98"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
};
