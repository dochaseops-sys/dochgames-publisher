/**
 * Form validation helpers for Profile & Settings.
 * Provides accessible, plain-English validation messages.
 */

export function validateRequiredText(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `${fieldName} is required.`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  return null;
}

export function validatePhone(phone?: string): string | null {
  if (!phone || !phone.trim()) return null; // optional
  const phoneClean = phone.replace(/[\s\-\(\)\+\.]/g, '');
  if (!/^\d{7,15}$/.test(phoneClean)) {
    return 'Please enter a valid phone number with 7 to 15 digits.';
  }
  return null;
}

export function validateUrl(url?: string): string | null {
  if (!url || !url.trim()) return null; // optional
  try {
    const formatted = url.startsWith('http') ? url : `https://${url}`;
    new URL(formatted);
    return null;
  } catch {
    return 'Please enter a valid website address (e.g. example.com).';
  }
}

export function validateDescription(text?: string, maxLength: number = 300): string | null {
  if (!text) return null;
  if (text.length > maxLength) {
    return `Description cannot exceed ${maxLength} characters (currently ${text.length}).`;
  }
  return null;
}

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File, maxSizeBytes: number = MAX_IMAGE_SIZE_BYTES): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file was selected.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PNG, JPG, or WebP image.'
    };
  }

  if (file.size > maxSizeBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb}MB). The maximum allowed file size is 5MB.`
    };
  }

  return { valid: true };
}

export function validatePasswordChange(
  current: string,
  newPassword: string,
  confirmPassword: string
): { current?: string; newPassword?: string; confirmPassword?: string } {
  const errors: { current?: string; newPassword?: string; confirmPassword?: string } = {};

  if (!current) {
    errors.current = 'Please enter your current password.';
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters long.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password.';
  } else if (newPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
