import { PublisherProperty, InstallationPlatform } from '../types';
import { mockProperties } from '../data/mockData';

const WEBSITES_STORAGE_KEY = 'dochgames_websites_v2';

export function normalizeDomain(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().toLowerCase();
  
  // Remove protocol
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  
  // Remove trailing slashes and paths
  const slashIndex = cleaned.indexOf('/');
  if (slashIndex !== -1) {
    cleaned = cleaned.substring(0, slashIndex);
  }
  
  // Remove port if present
  const colonIndex = cleaned.indexOf(':');
  if (colonIndex !== -1) {
    cleaned = cleaned.substring(0, colonIndex);
  }

  // Remove leading www.
  cleaned = cleaned.replace(/^www\./i, '');

  return cleaned;
}

export function generateVerificationToken(domain: string): string {
  const clean = normalizeDomain(domain);
  const hash = Math.random().toString(36).substring(2, 10);
  return `dochgames-site-verification-${clean}-${hash}`;
}

export function generatePublisherKey(domain: string): string {
  const clean = normalizeDomain(domain).replace(/[^a-z0-9]/g, '_').substring(0, 12);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `pub_live_${clean}_${randomSuffix}`;
}

export function getWebsites(): PublisherProperty[] {
  try {
    const stored = localStorage.getItem(WEBSITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read websites from localStorage, using defaults.', e);
  }
  return mockProperties;
}

export function saveWebsites(websites: PublisherProperty[]): void {
  try {
    localStorage.setItem(WEBSITES_STORAGE_KEY, JSON.stringify(websites));
  } catch (e) {
    console.warn('Could not persist websites to localStorage.', e);
  }
}

export function getPropertyById(id: string): PublisherProperty | undefined {
  const websites = getWebsites();
  return websites.find(w => w.id === id);
}

export function addWebsite(
  name: string,
  rawDomain: string,
  cmsPlatform?: InstallationPlatform
): PublisherProperty {
  const domain = normalizeDomain(rawDomain);
  const websites = getWebsites();

  const newWebsite: PublisherProperty = {
    id: `prop-${Date.now().toString(36)}`,
    name: name.trim() || domain,
    domain,
    verified: true, // In prototype mode, auto-verify upon guided flow completion
    verificationMethod: 'html_snippet',
    verificationToken: generateVerificationToken(domain),
    allowedOrigins: [`https://${domain}`, `https://*.${domain}`],
    publisherKey: generatePublisherKey(domain),
    createdAt: new Date().toISOString(),
    totalWidgets: 0,
    cmsPlatform
  };

  const updated = [newWebsite, ...websites];
  saveWebsites(updated);
  return newWebsite;
}

export function deleteWebsite(id: string): void {
  const websites = getWebsites();
  const updated = websites.filter(w => w.id !== id);
  saveWebsites(updated);
}

export function rotatePublisherKey(id: string): string | undefined {
  const websites = getWebsites();
  let newKey: string | undefined;

  const updated = websites.map(w => {
    if (w.id === id) {
      newKey = generatePublisherKey(w.domain);
      return { ...w, publisherKey: newKey };
    }
    return w;
  });

  if (newKey) {
    saveWebsites(updated);
  }
  return newKey;
}

export const websiteService = {
  getWebsites,
  saveWebsites,
  getPropertyById,
  addWebsite,
  deleteWebsite,
  removeWebsite: deleteWebsite,
  rotatePublisherKey
};
