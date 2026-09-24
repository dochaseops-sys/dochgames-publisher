export type PublisherBusinessType =
  | 'News publisher'
  | 'Blog or online magazine'
  | 'Gaming website'
  | 'Entertainment platform'
  | 'Community website'
  | 'Media network'
  | 'Mobile application'
  | 'Other';

export interface PublisherProfile {
  id: string;
  fullName: string;
  displayName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  avatarUrl?: string;
  country: string;
  timezone: string;
  preferredLanguage: string;
  role: 'Publisher';
  status: 'Active' | 'Pending verification' | 'Suspended';
  createdAt: string;
}

export interface PublisherBusiness {
  id: string;
  name: string;
  type: PublisherBusinessType;
  otherTypeDescription?: string;
  primaryWebsiteId?: string;
  primaryWebsiteDomain?: string;
  country: string;
  address?: string;
  contactEmail: string;
  contactPhone?: string;
  description?: string;
  logoUrl?: string;
}

export interface NotificationChannelSettings {
  email: boolean;
  inApp: boolean;
  browserNotifications: boolean;
}

export interface PublisherNotificationPreferences {
  widgetAlerts: {
    installationCompleted: boolean;
    installationProblem: boolean;
    widgetPausedOrStopped: boolean;
    websiteVerificationCompleted: boolean;
    websiteVerificationFailed: boolean;
  };
  performanceUpdates: {
    weeklySummary: boolean;
    monthlyReport: boolean;
    surgeInGameStarts: boolean;
    optimisationRecommendations: boolean;
  };
  accountUpdates: {
    importantAccountUpdates: boolean;
    securityAlerts: boolean; // essential, always true
    newFeatures: boolean;
    productTips: boolean;
  };
  channels: NotificationChannelSettings;
  frequency: 'immediately' | 'daily_summary' | 'weekly_summary';
}

export interface PublisherSecurityInfo {
  signInEmail: string;
  authProvider: 'Email & Password' | 'Google' | 'SSO';
  passwordLastChanged: string;
  twoStepVerificationAvailable: boolean;
  twoStepVerificationEnabled: boolean;
  currentSession: {
    device: string;
    browser: string;
    location: string;
    lastActive: string;
  };
}

export interface PublisherAdvancedInfo {
  publisherId: string;
  accountCreatedAt: string;
  defaultPublisherKey: string;
  apiStatus: string;
}

export type SettingsSection = 
  | 'profile' 
  | 'business' 
  | 'notifications' 
  | 'security' 
  | 'advanced';
