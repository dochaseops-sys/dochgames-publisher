import React, { useState } from 'react';
import { PublisherProperty, InstallationPlatform } from '../../../types';
import { 
  addWebsite, deleteWebsite, normalizeDomain, rotatePublisherKey 
} from '../../../services/websites';
import { 
  Plus, Globe, CheckCircle2, ShieldCheck, Key, Copy, 
  Check, Trash2, ExternalLink, HelpCircle, AlertCircle 
} from 'lucide-react';

interface WebsitesPageProps {
  websites: PublisherProperty[];
  onRefresh: () => void;
  onCreateWidgetForWebsite: (propertyId: string) => void;
  onViewWidgetsForWebsite: (propertyId: string) => void;
}

export const WebsitesPage: React.FC<WebsitesPageProps> = ({
  websites,
  onRefresh,
  onCreateWidgetForWebsite,
  onViewWidgetsForWebsite
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [websiteName, setWebsiteName] = useState<string>('');
  const [websiteDomain, setWebsiteDomain] = useState<string>('');
  const [platform, setPlatform] = useState<InstallationPlatform>('wordpress');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteDomain.trim()) return;

    const normalized = normalizeDomain(websiteDomain);
    const finalName = websiteName.trim() || normalized;

    addWebsite(finalName, normalized, platform);
    setWebsiteName('');
    setWebsiteDomain('');
    setShowAddModal(false);
    onRefresh();
  };

  const handleCopyKey = async (id: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this website? Associated widgets may stop serving games.')) {
      deleteWebsite(id);
      onRefresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            Connected Websites
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your domains and unique publisher keys for embed scripts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-2xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Connect website</span>
        </button>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map(site => {
          const isKeyRevealed = revealedKeyId === site.id;
          const displayKey = isKeyRevealed
            ? site.publisherKey
            : `${site.publisherKey.slice(0, 12)}••••••••••••••••`;

          return (
            <div
              key={site.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified domain
                  </span>
                </div>

                {/* Website Info */}
                <h3 className="text-lg font-bold font-display text-slate-900 leading-snug">
                  {site.name}
                </h3>
                <a
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>{site.domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Publisher Key section */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-slate-500" />
                      Publisher Key
                    </span>
                    <button
                      type="button"
                      onClick={() => setRevealedKeyId(isKeyRevealed ? null : site.id)}
                      className="text-blue-600 hover:text-blue-700 text-[10px]"
                    >
                      {isKeyRevealed ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between font-mono text-xs text-slate-800">
                    <span className="truncate mr-2">{displayKey}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyKey(site.id, site.publisherKey)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Copy Key"
                    >
                      {copiedKeyId === site.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  Total widgets: <span className="font-bold text-slate-800">{site.totalWidgets}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => onCreateWidgetForWebsite(site.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D6F938] hover:bg-[#cbf028] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Create widget for this site</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => onViewWidgetsForWebsite(site.id)}
                    className="hover:text-blue-600 font-medium"
                  >
                    View widgets →
                  </button>

                  {websites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(site.id)}
                      className="hover:text-rose-600 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Website Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Connect a website
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="e.g. Arcade Pulse Daily"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Domain / URL
                </label>
                <input
                  type="text"
                  required
                  value={websiteDomain}
                  onChange={(e) => setWebsiteDomain(e.target.value)}
                  placeholder="e.g. arcadepulse.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Enter your main domain. Protocol (https://) will be formatted automatically.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as InstallationPlatform)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
                >
                  <option value="wordpress">WordPress</option>
                  <option value="shopify">Shopify</option>
                  <option value="webflow">Webflow</option>
                  <option value="wix">Wix</option>
                  <option value="react">React / Next.js</option>
                  <option value="other">Other / Custom HTML</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
