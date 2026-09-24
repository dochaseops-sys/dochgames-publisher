import { GameItem, PublisherProperty, WidgetConfig, BrandedGameHub, ActivityEvent, PlatformNotification } from '../types';

export const INITIAL_GAMES: GameItem[] = [
  {
    id: 'game-001',
    title: 'Cyber Neon Racer',
    slug: 'cyber-neon-racer',
    shortDescription: 'High-speed synthwave highway dodge racer with responsive controls and pulsing retro beats.',
    fullDescription: 'Take the wheel of an experimental neon supercar speeding down an endless digital highway. Dodge grid traffic, collect quantum fuel cells, trigger overclock nitro, and climb the global leaderboards.',
    studioId: 'studio-01',
    studioName: 'Velocity Pixel Labs',
    version: '1.4.2',
    genre: 'Racing',
    tags: ['Synthwave', 'Arcade', 'Fast-Paced', 'Retro', 'High Score'],
    supportedLanguages: ['English', 'Spanish', 'Japanese', 'German'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: true, touch: true, gamepad: true },
    orientation: 'landscape',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 14.8
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global (Excl. None)',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'live',
    reviewNotes: [
      {
        id: 'rn-1',
        author: 'DochGames Review Bot',
        role: 'DochGames Admin',
        comment: 'Automated validation passed: HTML5 WebGL canvas resized correctly across 1080p, 768p and 375p widths. Audio unlocked on tap.',
        timestamp: '2026-09-18T10:14:00Z',
        statusTrigger: 'approved'
      }
    ],
    submittedAt: '2026-09-17T14:30:00Z',
    approvedAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-20T08:15:00Z',
    stats: {
      totalPlays: 428190,
      impressions: 1850300,
      avgSessionSeconds: 214,
      rating: 4.8,
      ratingCount: 1940
    }
  },
  {
    id: 'game-002',
    title: 'Galactic Orbit Defense',
    slug: 'galactic-orbit-defense',
    shortDescription: 'Defend your planetary defense core against waves of extraterrestrial cruisers with beam cannons.',
    fullDescription: 'Command an orbital battery station orbiting planetary outposts. Rotate your shield arc, deploy proton flak, trigger EMP shockwaves, and survive escalating waves of alien fighters.',
    studioId: 'studio-02',
    studioName: 'Nebula Arcade Studio',
    version: '2.1.0',
    genre: 'Arcade',
    tags: ['Sci-Fi', 'Space', 'Shooter', 'Action', 'Survival'],
    supportedLanguages: ['English', 'French', 'Korean'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: true, touch: true, gamepad: false },
    orientation: 'any',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 11.2
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'live',
    reviewNotes: [
      {
        id: 'rn-2',
        author: 'DochGames Senior Reviewer',
        role: 'DochGames Admin',
        comment: 'Excellent touch screen responsiveness on mobile slit reels. Approved for distribution.',
        timestamp: '2026-09-12T16:00:00Z',
        statusTrigger: 'approved'
      }
    ],
    submittedAt: '2026-09-11T09:20:00Z',
    approvedAt: '2026-09-12T16:00:00Z',
    updatedAt: '2026-09-19T14:22:00Z',
    stats: {
      totalPlays: 312050,
      impressions: 1420000,
      avgSessionSeconds: 185,
      rating: 4.7,
      ratingCount: 1210
    }
  },
  {
    id: 'game-003',
    title: 'Pixel Gem Cascade',
    slug: 'pixel-gem-cascade',
    shortDescription: 'Mesmerizing match-3 puzzle adventure with cascading combos and relaxing crystal audio.',
    fullDescription: 'Align radiant gemstones to unlock mystic runes, create prismatic elemental bombs, and trigger cascade chain multipliers in this satisfying puzzle classic designed for seamless web play.',
    studioId: 'studio-03',
    studioName: 'MindSpark Games',
    version: '1.0.5',
    genre: 'Puzzle',
    tags: ['Match-3', 'Relaxing', 'Casual', 'Mind Game', 'Family'],
    supportedLanguages: ['English', 'Spanish', 'Portuguese', 'Italian'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: false, mouse: true, touch: true, gamepad: false },
    orientation: 'portrait',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 6.4
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'live',
    reviewNotes: [
      {
        id: 'rn-3',
        author: 'DochGames Review Bot',
        role: 'DochGames Admin',
        comment: 'Memory consumption under 25MB threshold. Optimal for mobile sidebar mini reels.',
        timestamp: '2026-09-05T12:00:00Z',
        statusTrigger: 'approved'
      }
    ],
    submittedAt: '2026-09-04T10:00:00Z',
    approvedAt: '2026-09-05T12:00:00Z',
    updatedAt: '2026-09-15T18:40:00Z',
    stats: {
      totalPlays: 580900,
      impressions: 2190000,
      avgSessionSeconds: 270,
      rating: 4.9,
      ratingCount: 3400
    }
  },
  {
    id: 'game-004',
    title: 'Retro Sky Hopper',
    slug: 'retro-sky-hopper',
    shortDescription: 'Precision one-touch jumping platformer through dynamic clouds and floating clockwork towers.',
    fullDescription: 'Timing is everything. Hop between spinning cog platforms, dodge steam geysers, collect celestial gears, and aim for the infinite sky score in this stylish retro platformer.',
    studioId: 'studio-01',
    studioName: 'Velocity Pixel Labs',
    version: '1.2.0',
    genre: 'Casual',
    tags: ['Platformer', 'One-Touch', 'Endless', 'Retro'],
    supportedLanguages: ['English', 'German', 'Russian'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: true, touch: true, gamepad: false },
    orientation: 'portrait',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 8.1
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'live',
    reviewNotes: [],
    submittedAt: '2026-09-08T11:00:00Z',
    approvedAt: '2026-09-09T14:30:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
    stats: {
      totalPlays: 245000,
      impressions: 980000,
      avgSessionSeconds: 145,
      rating: 4.6,
      ratingCount: 880
    }
  },
  {
    id: 'game-005',
    title: 'Shadow Realm Tactics',
    slug: 'shadow-realm-tactics',
    shortDescription: 'Turn-based tactical dungeon crawler with grid positioning and spell synergetic combos.',
    fullDescription: 'Lead an expedition of four specialized heroes through shifting underworld labyrinths. Plan movement grids, harness elemental weaknesses, and outsmart dark wraiths in tactical turn-based combat.',
    studioId: 'studio-04',
    studioName: 'Iron Sigil Interactive',
    version: '0.9.4',
    genre: 'Strategy',
    tags: ['Turn-Based', 'Tactics', 'RPG', 'Dungeon'],
    supportedLanguages: ['English', 'Spanish'],
    ageRating: 'Teen 13+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: true, touch: true, gamepad: false },
    orientation: 'landscape',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 19.5
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'in_review',
    reviewNotes: [
      {
        id: 'rn-5',
        author: 'DochGames Senior Reviewer',
        role: 'DochGames Admin',
        comment: 'Testing frame performance on mobile WebGL viewports. Loading time is 1.8s (well within threshold). Final QA pass in progress.',
        timestamp: '2026-09-22T09:30:00Z',
        statusTrigger: 'in_review'
      }
    ],
    submittedAt: '2026-09-21T18:00:00Z',
    updatedAt: '2026-09-22T09:30:00Z',
    stats: {
      totalPlays: 0,
      impressions: 0,
      avgSessionSeconds: 0,
      rating: 0,
      ratingCount: 0
    }
  },
  {
    id: 'game-006',
    title: 'Turbo Drift City',
    slug: 'turbo-drift-city',
    shortDescription: 'High-octane city drift challenge with tire smoke physics, nitrous boosts, and score multipliers.',
    fullDescription: 'Hit the asphalt in hyper-tuned Japanese sports cars. Master the handbrake counter-steer, feather the throttle along cliffside hairpin turns, and unlock custom liveries and carbon spoilers.',
    studioId: 'studio-02',
    studioName: 'Nebula Arcade Studio',
    version: '0.8.2',
    genre: 'Racing',
    tags: ['Drift', 'Cars', '3D', 'Physics', 'Score Attack'],
    supportedLanguages: ['English', 'Japanese'],
    ageRating: 'Everyone 3+',
    devices: { desktop: true, mobile: true, tablet: true },
    controls: { keyboard: true, mouse: false, touch: true, gamepad: true },
    orientation: 'landscape',
    media: {
      thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      coverArtUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      ]
    },
    technical: {
      hostingMode: 'dochgames_cdn',
      launchFile: 'index.html',
      httpsEnforced: true,
      responsiveCanvas: true,
      fullscreenSupported: true,
      audioContextSafe: true,
      packageSizeMb: 18.2
    },
    compliance: {
      ownershipConfirmed: true,
      privacyDisclosed: true,
      containsAds: false,
      containsIap: false
    },
    distribution: {
      territories: 'Global',
      eligibleForWidgets: true,
      eligibleForHubs: true
    },
    status: 'changes_required',
    reviewNotes: [
      {
        id: 'rn-6',
        author: 'DochGames Review Bot',
        role: 'DochGames Admin',
        comment: 'Notice: Key art missing 16:9 widescreen asset (1920x1080). Touch drag controls require on-screen steering wheel visualization for mobile users.',
        timestamp: '2026-09-20T14:10:00Z',
        statusTrigger: 'changes_required'
      }
    ],
    submittedAt: '2026-09-19T11:45:00Z',
    updatedAt: '2026-09-20T14:10:00Z',
    stats: {
      totalPlays: 0,
      impressions: 0,
      avgSessionSeconds: 0,
      rating: 0,
      ratingCount: 0
    }
  }
];

export const INITIAL_PROPERTIES: PublisherProperty[] = [
  {
    id: 'prop-01',
    name: 'GameZone Daily Media',
    domain: 'gamezone-daily.com',
    verified: true,
    verificationMethod: 'dns_txt',
    verificationToken: 'doch-verify=gz-d893f12a-8991',
    allowedOrigins: ['https://gamezone-daily.com', 'https://m.gamezone-daily.com'],
    publisherKey: 'pub_live_gz9921_f92ac811',
    createdAt: '2026-07-15T09:00:00Z',
    totalWidgets: 3
  },
  {
    id: 'prop-02',
    name: 'TechPulse Digital News',
    domain: 'techpulse.io',
    verified: true,
    verificationMethod: 'meta_tag',
    verificationToken: 'doch-meta-tp44120x',
    allowedOrigins: ['https://techpulse.io'],
    publisherKey: 'pub_live_tp4412_a82199b0',
    createdAt: '2026-08-01T14:20:00Z',
    totalWidgets: 2
  },
  {
    id: 'prop-03',
    name: 'Arcade Stream Network',
    domain: 'arcadestream.gg',
    verified: true,
    verificationMethod: 'dns_txt',
    verificationToken: 'doch-verify=as-55192-k2',
    allowedOrigins: ['https://arcadestream.gg'],
    publisherKey: 'pub_live_as5519_c11032e4',
    createdAt: '2026-08-20T11:15:00Z',
    totalWidgets: 1
  }
];

export const INITIAL_WIDGETS: WidgetConfig[] = [
  {
    id: 'wdg-01',
    name: 'Homepage Trending Arcade Slit',
    propertyId: 'prop-01',
    propertyName: 'GameZone Daily Media',
    placement: 'header',
    targetPageUrl: 'https://gamezone-daily.com',
    gameSource: 'trending',
    selectedGameIds: ['game-001', 'game-002', 'game-003', 'game-004'],
    gameCount: 4,
    layout: 'expandable_slit_reel',
    behaviour: {
      enableSwipe: true,
      showArrows: true,
      autoplayPreview: true,
      snapToCard: true,
      loop: true,
      ctaAction: 'inline_modal'
    },
    appearance: {
      theme: 'navy',
      primaryColor: '#129BFF',
      cornerRadius: 16,
      cardSpacing: 12,
      showDochBranding: true
    },
    advanced: {
      lazyLoading: true,
      styleIsolation: true,
      cmpConsentRequired: true
    },
    status: 'published',
    version: 3,
    publishedVersion: 3,
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-09-20T16:00:00Z',
    stats: {
      impressions: 482900,
      clicks: 38200,
      gameStarts: 27150,
      ctr: 7.9
    }
  },
  {
    id: 'wdg-02',
    name: 'Article In-Content Coverflow',
    propertyId: 'prop-01',
    propertyName: 'GameZone Daily Media',
    placement: 'in_content',
    targetPageUrl: 'https://gamezone-daily.com/reviews/*',
    gameSource: 'category',
    selectedCategory: 'Racing',
    selectedGameIds: ['game-001', 'game-006'],
    gameCount: 4,
    layout: 'coverflow',
    behaviour: {
      enableSwipe: true,
      showArrows: true,
      autoplayPreview: false,
      snapToCard: true,
      loop: false,
      ctaAction: 'inline_modal'
    },
    appearance: {
      theme: 'cloud',
      primaryColor: '#7B2CF5',
      cornerRadius: 20,
      cardSpacing: 16,
      showDochBranding: true
    },
    advanced: {
      lazyLoading: true,
      styleIsolation: true,
      cmpConsentRequired: false
    },
    status: 'published',
    version: 1,
    publishedVersion: 1,
    createdAt: '2026-08-18T10:30:00Z',
    updatedAt: '2026-08-18T10:30:00Z',
    stats: {
      impressions: 198400,
      clicks: 16400,
      gameStarts: 12380,
      ctr: 8.2
    }
  },
  {
    id: 'wdg-03',
    name: 'TechPulse Sidebar Mini Reel',
    propertyId: 'prop-02',
    propertyName: 'TechPulse Digital News',
    placement: 'sidebar',
    targetPageUrl: 'https://techpulse.io/gaming-hub',
    gameSource: 'handpicked',
    selectedGameIds: ['game-002', 'game-003', 'game-004'],
    gameCount: 3,
    layout: 'sidebar_mini_reel',
    behaviour: {
      enableSwipe: true,
      showArrows: false,
      autoplayPreview: false,
      snapToCard: true,
      loop: true,
      ctaAction: 'inline_modal'
    },
    appearance: {
      theme: 'navy',
      primaryColor: '#11D9FF',
      cornerRadius: 12,
      cardSpacing: 8,
      showDochBranding: true
    },
    advanced: {
      lazyLoading: true,
      styleIsolation: true,
      cmpConsentRequired: true
    },
    status: 'published',
    version: 2,
    publishedVersion: 2,
    createdAt: '2026-08-25T15:00:00Z',
    updatedAt: '2026-09-14T09:20:00Z',
    stats: {
      impressions: 129000,
      clicks: 8900,
      gameStarts: 6420,
      ctr: 6.9
    }
  }
];

export const INITIAL_HUBS: BrandedGameHub[] = [
  {
    id: 'hub-01',
    propertyId: 'prop-01',
    name: 'GameZone Arcade Hub',
    subdomain: 'gamezone.dochgames.com',
    customDomain: 'games.gamezone-daily.com',
    customDomainVerified: true,
    brandName: 'GameZone Arcade',
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
    themeColor: '#129BFF',
    heroHeadline: 'Instant Arcade Fun. No Installs Needed.',
    heroSubheadline: 'Handpicked free-to-play web games powered by DochGames. Play immediately on mobile & desktop.',
    categories: ['Racing', 'Arcade', 'Puzzle', 'Casual', 'Strategy'],
    featuredGameId: 'game-001',
    status: 'live',
    createdAt: '2026-08-12T10:00:00Z',
    stats: {
      monthlyVisitors: 64200,
      averageSessionMinutes: 8.4,
      totalGameStarts: 182400
    }
  }
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-mock-1',
    actor: 'Alex Mercer',
    role: 'Publisher',
    action: 'WIDGET_PUBLISHED',
    details: 'Published "TechPulse Sidebar Mini Reel" on techpulse.io',
    timestamp: '2026-09-22T12:45:00Z',
    target: 'wdg-03'
  },
  {
    id: 'act-mock-2',
    actor: 'Maya Chen',
    role: 'Game Developer',
    action: 'GAME_SUBMITTED',
    details: 'Submitted "Cyber Neon Racer v1.4.2" with updated touch controls',
    timestamp: '2026-09-22T11:20:00Z',
    target: 'game-001'
  },
  {
    id: 'act-mock-3',
    actor: 'Liam Vance',
    role: 'DochGames Admin',
    action: 'GAME_APPROVED',
    details: 'Approved "Voxel Kingdom Defense" for DochGames syndication',
    timestamp: '2026-09-22T09:15:00Z',
    target: 'game-004'
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-pub',
    name: 'Alex Mercer',
    email: 'alex.mercer@gamezone-daily.com',
    role: 'publisher' as const,
    companyOrStudio: 'GameZone Media Group',
    avatar: 'AM',
    country: 'United States',
    website: 'https://gamezone-daily.com'
  },
  {
    id: 'user-dev',
    name: 'Maya Chen',
    email: 'maya@velocitypixel.dev',
    role: 'developer' as const,
    companyOrStudio: 'Velocity Pixel Labs',
    avatar: 'MC',
    country: 'Canada',
    website: 'https://velocitypixel.dev'
  },
  {
    id: 'user-admin',
    name: 'Liam Vance',
    email: 'liam.vance@dochgames.internal',
    role: 'admin' as const,
    companyOrStudio: 'DochGames Operations',
    avatar: 'LV',
    country: 'United Kingdom',
    website: 'https://dochgames.com'
  }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-001',
    category: 'activity',
    severity: 'success',
    title: 'Widget Installed & Live',
    message: 'Your widget "Homepage Trending Arcade Slit" is confirmed on gamezone-daily.com and is now actively serving games.',
    timestamp: '2026-09-24T10:30:00Z',
    read: false,
    actor: {
      name: 'Verification Bot',
      role: 'System'
    },
    actionLabel: 'View Widgets',
    actionView: 'widgets'
  },
  {
    id: 'notif-002',
    category: 'revenue',
    severity: 'success',
    title: 'Monthly Revenue Settled',
    message: 'Your property earned $3,480.20 in publisher syndication rev-share for the previous period (980,000 ad impressions served).',
    timestamp: '2026-09-23T14:10:00Z',
    read: false,
    actor: {
      name: 'Finance & Ledger',
      role: 'DochGames Finance'
    },
    actionLabel: 'View Analytics',
    actionView: 'analytics'
  },
  {
    id: 'notif-003',
    category: 'activity',
    severity: 'info',
    title: '50,000 Plays Milestone Reached',
    message: 'Your widgets passed 50,000 player sessions today across your websites (+215% growth week-over-week).',
    timestamp: '2026-09-22T11:05:00Z',
    read: true,
    actor: {
      name: 'Telemetry Engine',
      role: 'System'
    },
    actionLabel: 'View Performance',
    actionView: 'analytics'
  },
  {
    id: 'notif-004',
    category: 'system',
    severity: 'info',
    title: 'New Games Added to Catalogue',
    message: '3 new instant web games ("Pixel Gem Cascade", "Galactic Orbit Defense", and "Neon Drifter") are now available for your widgets.',
    timestamp: '2026-09-21T09:00:00Z',
    read: true,
    actor: {
      name: 'Game Curation Team',
      role: 'DochGames Games'
    },
    actionLabel: 'Customise Widgets',
    actionView: 'widgets'
  },
  {
    id: 'notif-005',
    category: 'activity',
    severity: 'success',
    title: 'Website Connected',
    message: 'Domain "gamezone-daily.com" was successfully connected and verified with your publisher key.',
    timestamp: '2026-09-20T16:20:00Z',
    read: true,
    actor: {
      name: 'Domain Registrar Bot',
      role: 'System'
    },
    actionLabel: 'Manage Websites',
    actionView: 'websites'
  }
];

// Export aliases
export const mockGames = INITIAL_GAMES;
export const mockProperties = INITIAL_PROPERTIES;
export const mockWidgets = INITIAL_WIDGETS;
export const mockHubs = INITIAL_HUBS;
export const mockActivities = INITIAL_ACTIVITIES;
export const mockNotifications = INITIAL_NOTIFICATIONS;
export const initialUsers = INITIAL_USERS;
