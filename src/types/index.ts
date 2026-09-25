export type UserRole = 
  | 'Publisher' 
  | 'Game Developer' 
  | 'DochGames Admin' 
  | 'publisher' 
  | 'developer' 
  | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyOrStudio: string;
  avatar?: string;
  avatarUrl?: string;
  country: string;
  website?: string;
}

export interface PublisherProperty {
  id: string;
  name: string;
  domain: string;
  verified: boolean;
  verificationMethod: 'dns_txt' | 'meta_tag' | 'file_upload' | 'html_snippet';
  verificationToken: string;
  allowedOrigins: string[];
  publisherKey: string;
  createdAt: string;
  totalWidgets: number;
  cmsPlatform?: InstallationPlatform;
}

export interface PublisherKey {
  key: string;
  propertyId: string;
  status: 'active' | 'rotated' | 'revoked';
  createdAt: string;
  lastUsedAt?: string;
}

export type WidgetTemplateId = 
  | 'carousel' 
  | 'featured' 
  | 'grid' 
  | 'floating';

export type WidgetLifecycleStatus = 
  | 'draft' 
  | 'ready_to_install' 
  | 'checking_installation' 
  | 'live' 
  | 'installation_error' 
  | 'paused';

export type InstallationPlatform = 
  | 'wordpress' 
  | 'shopify' 
  | 'webflow' 
  | 'wix' 
  | 'react' 
  | 'other';

export interface WidgetInstallation {
  platform?: InstallationPlatform;
  pageUrl?: string;
  status: 'not_started' | 'awaiting_verification' | 'checking' | 'verified' | 'error';
  lastCheckedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  verifiedAt?: string;
  installedCodeFound?: boolean;
  matchedOrigin?: boolean;
}

export type WidgetLayoutType = 
  | 'horizontal_stacked' 
  | 'vertical_stacked' 
  | 'expandable_slit_reel' 
  | 'overlapping_card_deck' 
  | 'coverflow' 
  | 'featured_filmstrip' 
  | 'sidebar_mini_reel' 
  | 'compact_grid'
  | 'floating_button';

export type WidgetPlacement = 'header' | 'in_content' | 'sidebar' | 'below_content' | 'floating_overlay' | 'custom';

export interface WidgetConfig {
  id: string;
  name: string;
  propertyId: string;
  propertyName: string;
  templateId?: WidgetTemplateId;
  lifecycleStatus?: WidgetLifecycleStatus;
  installation?: WidgetInstallation;
  placement: WidgetPlacement;
  targetPageUrl: string;
  customScreenshotUrl?: string; // Data URL or URL of uploaded site/app screenshot
  customScreenshotName?: string;
  useScreenshotPreview?: boolean;
  screenshotPlacement?: 'header' | 'in_content' | 'sidebar' | 'below_content' | 'floating_overlay';
  gameSource: 'all' | 'category' | 'handpicked' | 'trending';
  selectedCategory?: string;
  selectedGameIds: string[];
  gameCount: number;
  layout: WidgetLayoutType;
  behaviour: {
    enableSwipe: boolean;
    showArrows: boolean;
    autoplayPreview: boolean;
    snapToCard: boolean;
    loop: boolean;
    ctaAction: 'inline_modal' | 'new_tab' | 'branded_hub';
  };
  appearance: {
    theme: 'navy' | 'cloud' | 'custom';
    primaryColor: string;
    cornerRadius: number; // in px
    cardSpacing: number; // in px
    showDochBranding: boolean;
    // Widget Size & Dimension Settings
    sizePreset?: 'compact' | 'standard' | 'large' | 'full_width' | 'custom';
    widthMode?: 'responsive_full' | 'fixed_pixels';
    customWidth?: number; // in px (e.g. 320 to 1400)
    customHeight?: number; // max-height in px (0 or undefined for auto)
    scale?: number; // Density / scale factor: 0.85 to 1.15
  };
  advanced: {
    lazyLoading: boolean;
    styleIsolation: boolean; // Shadow DOM
    cmpConsentRequired: boolean;
    customCss?: string;
  };
  status: 'published' | 'draft' | 'paused';
  version: number;
  publishedVersion?: number;
  createdAt: string;
  updatedAt: string;
  lastSavedAt?: string;
  stats: {
    impressions: number;
    clicks: number;
    gameStarts: number;
    ctr: number;
  };
}

export interface BrandedGameHub {
  id: string;
  propertyId: string;
  name: string;
  subdomain: string; // e.g. "arcadepulse.dochgames.com"
  customDomain?: string; // e.g. "games.arcadepulse.com"
  customDomainVerified: boolean;
  brandName: string;
  logoUrl: string;
  themeColor: string;
  heroHeadline: string;
  heroSubheadline: string;
  categories: string[];
  featuredGameId: string;
  status: 'live' | 'draft' | 'offline';
  createdAt: string;
  stats: {
    monthlyVisitors: number;
    averageSessionMinutes: number;
    totalGameStarts: number;
  };
}

export type GameReviewStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'changes_required' 
  | 'approved' 
  | 'live' 
  | 'rejected' 
  | 'paused';

export interface GameItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  studioId: string;
  studioName: string;
  version: string;
  genre: 'Action' | 'Puzzle' | 'Arcade' | 'Racing' | 'Casual' | 'Strategy' | 'Multiplayer';
  tags: string[];
  supportedLanguages: string[];
  ageRating: 'Everyone 3+' | 'Teen 13+' | 'Mature 17+';
  devices: {
    desktop: boolean;
    mobile: boolean;
    tablet: boolean;
  };
  controls: {
    keyboard: boolean;
    mouse: boolean;
    touch: boolean;
    gamepad: boolean;
  };
  orientation: 'landscape' | 'portrait' | 'any';
  media: {
    thumbnailUrl: string;
    coverArtUrl: string;
    screenshots: string[];
    promoVideoUrl?: string;
  };
  technical: {
    buildUrl?: string;
    buildFileName?: string;
    hostingMode: 'dochgames_cdn' | 'external_iframe';
    launchFile: string;
    httpsEnforced: boolean;
    responsiveCanvas: boolean;
    fullscreenSupported: boolean;
    audioContextSafe: boolean;
    packageSizeMb: number;
  };
  compliance: {
    ownershipConfirmed: boolean;
    privacyDisclosed: boolean;
    containsAds: boolean;
    containsIap: boolean;
  };
  distribution: {
    territories: string;
    eligibleForWidgets: boolean;
    eligibleForHubs: boolean;
  };
  status: GameReviewStatus;
  reviewNotes?: Array<{
    id: string;
    author: string;
    role: string;
    comment: string;
    timestamp: string;
    statusTrigger?: GameReviewStatus;
    statusTag?: string;
  }>;
  submittedAt?: string;
  approvedAt?: string;
  updatedAt: string;
  stats: {
    totalPlays: number;
    impressions: number;
    avgSessionSeconds: number;
    rating: number;
    ratingCount: number;
  };
}

export interface ValidationCheckItem {
  id: string;
  title: string;
  category: 'identity' | 'build' | 'media' | 'technical' | 'compliance';
  status: 'passed' | 'warning' | 'failed' | 'pending';
  message: string;
}

export interface SharedFile {
  id: string;
  name: string;
  category: 'game_build' | 'asset_pack' | 'doc_spec' | 'sdk_package' | 'widget_config';
  size: number;
  uploadedBy: {
    name: string;
    role: UserRole;
    company: string;
  };
  uploadedAt: string;
  mimeType: string;
  dataUrl?: string;
  checksum: string;
  scanStatus: 'verified' | 'scanning' | 'clean';
  downloads: number;
  comments: Array<{
    id: string;
    author: string;
    role: string;
    message: string;
    timestamp: string;
  }>;
  version?: string;
  targetGameOrWidget?: string;
}

export interface ActivityEvent {
  id: string;
  actor: string;
  role: UserRole | 'System';
  action: string;
  details: string;
  timestamp: string;
  target?: string;
}

export type NotificationCategory = 'audit' | 'activity' | 'system' | 'security' | 'revenue' | 'qa';
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'critical';

export interface PlatformNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actor?: {
    name: string;
    role: string;
  };
  auditDetails?: {
    entityType: 'game' | 'property' | 'widget' | 'publisher_key' | 'system_policy';
    entityId?: string;
    entityName?: string;
    action: string;
    ipOrOrigin?: string;
    result: 'success' | 'flagged' | 'blocked' | 'verified';
    checkDetails?: string;
  };
  actionUrl?: string;
  actionLabel?: string;
  actionView?: string;
  metadata?: Record<string, any>;
}

export interface NotificationAlertSettings {
  emailAlertsEnabled: boolean;
  alertEmailAddress: string;
  criticalSystemAudits: {
    enabled: boolean;
    sandboxSecurityEscapes: boolean;
    domainOriginRestrictions: boolean;
    dnsVerificationFailures: boolean;
    severityThreshold: 'critical_only' | 'critical_and_warning' | 'all';
  };
  gameSubmissionStatus: {
    enabled: boolean;
    approvedForSyndication: boolean;
    changesRequiredFeedback: boolean;
    newBuildResubmissions: boolean;
    dispatchMode: 'realtime' | 'hourly_batch';
  };
  inAppSoundEnabled: boolean;
  browserPushEnabled: boolean;
  weeklyDigestEnabled: boolean;
}

export * from './publisherProfile';
export * from './auth';
