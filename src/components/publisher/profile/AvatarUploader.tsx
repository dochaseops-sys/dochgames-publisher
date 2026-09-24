import React, { useRef, useState, useEffect } from 'react';
import { Camera, Trash2, Upload, AlertCircle, Check } from 'lucide-react';
import { validateImageFile } from '../../../utils/profileValidation';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  fullName: string;
  onAvatarChange: (dataUrl?: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  fullName,
  onAvatarChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  const initials = fullName
    ? fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'P';

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
      onAvatarChange(dataUrl);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 2500);
    };
    reader.onerror = () => {
      setError('We could not read the selected image file. Please try another image.');
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    setError(null);
    onAvatarChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Preview Circle */}
        <div className="relative shrink-0">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt={`Profile preview for ${fullName}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
            />
          ) : (
            <div 
              aria-label={`Initials for ${fullName}`}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-display font-black text-2xl flex items-center justify-center shadow-md ring-2 ring-slate-100"
            >
              {initials}
            </div>
          )}
        </div>

        {/* Buttons and guidance */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="sr-only"
              id="avatar-file-input"
              aria-describedby="avatar-guidance avatar-error"
            />

            <label
              htmlFor="avatar-file-input"
              className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs focus-within:ring-2 focus-within:ring-blue-600"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <span>{currentAvatarUrl ? 'Change photo' : 'Upload photo'}</span>
            </label>

            {currentAvatarUrl && (
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

          <p id="avatar-guidance" className="text-[11px] text-slate-500">
            Supports PNG, JPG or WebP up to 5MB. Photos are saved locally for this account.
          </p>

          {successNotice && (
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> Photo updated. Select &quot;Save changes&quot; to apply.
            </p>
          )}

          {error && (
            <p id="avatar-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 bg-rose-50 p-2 rounded-xl border border-rose-100">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
