import { WidgetConfig, WidgetTemplateId, PublisherProperty, WidgetPlacement } from '../types';
import { getTemplateById } from './widgetTemplates';

export function createDefaultWidget(
  templateId: WidgetTemplateId = 'carousel',
  property?: PublisherProperty
): WidgetConfig {
  const template = getTemplateById(templateId);
  const propId = property?.id || 'prop-default';
  const propName = property?.name || 'My Website';
  const domain = property?.domain || 'example.com';

  const defaultName = `${propName} ${template.name}`;

  let placement: WidgetPlacement = template.defaultPlacement;
  let gameCount = template.defaultGameCount;
  let sizePreset: 'compact' | 'standard' | 'large' | 'full_width' | 'custom' = 'full_width';

  if (templateId === 'floating') {
    placement = 'floating_overlay';
    sizePreset = 'compact';
  } else if (templateId === 'featured') {
    placement = 'header';
    sizePreset = 'large';
  } else if (templateId === 'grid') {
    placement = 'in_content';
    sizePreset = 'full_width';
    gameCount = 4;
  } else {
    // carousel
    placement = 'in_content';
    sizePreset = 'full_width';
    gameCount = 4;
  }

  return {
    id: `wdg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: defaultName,
    propertyId: propId,
    propertyName: propName,
    templateId,
    lifecycleStatus: 'draft',
    status: 'draft', // backward compatibility
    installation: {
      status: 'not_started'
    },
    placement,
    targetPageUrl: `https://${domain}`,
    gameSource: 'trending',
    selectedCategory: 'Racing',
    selectedGameIds: ['game-001', 'game-002', 'game-003', 'game-004'],
    gameCount,
    layout: template.layoutMapping,
    behaviour: {
      enableSwipe: true,
      showArrows: true,
      autoplayPreview: true,
      snapToCard: true,
      loop: true,
      ctaAction: 'inline_modal'
    },
    appearance: {
      theme: 'cloud',
      primaryColor: '#2563EB',
      cornerRadius: 16,
      cardSpacing: 12,
      showDochBranding: true,
      sizePreset,
      widthMode: 'responsive_full',
      customWidth: 720,
      customHeight: 0,
      scale: 1
    },
    advanced: {
      lazyLoading: true,
      styleIsolation: true,
      cmpConsentRequired: true
    },
    version: 1,
    publishedVersion: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
    stats: {
      impressions: 0,
      clicks: 0,
      gameStarts: 0,
      ctr: 0
    }
  };
}

export function mapTemplateToWidget(
  existingWidget: WidgetConfig,
  templateId: WidgetTemplateId
): WidgetConfig {
  const template = getTemplateById(templateId);
  return {
    ...existingWidget,
    templateId,
    layout: template.layoutMapping,
    placement: template.defaultPlacement,
    gameCount: template.defaultGameCount,
    updatedAt: new Date().toISOString()
  };
}
