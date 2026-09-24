import React, { useRef, useState } from 'react';
import { Building2, Camera, Trash2, Check, AlertCircle } from 'lucide-react';
import { validateImageFile } from '../../../utils/profileValidation';

interface BusinessLogoUploaderProps {
  currentLogoUrl?: string;
  businessName: string;
  onLogoChange: (dataUrl?: string) => void;
}

export const BusinessLogoUploader: React.FC<BusinessLogoUploaderProps> = ({
  currentLogoUrl,
  businessName,
  onLogoChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  const initials = businessName
    ? businessName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DG';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Please select a valid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onLogoChange(dataUrl);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 2500);
    };
    reader.onerror = () => {
      setError('We could not read the selected image file. Please try another logo.');
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    setError(null);
    onLogoChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Logo Preview (Square with rounded corners) */}
        <div className="relative shrink-0">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt={`Brand logo for ${businessName}`}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100 bg-white"
            />
          ) : (
            <div 
              aria-label={`Brand initials for ${businessName}`}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 text-white font-display font-black text-2xl flex items-center justify-center shadow-md ring-2 ring-slate-100"
            >
              {initials}
            </div>
          )}
        </div>

        {/* Controls and guidance */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="sr-only"
              id="business-logo-input"
              aria-describedby="logo-guidance logo-error"
            />

            <label
              htmlFor="business-logo-input"
              className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs focus-within:ring-2 focus-within:ring-blue-600"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>{currentLogoUrl ? 'Change logo' : 'Upload logo'}</span>
            </label>

            {currentLogoUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <p id="logo-guidance" className="text-[11px] text-slate-500">
            Recommended size: 400×400px. PNG, JPG or WebP up to 5MB.
          </p>

          {successNotice && (
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> Logo updated. Select &quot;Save changes&quot; to apply.
            </p>
          )}

          {error && (
            <p id="logo-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 bg-rose-50 p-2 rounded-xl border border-rose-100">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
