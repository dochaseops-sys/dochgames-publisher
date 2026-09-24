import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (confirmationPhrase: string) => Promise<{ success: boolean; message: string }>;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  isOpen,
  onClose,
  onConfirmDelete
}) => {
  const [confirmationPhrase, setConfirmationPhrase] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmationPhrase('');
      setError(null);
      setIsDeleting(false);
    }
  }, [isOpen]);

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

  const isConfirmed = confirmationPhrase.trim() === 'DELETE';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setError(null);
    setIsDeleting(true);

    try {
      const res = await onConfirmDelete(confirmationPhrase.trim());
      if (!res.success) {
        setError(res.message);
        setIsDeleting(false);
      }
    } catch {
      setError('An error occurred during account deletion.');
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-rose-200 shadow-2xl relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="delete-account-title" className="text-base font-display font-black text-rose-950 leading-tight">
              Delete publisher account
            </h3>
            <p className="text-xs text-rose-600 font-medium mt-0.5">
              Danger: this action is irreversible.
            </p>
          </div>
        </div>

        {/* Consequence points */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-slate-700 space-y-2 mb-5">
          <p className="font-semibold text-rose-950">If you proceed with account deletion:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>All embedded game widgets across your sites will stop loading immediately.</li>
            <li>Your connected website domains and verification tokens will be revoked.</li>
            <li>Your historical player engagement logs and reports will be deleted.</li>
            <li>Your account credentials and publisher keys will be permanently deactivated.</li>
          </ul>
        </div>

        {/* Confirmation Input */}
        <div className="space-y-3">
          <label htmlFor="confirm-phrase-input" className="block text-xs font-bold text-slate-700">
            Type <span className="font-mono text-rose-600 select-all font-black">DELETE</span> to confirm:
          </label>
          <input
            id="confirm-phrase-input"
            type="text"
            value={confirmationPhrase}
            onChange={(e) => setConfirmationPhrase(e.target.value)}
            disabled={isDeleting}
            placeholder="Type DELETE"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 placeholder-slate-400"
            autoFocus
          />

          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-xs ${
              isConfirmed && !isDeleting
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-98'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting account…' : 'Permanently delete account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
