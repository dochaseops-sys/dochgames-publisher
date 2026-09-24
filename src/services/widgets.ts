import { WidgetConfig, WidgetTemplateId, WidgetLifecycleStatus, WidgetInstallation, PublisherProperty } from '../types';
import { mockWidgets } from '../data/mockData';
import { createDefaultWidget } from '../config/widgetDefaults';
import { getPropertyById, getWebsites } from './websites';

const STORAGE_KEY = 'dochgames_widgets';

// Helper to normalize older widgets to the new lifecycle model
function normalizeWidget(widget: any): WidgetConfig {
  let templateId: WidgetTemplateId = widget.templateId;
  if (!templateId) {
    if (widget.layout === 'expandable_slit_reel' || widget.layout === 'horizontal_stacked') {
      templateId = 'carousel';
    } else if (widget.layout === 'featured_filmstrip' || widget.layout === 'coverflow') {
      templateId = 'featured';
    } else if (widget.layout === 'floating_button') {
      templateId = 'floating';
    } else {
      templateId = 'grid';
    }
  }

  let lifecycleStatus: WidgetLifecycleStatus = widget.lifecycleStatus;
  if (!lifecycleStatus) {
    if (widget.status === 'published') {
      lifecycleStatus = 'live';
    } else if (widget.status === 'paused') {
      lifecycleStatus = 'paused';
    } else {
      lifecycleStatus = 'draft';
    }
  }

  const installation: WidgetInstallation = widget.installation || {
    status: lifecycleStatus === 'live' ? 'verified' : 'not_started',
    verifiedAt: lifecycleStatus === 'live' ? widget.updatedAt : undefined
  };

  return {
    ...widget,
    templateId,
    lifecycleStatus,
    installation,
    lastSavedAt: widget.lastSavedAt || widget.updatedAt || new Date().toISOString()
  };
}

export function getWidgets(): WidgetConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial mock widgets normalized
      const normalized = mockWidgets.map(normalizeWidget);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeWidget);
    }
    return mockWidgets.map(normalizeWidget);
  } catch (e) {
    console.error('Error reading widgets from localStorage', e);
    return mockWidgets.map(normalizeWidget);
  }
}

export function getWidgetById(id: string): WidgetConfig | undefined {
  const all = getWidgets();
  return all.find(w => w.id === id);
}

export function saveWidget(widget: WidgetConfig): WidgetConfig {
  const all = getWidgets();
  const index = all.findIndex(w => w.id === widget.id);
  
  const updatedWidget: WidgetConfig = {
    ...widget,
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString()
  };

  let updatedList: WidgetConfig[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = updatedWidget;
  } else {
    updatedList = [updatedWidget, ...all];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Error saving widget', e);
  }

  return updatedWidget;
}

export function createNewWidgetDraft(
  templateId: WidgetTemplateId = 'carousel',
  propertyId?: string
): WidgetConfig {
  const websites = getWebsites();
  const property = propertyId 
    ? getPropertyById(propertyId) 
    : (websites[0] || undefined);

  const newWidget = createDefaultWidget(templateId, property);
  return saveWidget(newWidget);
}

export function updateWidgetLifecycle(
  id: string,
  lifecycleStatus: WidgetLifecycleStatus,
  installationUpdate?: Partial<WidgetInstallation>
): WidgetConfig | undefined {
  const widget = getWidgetById(id);
  if (!widget) return undefined;

  const currentInstallation = widget.installation || { status: 'not_started' };
  const updatedInstallation: WidgetInstallation = {
    ...currentInstallation,
    ...(installationUpdate || {})
  };

  // Keep legacy status field in sync for backwards compatibility
  let legacyStatus: 'published' | 'draft' | 'paused' = 'draft';
  if (lifecycleStatus === 'live') {
    legacyStatus = 'published';
  } else if (lifecycleStatus === 'paused') {
    legacyStatus = 'paused';
  }

  const updated: WidgetConfig = {
    ...widget,
    lifecycleStatus,
    status: legacyStatus,
    installation: updatedInstallation,
    updatedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString()
  };

  return saveWidget(updated);
}

export function duplicateWidget(id: string): WidgetConfig | undefined {
  const original = getWidgetById(id);
  if (!original) return undefined;

  const duplicate: WidgetConfig = {
    ...original,
    id: `wdg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: `${original.name} (Copy)`,
    lifecycleStatus: 'draft',
    status: 'draft',
    installation: {
      status: 'not_started'
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

  return saveWidget(duplicate);
}

export function deleteWidget(id: string): boolean {
  const all = getWidgets();
  const filtered = all.filter(w => w.id !== id);
  if (filtered.length === all.length) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting widget', e);
    return false;
  }
}

export function pauseWidget(id: string): WidgetConfig | undefined {
  return updateWidgetLifecycle(id, 'paused');
}

export function resumeWidget(id: string): WidgetConfig | undefined {
  const widget = getWidgetById(id);
  if (!widget) return undefined;
  
  // If it was previously verified, resume to live, else ready_to_install
  const targetStatus: WidgetLifecycleStatus = 
    widget.installation?.status === 'verified' ? 'live' : 'ready_to_install';
  
  return updateWidgetLifecycle(id, targetStatus);
}
