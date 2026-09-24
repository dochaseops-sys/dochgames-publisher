import React, { useState } from 'react';
import { PublisherAdvancedInfo } from '../../../types/publisherProfile';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { 
  Key, Eye, EyeOff, Copy, Check, Download, 
  Trash2, AlertTriangle, ShieldAlert, Sliders 
} from 'lucide-react';

interface AdvancedPublisherSettingsProps {
  advancedInfo: PublisherAdvancedInfo;
  onRequestDataExport: () => Promise<{ success: boolean; message: string; requestId: string }>;
  onRequestAccountDeletion: (phrase: string) => Promise<{ success: boolean; message: string }>;
  onAccountDeleted: () => void;
}

export const AdvancedPublisherSettings: React.FC<AdvancedPublisherSettingsProps> = ({
  advancedInfo,
  onRequestDataExport,
  onRequestAccountDeletion,
  onAccountDeleted
}) => {
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Masked key display
  const actualKey = advancedInfo.defaultPublisherKey;
  const maskedKey = actualKey.slice(0, 8) + '••••••••' + actualKey.slice(-4);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(actualKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(advancedInfo.publisherId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await onRequestDataExport();
      if (res.success) {
        setExportNotice(res.message);
      }
    } catch {
      setExportNotice('Could not initiate data export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = async (phrase: string) => {
    const res = await onRequestAccountDeletion(phrase);
    if (res.success) {
      setIsDeleteDialogOpen(false);
      onAccountDeleted();
    }
    return res;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-display font-black text-slate-900">
          Advanced Settings & Identifiers
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Access publisher integration keys, export your account data, or manage your publisher account lifecycle.
        </p>
      </div>

      {/* Publisher Key Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-[#D6F938] flex items-center justify-center shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Publisher Live Key</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Used automatically by DochGames embed snippets to authenticate your widgets.
            </p>

            {/* Key Container */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1 font-mono text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 select-all overflow-x-auto">
                {showKey ? actualKey : maskedKey}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showKey ? 'Hide' : 'Reveal'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy key</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-amber-700 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 mt-3">
              <strong>Keep this key secret:</strong> Do not post your publisher live key in public GitHub repositories or open forums.
            </p>
          </div>
        </div>
      </div>

      {/* Account Meta & API Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Publisher Account ID */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publisher Account ID</span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
            >
              {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedId ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-slate-900 mt-1">
            {advancedInfo.publisherId}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Reference for support tickets and invoicing.</p>
        </div>

        {/* Account Creation Date */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Registered</span>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {advancedInfo.accountCreatedAt}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">API: {advancedInfo.apiStatus}</p>
        </div>
      </div>

      {/* Data Export Card */}
      <div className="pt-2 border-t border-slate-100">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export publisher data</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Request an archive containing your widget configurations, website profiles, and historic performance logs in structured JSON format.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Preparing archive…' : 'Request data export'}</span>
          </button>
        </div>

        {exportNotice && (
          <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="pt-2 border-t border-slate-100">
        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Danger Zone: Delete publisher account</span>
              </div>
              <p className="text-xs text-rose-800/80 max-w-xl">
                Permanently revoke all active widgets, unlink connected websites, and delete your account data. This action cannot be reversed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};
