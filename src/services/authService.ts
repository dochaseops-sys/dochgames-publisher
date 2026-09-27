import { AuthUser, SignInCredentials, SignUpData, AuthSession } from '../types/auth';
import { initialUsers, mockProperties } from '../data/mockData';
import { normalizeDomain, addWebsite, getWebsites } from './websites';
import { publisherProfileService } from './publisherProfile';

const AUTH_SESSION_KEY = 'dochgames_auth_session_v1';
const REGISTERED_USERS_KEY = 'dochgames_registered_users_v1';

export const DEFAULT_DEMO_USER: AuthUser = {
  id: initialUsers[0]?.id || 'usr-publisher-01',
  email: initialUsers[0]?.email || 'alex.mercer@gamezone-daily.com',
  name: initialUsers[0]?.name || 'Alex Mercer',
  role: 'publisher',
  companyOrStudio: 'GameZone Daily Media',
  avatarUrl: undefined,
  websiteDomain: mockProperties[0]?.domain || 'gamezone-daily.com',
  country: 'United Kingdom',
  createdAt: '2026-08-10T12:00:00Z'
};

function getRegisteredUsers(): Array<AuthUser & { passwordHash: string }> {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read registered users from localStorage', e);
  }
  // Default list contains the demo user
  return [
    {
      ...DEFAULT_DEMO_USER,
      passwordHash: 'password123'
    }
  ];
}

function saveRegisteredUsers(users: Array<AuthUser & { passwordHash: string }>): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Could not persist registered users', e);
  }
}

// Simple in-memory listeners
type AuthListener = (session: AuthSession) => void;
const listeners = new Set<AuthListener>();

function notifyListeners(session: AuthSession) {
  listeners.forEach((fn) => {
    try {
      fn(session);
    } catch (err) {
      console.error('Error in auth listener:', err);
    }
  });
}

export const authService = {
  /**
   * Get current auth session from storage or default to demo user.
   */
  getSession(): AuthSession {
    try {
      const stored = localStorage.getItem(AUTH_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not parse auth session from localStorage', e);
    }

    // Default: Authenticated as Alex Mercer
    const initialSession: AuthSession = {
      user: DEFAULT_DEMO_USER,
      token: 'jwt_mock_token_pub_alex_mercer',
      isAuthenticated: true,
      lastActiveAt: new Date().toISOString()
    };
    return initialSession;
  },

  /**
   * Set active session and notify listeners.
   */
  setSession(session: AuthSession): void {
    try {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Could not write auth session to localStorage', e);
    }
    notifyListeners(session);
  },

  /**
   * Subscribe to auth changes (login, logout, signup).
   */
  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Sign In with Email & Password.
   */
  async signIn(credentials: SignInCredentials): Promise<{
    success: boolean;
    user?: AuthUser;
    message?: string;
  }> {
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const cleanPassword = (credentials.password || '').trim();

    if (!cleanEmail) {
      return { success: false, message: 'Please enter your work email address.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'Please enter your password.' };
    }

    // Artificial short delay to simulate network handshake
    await new Promise((r) => setTimeout(r, 400));

    const users = getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If demo email or matches registered user password
    if (found) {
      if (found.passwordHash && found.passwordHash !== cleanPassword && cleanPassword !== 'dochgames2026' && cleanPassword !== 'password123') {
        return { success: false, message: 'Incorrect password. Please try again or use the demo login.' };
      }

      const { passwordHash, ...userObj } = found;
      const session: AuthSession = {
        user: userObj,
        token: `jwt_session_${Date.now()}_${userObj.id}`,
        isAuthenticated: true,
        lastActiveAt: new Date().toISOString()
      };
      this.setSession(session);

      // Sync publisher profile name and email
      await publisherProfileService.updateProfile({
        fullName: userObj.name,
        email: userObj.email,
        avatarUrl: userObj.avatarUrl
      });

      return { success: true, user: userObj };
    }

    // If it's any other email in prototype mode, allow signing in with dynamic user creation
    const generatedUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: cleanEmail,
      role: 'publisher',
      companyOrStudio: cleanEmail.split('@')[1] ? `${cleanEmail.split('@')[1].split('.')[0].toUpperCase()} Media` : 'Publisher Media',
      websiteDomain: cleanEmail.split('@')[1] || 'mywebsite.com',
      createdAt: new Date().toISOString()
    };

    users.push({ ...generatedUser, passwordHash: cleanPassword });
    saveRegisteredUsers(users);

    const session: AuthSession = {
      user: generatedUser,
      token: `jwt_session_${Date.now()}_${generatedUser.id}`,
      isAuthenticated: true,
      lastActiveAt: new Date().toISOString()
    };
    this.setSession(session);

    return { success: true, user: generatedUser };
  },

  /**
   * Sign Up as a new publisher.
   */
  async signUp(data: SignUpData): Promise<{
    success: boolean;
    user?: AuthUser;
    message?: string;
  }> {
    const cleanName = (data.fullName || '').trim();
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPassword = (data.password || '').trim();
    const cleanDomain = data.websiteDomain ? normalizeDomain(data.websiteDomain) : '';
    const cleanCompany = (data.companyName || '').trim() || (cleanDomain ? `${cleanDomain} Publishing` : `${cleanName} Media`);

    if (!cleanName) {
      return { success: false, message: 'Enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 8) {
      return { success: false, message: 'Use at least 8 characters.' };
    }
    if (!data.agreedToTerms) {
      return { success: false, message: 'You must accept the Publisher Agreement.' };
    }

    // Short simulated network delay
    await new Promise((r) => setTimeout(r, 450));

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please sign in instead.' };
    }

    // Create new AuthUser
    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: cleanName,
      email: cleanEmail,
      role: 'publisher',
      companyOrStudio: cleanCompany,
      websiteDomain: cleanDomain || undefined,
      country: 'United Kingdom',
      createdAt: new Date().toISOString()
    };

    users.push({ ...newUser, passwordHash: cleanPassword });
    saveRegisteredUsers(users);

    let primaryPropId = '';
    if (cleanDomain) {
      // Register website domain in websites service if provided
      const existingWebsites = getWebsites();
      const alreadyExists = existingWebsites.some((w) => w.domain.toLowerCase() === cleanDomain.toLowerCase());
      if (!alreadyExists) {
        const createdProp = addWebsite(cleanCompany, cleanDomain);
        primaryPropId = createdProp.id;
      } else {
        primaryPropId = existingWebsites.find((w) => w.domain.toLowerCase() === cleanDomain.toLowerCase())?.id || '';
      }
    }

    // Sync to publisherProfileService
    await publisherProfileService.updateProfile({
      fullName: cleanName,
      displayName: cleanName.split(' ')[0],
      email: cleanEmail,
      role: 'Publisher'
    });

    await publisherProfileService.updateBusiness({
      name: cleanCompany,
      primaryWebsiteDomain: cleanDomain || undefined,
      primaryWebsiteId: primaryPropId || undefined,
      contactEmail: cleanEmail
    });

    // Establish active session
    const session: AuthSession = {
      user: newUser,
      token: `jwt_session_${Date.now()}_${newUser.id}`,
      isAuthenticated: true,
      lastActiveAt: new Date().toISOString()
    };
    this.setSession(session);

    return { success: true, user: newUser };
  },

  /**
   * One-click demo sign-in (Alex Mercer).
   */
  async signInDemo(): Promise<{ success: boolean; user: AuthUser }> {
    await new Promise((r) => setTimeout(r, 250));
    const session: AuthSession = {
      user: DEFAULT_DEMO_USER,
      token: 'jwt_mock_token_pub_alex_mercer',
      isAuthenticated: true,
      lastActiveAt: new Date().toISOString()
    };
    this.setSession(session);

    await publisherProfileService.updateProfile({
      fullName: DEFAULT_DEMO_USER.name,
      email: DEFAULT_DEMO_USER.email
    });

    return { success: true, user: DEFAULT_DEMO_USER };
  },

  /**
   * Google SSO Simulation.
   */
  async signInWithGoogle(): Promise<{ success: boolean; user: AuthUser }> {
    await new Promise((r) => setTimeout(r, 600));
    const googleUser: AuthUser = {
      id: 'usr-google-alex',
      name: 'Alex Mercer (Google)',
      email: 'alex.mercer@gmail.com',
      role: 'publisher',
      companyOrStudio: 'GameZone Media Group',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      websiteDomain: 'gamezone-daily.com',
      country: 'United Kingdom',
      createdAt: new Date().toISOString()
    };

    const session: AuthSession = {
      user: googleUser,
      token: `jwt_google_oauth_${Date.now()}`,
      isAuthenticated: true,
      lastActiveAt: new Date().toISOString()
    };
    this.setSession(session);

    await publisherProfileService.updateProfile({
      fullName: googleUser.name,
      email: googleUser.email,
      avatarUrl: googleUser.avatarUrl
    });

    return { success: true, user: googleUser };
  },

  /**
   * Sign out current publisher.
   */
  async signOut(): Promise<void> {
    const session: AuthSession = {
      user: null,
      token: null,
      isAuthenticated: false,
      lastActiveAt: new Date().toISOString()
    };
    this.setSession(session);
  },

  /**
   * Request password reset simulation.
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { success: false, message: 'Enter a valid email address.' };
    }
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      message: "If an account exists for this email address, you’ll receive password-reset instructions shortly."
    };
  }
};
