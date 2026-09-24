import { WidgetTemplateId, WidgetLayoutType, WidgetPlacement, WidgetConfig } from '../types';

export interface WidgetTemplateDefinition {
  id: WidgetTemplateId;
  name: string;
  tagline: string;
  description: string;
  recommendedFor: string[];
  isRecommended?: boolean;
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
    description: 'Let visitors browse several games in a horizontal row.',
    recommendedFor: ['Article pages', 'Homepages', 'Category pages'],
    isRecommended: true,
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
    description: 'Highlight one game with a large image and a clear play button.',
    recommendedFor: ['Homepage hero areas', 'Campaign landing pages', 'Featured content'],
    isRecommended: false,
    layoutMapping: 'featured_filmstrip',
    defaultPlacement: 'header',
    supportedDevices: 'Desktop & tablet first',
    defaultGameCount: 4
  },
  {
    id: 'grid',
    name: 'Game grid',
    tagline: 'Responsive collection arcade',
    description: 'Create a browsable collection of games in a responsive grid.',
    recommendedFor: ['Dedicated games pages', 'Entertainment sections', 'Content hubs'],
    isRecommended: false,
    layoutMapping: 'compact_grid',
    defaultPlacement: 'in_content',
    supportedDevices: 'Adaptive multi-column',
    defaultGameCount: 4
  },
  {
    id: 'floating',
    name: 'Floating game button',
    tagline: 'Zero layout shift launcher',
    description: 'Add a small launcher without changing your page layout.',
    recommendedFor: ['Blogs', 'News websites', 'Websites with limited content space'],
    isRecommended: false,
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
