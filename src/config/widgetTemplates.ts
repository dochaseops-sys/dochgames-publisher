import { WidgetTemplateId, WidgetLayoutType, WidgetPlacement } from '../types';

export interface WidgetTemplateDefinition {
  id: WidgetTemplateId;
  name: string;
  tagline: string;
  description: string;
  recommended: boolean;
  isRecommended: boolean;
  bestFor: string;
  recommendedFor: string[];
  features: string[];
  layoutMapping: WidgetLayoutType;
  defaultPlacement: WidgetPlacement;
  supportedDevices: string;
  defaultGameCount: number;
  badgeText?: string;
}

export const WIDGET_TEMPLATES: WidgetTemplateDefinition[] = [
  {
    id: 'carousel',
    name: 'Game carousel',
    tagline: 'Horizontal interactive reel',
    description: 'Let visitors browse several games in a horizontal scrolling row. Perfect for article tops and editorial headers.',
    recommended: true,
    isRecommended: true,
    bestFor: 'Article tops & editorial headers',
    recommendedFor: ['Article pages', 'Homepages', 'Category pages'],
    features: [
      'High click-through rate with swipe support',
      'Smooth card animations & live preview',
      'Lightweight responsive reel layout'
    ],
    layoutMapping: 'expandable_slit_reel',
    defaultPlacement: 'in_content',
    supportedDevices: 'Desktop & mobile optimised',
    defaultGameCount: 4,
    badgeText: 'Recommended'
  },
  {
    id: 'featured',
    name: 'Featured game',
    tagline: 'Spotlight hero display',
    description: 'Highlight one headline marquee game with large artwork and instant play button, accompanied by side thumbnails.',
    recommended: false,
    isRecommended: false,
    bestFor: 'Homepage hero areas & landing pages',
    recommendedFor: ['Homepage hero areas', 'Campaign landing pages', 'Featured content'],
    features: [
      'Maximum visual prominence for headline titles',
      'High conversion instant play launcher',
      'Curated marquee experience'
    ],
    layoutMapping: 'featured_filmstrip',
    defaultPlacement: 'header',
    supportedDevices: 'Desktop & tablet first',
    defaultGameCount: 4
  },
  {
    id: 'grid',
    name: 'Game grid',
    tagline: 'Responsive collection arcade',
    description: 'Create a browsable collection of games in a clean responsive grid. Ideal for gaming sections and footer arcade zones.',
    recommended: false,
    isRecommended: false,
    bestFor: 'Dedicated games pages & arcade hubs',
    recommendedFor: ['Dedicated games pages', 'Entertainment sections', 'Content hubs'],
    features: [
      'Displays 4 to 8 games simultaneously',
      'Adaptive multi-column responsive layout',
      'Genre badges and user ratings display'
    ],
    layoutMapping: 'compact_grid',
    defaultPlacement: 'in_content',
    supportedDevices: 'Adaptive multi-column',
    defaultGameCount: 4
  },
  {
    id: 'floating',
    name: 'Floating game button',
    tagline: 'Zero layout shift launcher',
    description: 'Add a discreet game launcher button at the corner of your screen without altering your existing article or website layout.',
    recommended: false,
    isRecommended: false,
    bestFor: 'Blogs & layout-sensitive websites',
    recommendedFor: ['Blogs', 'News websites', 'Websites with limited content space'],
    features: [
      'Zero layout shift (CLS safe)',
      'Floats neatly at screen corner',
      'Expands into a quick-play game popover'
    ],
    layoutMapping: 'floating_button',
    defaultPlacement: 'floating_overlay',
    supportedDevices: 'Universal floating bubble',
    defaultGameCount: 4,
    badgeText: 'Zero layout shift'
  }
];

export function getTemplateById(id?: string): WidgetTemplateDefinition {
  const found = WIDGET_TEMPLATES.find(t => t.id === id);
  return found || WIDGET_TEMPLATES[0];
}
