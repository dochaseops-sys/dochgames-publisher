import React, { useState, useEffect } from 'react';
import { PublisherNotificationPreferences } from '../../../types/publisherProfile';
import { 
  Bell, Mail, Globe, Shield, Sparkles, Check, 
  RotateCcw, Save, AlertCircle, Info, Zap 
} from 'lucide-react';

interface NotificationPreferencesFormProps {
  initialPreferences: PublisherNotificationPreferences;
  onSave: (updated: Partial<PublisherNotificationPreferences>) => Promise<void>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const NotificationPreferencesForm: React.FC<NotificationPreferencesFormProps> = ({
  initialPreferences,
  onSave,
  onDirtyChange
}) => {
  const [prefs, setPrefs] = useState<PublisherNotificationPreferences>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [browserPermissionState, setBrowserPermissionState] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Check dirty state
  const isDirty = JSON.stringify(prefs) !== JSON.stringify(initialPreferences);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleReset = () => {
    setPrefs(initialPreferences);
  };

  const handleRequestBrowserPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported in your current browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserPermissionState(permission);
      if (permission === 'granted') {
        setPrefs((prev) => ({
          ...prev,
          channels: {
            ...prev.channels,
            browserNotifications: true
          }
        }));
      } else {
        setPrefs((prev) => ({
          ...prev,
          channels: {
            ...prev.channels,
            browserNotifications: false
          }
        }));
      }
    } catch (e) {
      console.warn('Could not request notification permission', e);
    }
  };

  const handleToggleChannel = (channel: keyof typeof prefs.channels) => {
    if (channel === 'browserNotifications') {
      if (!prefs.channels.browserNotifications) {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
          handleRequestBrowserPermission();
          return;
        }
      }
    }

    setPrefs((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessBanner(null);

    try {
      // Ensure security alerts is always preserved as true
      const toSave = {
        ...prefs,
        accountUpdates: {
          ...prefs.accountUpdates,
          securityAlerts: true
        }
      };
      await onSave(toSave);
      setSuccessBanner('Your notification preferences have been updated.');
      setTimeout(() => setSuccessBanner(null), 4000);
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-black text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose what notifications you receive and how they are delivered.
            </p>
          </div>
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-medium">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>{successBanner}</span>
        </div>
      )}

      {/* SECTION 1: DELIVERY CHANNELS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Zap className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Delivery Channels
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Email Channel */}
          <div 
            onClick={() => handleToggleChannel('email')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.email 
                ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={prefs.channels.email}
                onChange={() => {}} // Controlled by card click
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer pointer-events-none"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Email alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Sent directly to your verified contact email.
              </div>
            </div>
          </div>

          {/* In-App Notification Center */}
          <div 
            onClick={() => handleToggleChannel('inApp')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.inApp 
                ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={prefs.channels.inApp}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer pointer-events-none"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">In-app bell drawer</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Quick updates in your platform top navigation bar.
              </div>
            </div>
          </div>

          {/* Browser Push Notifications */}
          <div 
            onClick={() => handleToggleChannel('browserNotifications')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              prefs.channels.browserNotifications 
                ? 'bg-blue-50/50 border-blue-200 shadow-xs' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={prefs.channels.browserNotifications}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer pointer-events-none"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Browser alerts</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {browserPermissionState === 'denied' 
                  ? 'Permission blocked in browser settings.'
                  : 'Desktop popups when critical events occur.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FREQUENCY */}
      <div className="pt-2 border-t border-slate-100 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Delivery Frequency
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'immediately', label: 'Real-time', desc: 'As soon as events occur' },
            { id: 'daily_summary', label: 'Daily summary', desc: 'Once a day recap (recommended)' },
            { id: 'weekly_summary', label: 'Weekly summary', desc: 'Condensed digest every Monday' }
          ].map((freq) => {
            const isSelected = prefs.frequency === freq.id;
            return (
              <label
                key={freq.id}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#D6F938]/20 border-[#D6F938] ring-1 ring-[#D6F938] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="notification-frequency"
                  value={freq.id}
                  checked={isSelected}
                  onChange={() => setPrefs((prev) => ({ ...prev, frequency: freq.id as any }))}
                  className="mt-1 text-slate-900 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{freq.label}</div>
                  <div className="text-[11px] text-slate-500">{freq.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: WIDGET & WEBSITE ALERTS */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Widget & Website Alerts
          </h4>
        </div>

        <div className="space-y-2.5">
          {[
            {
              key: 'installationCompleted',
              title: 'Widget installation completed',
              desc: 'Confirm when a widget is successfully detected and verified on your site.'
            },
            {
              key: 'installationProblem',
              title: 'Widget installation issues',
              desc: 'Alert if widget code cannot load or script encounters an error.'
            },
            {
              key: 'widgetPausedOrStopped',
              title: 'Widget paused or suspended',
              desc: 'Notify when a widget is deactivated or stops receiving traffic.'
            },
            {
              key: 'websiteVerificationCompleted',
              title: 'Website domain verified',
              desc: 'Confirmation when a new domain ownership check completes.'
            },
            {
              key: 'websiteVerificationFailed',
              title: 'Website domain verification failed',
              desc: 'Guidance if domain DNS or meta-tag check cannot be confirmed.'
            }
          ].map((item) => {
            const checked = (prefs.widgetAlerts as any)[item.key];
            return (
              <label
                key={item.key}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setPrefs((prev) => ({
                      ...prev,
                      widgetAlerts: {
                        ...prev.widgetAlerts,
                        [item.key]: e.target.checked
                      }
                    }));
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: PERFORMANCE & REVENUE UPDATES */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Performance & Growth Updates
          </h4>
        </div>

        <div className="space-y-2.5">
          {[
            {
              key: 'weeklySummary',
              title: 'Weekly performance digest',
              desc: 'Overview of total gameplay minutes, active players, and popular games.'
            },
            {
              key: 'monthlyReport',
              title: 'Monthly executive report',
              desc: 'Month-on-month growth metrics, engagement benchmarks, and trends.'
            },
            {
              key: 'surgeInGameStarts',
              title: 'Traffic & gameplay spikes',
              desc: 'Real-time heads-up when your widget experiences unusually high game sessions.'
            },
            {
              key: 'optimisationRecommendations',
              title: 'Widget optimisation recommendations',
              desc: 'Tailored advice to improve click-through rates and game completion times.'
            }
          ].map((item) => {
            const checked = (prefs.performanceUpdates as any)[item.key];
            return (
              <label
                key={item.key}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setPrefs((prev) => ({
                      ...prev,
                      performanceUpdates: {
                        ...prev.performanceUpdates,
                        [item.key]: e.target.checked
                      }
                    }));
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: PLATFORM & ACCOUNT UPDATES */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Platform & Security Updates
          </h4>
        </div>

        <div className="space-y-2.5">
          {/* Security alerts (mandatory) */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <input
              type="checkbox"
              checked={true}
              disabled
              className="mt-1 w-4 h-4 text-slate-400 rounded-sm cursor-not-allowed"
            />
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Critical security alerts</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Required
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Sign-in notices, password resets, and critical account security events cannot be turned off.
              </div>
            </div>
          </div>

          {[
            {
              key: 'importantAccountUpdates',
              title: 'Platform service updates',
              desc: 'Planned maintenance windows and publisher agreement updates.'
            },
            {
              key: 'newFeatures',
              title: 'New games & features',
              desc: 'First look at newly syndicating game titles and widget layout enhancements.'
            },
            {
              key: 'productTips',
              title: 'Product tips & best practices',
              desc: 'Tutorials and placement guides for publisher websites.'
            }
          ].map((item) => {
            const checked = (prefs.accountUpdates as any)[item.key];
            return (
              <label
                key={item.key}
                className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setPrefs((prev) => ({
                      ...prev,
                      accountUpdates: {
                        ...prev.accountUpdates,
                        [item.key]: e.target.checked
                      }
                    }));
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 order-2 sm:order-1">
          {isDirty ? 'Remember to save your preferences.' : 'Preferences are saved.'}
        </p>
        <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs ${
              isDirty && !isSaving
                ? 'bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 shadow-sm active:scale-98 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isSaving ? 'Saving…' : 'Save preferences'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
