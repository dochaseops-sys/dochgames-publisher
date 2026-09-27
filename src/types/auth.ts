import { UserRole } from './index';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyOrStudio: string;
  avatarUrl?: string;
  websiteDomain?: string;
  country?: string;
  createdAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  websiteDomain?: string;
  companyName?: string;
  agreedToTerms: boolean;
  newsletterOptIn?: boolean;
}

export interface AuthSession {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  lastActiveAt?: string;
}

export interface PasswordResetRequest {
  email: string;
}
