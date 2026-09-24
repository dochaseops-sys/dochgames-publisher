import React from 'react';
import { SettingsSection } from '../../../types/publisherProfile';
import { User, Building2, Bell, Shield, Sliders } from 'lucide-react';

interface SettingsNavigationProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
  hasUnsavedChanges?: boolean;
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeSection,
  onSelectSection,
  hasUnsavedChanges = false
}) => {
  const sections: Array<{
    id: SettingsSection;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Your identity and personal details',
      icon: User
    },
    {
      id: 'business',
      label: 'Publishing business',
      description: 'Organisation, brand and primary site',
      icon: Building2
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alerts, summaries and frequency',
      icon: Bell
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Sign-in method and password',
      icon: Shield
    },
    {
      id: 'advanced',
      label: 'Advanced',
      description: 'Publisher key, export and deletion',
      icon: Sliders
    }
  ];

  return (
    <div>
      {/* Mobile Horizontal Selector / Dropdown */}
      <div className="lg:hidden mb-6">
        <label htmlFor="settings-section-select" className="sr-only">
          Select settings section
        </label>
        <div className="relative">
          <select
            id="settings-section-select"
            value={activeSection}
            onChange={(e) => onSelectSection(e.target.value as SettingsSection)}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 appearance-none pr-10"
          >
            {sections.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Scrollable pill tags on mobile */}
        <div className="flex gap-2 overflow-x-auto py-2.5 mt-2 no-scrollbar">
          {sections.map(s => {
            const isCurrent = activeSection === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSection(s.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Menu */}
      <nav 
        aria-label="Settings navigation" 
        className="hidden lg:block bg-white rounded-3xl p-3 border border-slate-200/90 shadow-sm space-y-1"
      >
        {sections.map(s => {
          const isCurrent = activeSection === s.id;
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSection(s.id)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 group ${
                isCurrent
                  ? 'bg-blue-50/80 text-blue-900 font-bold border border-blue-200/60 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <div 
                className={`p-2 rounded-xl shrink-0 transition-colors ${
                  isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-display leading-tight">{s.label}</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                  {s.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
