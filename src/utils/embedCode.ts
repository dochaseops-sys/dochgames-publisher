import { WidgetConfig, PublisherProperty, InstallationPlatform } from '../types';

export const CDN_LOADER_URL = 'https://cdn.dochgames.com/v1/widget.js';

export function getWidgetContainerId(widgetId: string): string {
  const safeId = widgetId ? widgetId.replace(/[^a-zA-Z0-9_-]/g, '-') : 'default';
  return `doch-widget-${safeId}`;
}

export function generateEmbedCode(params: {
  widgetId: string;
  publisherKey?: string;
  layout?: string;
  platform?: InstallationPlatform;
}): string {
  const { widgetId, publisherKey = 'pub_live_demo', layout = 'expandable_slit_reel', platform = 'other' } = params;
  const containerId = getWidgetContainerId(widgetId);

  if (platform === 'react') {
    return `// DochGamesWidget.tsx
'use client'; // Required if using Next.js App Router

import React, { useEffect } from 'react';

export function DochGamesWidget({ className = '' }: { className?: string }) {
  useEffect(() => {
    const existing = document.querySelector('script[src="${CDN_LOADER_URL}"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = '${CDN_LOADER_URL}';
      script.async = true;
      script.setAttribute('data-publisher-key', '${publisherKey}');
      script.setAttribute('data-widget-id', '${widgetId}');
      script.setAttribute('data-layout', '${layout}');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      id="${containerId}" 
      className={\`doch-widget-container \${className}\`}
      style={{ minHeight: '220px', width: '100%' }}
    />
  );
}

export default DochGamesWidget;`;
  }

  if (platform === 'shopify') {
    return `<!-- DochGames Custom Liquid Section -->
<div class="dochgames-shopify-section" style="margin: 2rem 0; width: 100%;">
  <div id="${containerId}"></div>
</div>
<script 
  async 
  src="${CDN_LOADER_URL}" 
  data-publisher-key="${publisherKey}"
  data-widget-id="${widgetId}"
  data-layout="${layout}">
</script>`;
  }

  return `<!-- DochGames Widget Container -->
<div id="${containerId}"></div>

<!-- DochGames Script Loader -->
<script 
  async 
  src="${CDN_LOADER_URL}" 
  data-publisher-key="${publisherKey}"
  data-widget-id="${widgetId}"
  data-layout="${layout}">
</script>`;
}

export function generateDeveloperEmailBody(params: {
  widgetName: string;
  domain: string;
  embedCode: string;
}): string {
  const { widgetName, domain, embedCode } = params;
  return `Hi team,

Please install the DochGames widget "${widgetName}" on ${domain}.

INSTALLATION INSTRUCTIONS:
1. Copy the embed code snippet below.
2. Paste it into the page template or CMS HTML block where the game widget should appear.
3. Publish the page.

CODE SNIPPET:
${embedCode}

Technical notes:
- The script is lightweight (~12KB) and loads asynchronously.
- Game runtimes are lazy-loaded only when a visitor launches a game.
- No cookies or tracking tags are used.

Thank you!`;
}

export function getStandardScriptSnippet(widget: WidgetConfig, property?: PublisherProperty): string {
  return generateEmbedCode({
    widgetId: widget.id,
    publisherKey: property?.publisherKey,
    layout: widget.layout,
    platform: 'other'
  });
}

export function getIframeSnippet(widget: WidgetConfig, property?: PublisherProperty): string {
  const publisherKey = property?.publisherKey || 'pub_live_demo';
  const iframeSrc = `https://embed.dochgames.com/w/${widget.id}?key=${publisherKey}&theme=${widget.appearance.theme || 'cloud'}`;
  const height = widget.layout === 'sidebar_mini_reel' ? '560' : '260';
  const cornerRadius = widget.appearance.cornerRadius ?? 16;

  return `<!-- DochGames Sandboxed iFrame -->
<iframe 
  src="${iframeSrc}" 
  width="100%" 
  height="${height}" 
  frameborder="0" 
  scrolling="no" 
  allow="fullscreen; autoplay" 
  sandbox="allow-scripts allow-same-origin allow-popups" 
  style="border: none; overflow: hidden; border-radius: ${cornerRadius}px; width: 100%; display: block;" 
  title="${widget.name || 'Game Experience'}">
</iframe>`;
}

export function getEmbedCodeForPlatform(
  platform: InstallationPlatform,
  widget: WidgetConfig,
  property?: PublisherProperty
): string {
  return generateEmbedCode({
    widgetId: widget.id,
    publisherKey: property?.publisherKey,
    layout: widget.layout,
    platform
  });
}
