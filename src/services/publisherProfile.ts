import { 
  PublisherProfile, 
  PublisherBusiness, 
  PublisherNotificationPreferences, 
  PublisherSecurityInfo, 
  PublisherAdvancedInfo 
} from '../types/publisherProfile';
import { initialUsers, mockProperties } from '../data/mockData';

const PROFILE_KEY = 'dochgames_profile_v1';
const BUSINESS_KEY = 'dochgames_business_v1';
const NOTIF_PREFS_KEY = 'dochgames_notif_prefs_v1';

// Initial Defaults
const DEFAULT_PROFILE: PublisherProfile = {
  id: initialUsers[0]?.id || 'usr-publisher-01',
  fullName: initialUsers[0]?.name || 'Alex Mercer',
  displayName: 'Alex',
  email: initialUsers[0]?.email || 'alex.mercer@gamezone-daily.com',
  phone: '+44 20 7946 0991',
  jobTitle: 'Head of Digital Publishing',
  avatarUrl: undefined,
  country: 'United Kingdom',
  timezone: 'Europe/London',
  preferredLanguage: 'English',
  role: 'Publisher',
  status: 'Active',
  createdAt: '2026-08-10T12:00:00Z'
};

const DEFAULT_BUSINESS: PublisherBusiness = {
  id: 'biz-01',
  name: 'GameZone Daily Media',
  type: 'Gaming website',
  otherTypeDescription: undefined,
  primaryWebsiteId: mockProperties[0]?.id || 'prop-01',
  primaryWebsiteDomain: mockProperties[0]?.domain || 'gamezone-daily.com',
  country: 'United Kingdom',
  address: '48 Chancery Lane, London WC2A 1JF',
  contactEmail: 'publishing@gamezone-daily.com',
  contactPhone: '+44 20 7946 0991',
  description: 'Premier daily destination for arcade gaming news, indie spotlights, and instant browser game experiences.',
  logoUrl: undefined
};

const DEFAULT_NOTIFICATIONS: PublisherNotificationPreferences = {
  widgetAlerts: {
    installationCompleted: true,
    installationProblem: true,
    widgetPausedOrStopped: true,
    websiteVerificationCompleted: true,
    websiteVerificationFailed: true
  },
  performanceUpdates: {
    weeklySummary: true,
    monthlyReport: true,
    surgeInGameStarts: true,
    optimisationRecommendations: true
  },
  accountUpdates: {
    importantAccountUpdates: true,
    securityAlerts: true, // Always mandatory
    newFeatures: true,
    productTips: false
  },
  channels: {
    email: true,
    inApp: true,
    browserNotifications: false
  },
  frequency: 'daily_summary'
};

export const publisherProfileService = {
  async getProfile(): Promise<PublisherProfile> {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read profile from localStorage', e);
    }
    return DEFAULT_PROFILE;
  },

  async updateProfile(updates: Partial<PublisherProfile>): Promise<PublisherProfile> {
    const current = await this.getProfile();
    const updated: PublisherProfile = {
      ...current,
      ...updates
    };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist profile updates', e);
    }
    return updated;
  },

  async getBusiness(): Promise<PublisherBusiness> {
    try {
      const stored = localStorage.getItem(BUSINESS_KEY);
      if (stored) {
        return { ...DEFAULT_BUSINESS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read business from localStorage', e);
    }
    return DEFAULT_BUSINESS;
  },

  async updateBusiness(updates: Partial<PublisherBusiness>): Promise<PublisherBusiness> {
    const current = await this.getBusiness();
    const updated: PublisherBusiness = {
      ...current,
      ...updates
    };
    try {
      localStorage.setItem(BUSINESS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist business updates', e);
    }
    return updated;
  },

  async getNotificationPreferences(): Promise<PublisherNotificationPreferences> {
    try {
      const stored = localStorage.getItem(NOTIF_PREFS_KEY);
      if (stored) {
        return { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read notification preferences from localStorage', e);
    }
    return DEFAULT_NOTIFICATIONS;
  },

  async updateNotificationPreferences(
    updates: Partial<PublisherNotificationPreferences>
  ): Promise<PublisherNotificationPreferences> {
    const current = await this.getNotificationPreferences();
    const updated: PublisherNotificationPreferences = {
      ...current,
      ...updates,
      accountUpdates: {
        ...current.accountUpdates,
        ...(updates.accountUpdates || {}),
        securityAlerts: true // Essential: always kept true
      }
    };
    try {
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not persist notification preferences', e);
    }
    return updated;
  },

  async getSecurityInfo(): Promise<PublisherSecurityInfo> {
    const profile = await this.getProfile();
    return {
      signInEmail: profile.email,
      authProvider: 'Email & Password',
      passwordLastChanged: '2026-08-25',
      twoStepVerificationAvailable: false,
      twoStepVerificationEnabled: false,
      currentSession: {
        device: 'MacBook Pro',
        browser: 'Google Chrome',
        location: 'London, United Kingdom',
        lastActive: 'Active now'
      }
    };
  },

  async changePassword(current: string, newPass: string): Promise<{ success: boolean; message: string }> {
    // In prototype environment, simulate password verification
    if (!current) {
      return { success: false, message: 'Current password is required.' };
    }
    if (newPass.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters.' };
    }
    // Record timestamp locally
    const sec = await this.getSecurityInfo();
    sec.passwordLastChanged = new Date().toISOString().split('T')[0];
    return { 
      success: true, 
      message: 'Your password has been changed successfully. (Saved in local prototype session)' 
    };
  },

  async getAdvancedInfo(): Promise<PublisherAdvancedInfo> {
    return {
      publisherId: 'pub_acc_9824_uk',
      accountCreatedAt: '10 August 2026',
      defaultPublisherKey: 'pub_live_gamezone_9921a4',
      apiStatus: 'Active (Web Embed v1.0)'
    };
  },

  async requestDataExport(): Promise<{ success: boolean; message: string; requestId: string }> {
    const id = `exp-${Date.now().toString(36)}`;
    return {
      success: true,
      message: 'Your data export request has been registered. An archive of your widget configurations and engagement metrics will be prepared for download.',
      requestId: id
    };
  },

  async requestAccountDeletion(confirmationPhrase: string): Promise<{ success: boolean; message: string }> {
    if (confirmationPhrase !== 'DELETE') {
      return { success: false, message: 'Confirmation phrase did not match "DELETE".' };
    }
    // Clean up local storage items
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(BUSINESS_KEY);
    localStorage.removeItem(NOTIF_PREFS_KEY);
    return {
      success: true,
      message: 'Account deletion request confirmed. Local storage records have been cleared.'
    };
  },

  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }
};
