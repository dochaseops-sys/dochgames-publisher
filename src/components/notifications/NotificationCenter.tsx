import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, Shield, Activity, Sparkles, Check, CheckCheck, 
  Trash2, X, Search, Filter, AlertTriangle, CheckCircle2, 
  Info, DollarSign, ExternalLink, RefreshCw, Cpu, Globe,
  Terminal, ArrowRight, Eye, Settings, Mail, Send, Volume2, 
  VolumeX, Sliders, CheckCircle, ShieldAlert, Gamepad2, Lock,
  Clock, ArrowLeft, Radio
} from 'lucide-react';
import { PlatformNotification, NotificationCategory, UserProfile, NotificationAlertSettings } from '../../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PlatformNotification[];
  currentUser?: UserProfile;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigate: (view: string) => void;
  onTriggerSampleAudit?: () => void;
}

const STORAGE_KEY = 'dochgames_alert_settings_v1';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUser,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onNavigate,
  onTriggerSampleAudit
}) => {
  const [viewMode, setViewMode] = useState<'stream' | 'settings'>('stream');
  const [activeTab, setActiveTab] = useState<'all' | 'audit' | 'activity' | 'system'>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveBanner, setSaveBanner] = useState<boolean>(false);
  const [testEmailStatus, setTestEmailStatus] = useState<{
    status: 'idle' | 'sending' | 'success';
    message?: string;
  }>({ status: 'idle' });

  // Default alert settings
  const defaultSettings: NotificationAlertSettings = useMemo(() => ({
    emailAlertsEnabled: true,
    alertEmailAddress: currentUser?.email || 'dochaseng@gmail.com',
    criticalSystemAudits: {
      enabled: true,
      sandboxSecurityEscapes: true,
      domainOriginRestrictions: true,
      dnsVerificationFailures: true,
      severityThreshold: 'critical_and_warning'
    },
    gameSubmissionStatus: {
      enabled: true,
      approvedForSyndication: true,
      changesRequiredFeedback: true,
      newBuildResubmissions: true,
      dispatchMode: 'realtime'
    },
    inAppSoundEnabled: true,
    browserPushEnabled: false,
    weeklyDigestEnabled: true
  }), [currentUser]);

  // Load from localStorage or initialize with defaults
  const [settings, setSettings] = useState<NotificationAlertSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return defaultSettings;
  });

  // Keep alertEmailAddress in sync if user profile arrives later
  useEffect(() => {
    if (currentUser?.email && settings.alertEmailAddress === 'dochaseng@gmail.com') {
      setSettings(prev => ({ ...prev, alertEmailAddress: currentUser.email }));
    }
  }, [currentUser]);

  const saveSettings = (updated: NotificationAlertSettings) => {
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const playChime = () => {
    if (!settings.inAppSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  };

  const handleSendTestEmail = () => {
    setTestEmailStatus({ status: 'sending' });
    playChime();

    setTimeout(() => {
      setTestEmailStatus({
        status: 'success',
        message: `Dispatched sample alert email to ${settings.alertEmailAddress}. Preview: "[DochGames Alert] Sandbox Pre-Flight Security Passed · Game Syndication QA Active".`
      });
    }, 800);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const auditCount = useMemo(() => {
    return notifications.filter(n => n.category === 'audit').length;
  }, [notifications]);

  const activityCount = useMemo(() => {
    return notifications.filter(n => n.category === 'activity').length;
  }, [notifications]);

  const systemCount = useMemo(() => {
    return notifications.filter(n => ['system', 'security', 'revenue', 'qa'].includes(n.category)).length;
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      if (activeTab === 'audit' && item.category !== 'audit') return false;
      if (activeTab === 'activity' && item.category !== 'activity') return false;
      if (activeTab === 'system' && !['system', 'security', 'revenue', 'qa'].includes(item.category)) return false;

      if (unreadOnly && item.read) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMsg = item.message.toLowerCase().includes(q);
        const matchActor = item.actor?.name.toLowerCase().includes(q) || item.actor?.role.toLowerCase().includes(q);
        const matchAudit = item.auditDetails?.entityName?.toLowerCase().includes(q) || 
                           item.auditDetails?.action.toLowerCase().includes(q) ||
                           item.auditDetails?.checkDetails?.toLowerCase().includes(q);
        if (!matchTitle && !matchMsg && !matchActor && !matchAudit) return false;
      }

      return true;
    });
  }, [notifications, activeTab, unreadOnly, searchQuery]);

  if (!isOpen) return null;

  const formatTimeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 1000 / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getCategoryBadge = (category: NotificationCategory) => {
    switch (category) {
      case 'audit':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-600" />
            PLATFORM AUDIT
          </span>
        );
      case 'activity':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200/70 flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-600" />
            ACTIVITY
          </span>
        );
      case 'security':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200/70 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            SECURITY
          </span>
        );
      case 'revenue':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            REVENUE
          </span>
        );
      case 'system':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-600" />
            SYSTEM
          </span>
        );
    }
  };

  const getSeverityIcon = (severity: string, category: string) => {
    if (category === 'audit') {
      return <Shield className="w-4 h-4 text-blue-600" />;
    }
    if (category === 'revenue') {
      return <DollarSign className="w-4 h-4 text-emerald-600" />;
    }
    switch (severity) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Slideover Sheet Panel */}
      <div 
        className="w-full max-w-xl sm:max-w-2xl bg-white border-l border-slate-200/80 shadow-2xl flex flex-col h-full overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {viewMode === 'settings' ? 'Notification & Email Settings' : 'Platform Notifications & Audits'}
                  </h2>
                  {viewMode === 'stream' && unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#D6F938] text-slate-950 shadow-xs">
                      {unreadCount} new
                    </span>
                  )}
                  {viewMode === 'settings' && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      settings.emailAlertsEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {settings.emailAlertsEnabled ? 'EMAIL ALERTS ON' : 'EMAIL ALERTS OFF'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {viewMode === 'settings'
                    ? 'Configure email alerts for critical audits, security violations, and game QA changes.'
                    : 'Real-time platform audits, security checks, and partner activity stream.'}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Settings / Stream View Switcher Button */}
              <button
                onClick={() => {
                  setViewMode(viewMode === 'stream' ? 'settings' : 'stream');
                  setTestEmailStatus({ status: 'idle' });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
                  viewMode === 'settings'
                    ? 'bg-[#D6F938] text-slate-950 border-[#cbf026]'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={viewMode === 'settings' ? 'Back to notifications stream' : 'Email Alerts & System Audit Configuration'}
              >
                {viewMode === 'settings' ? (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Back to Feed</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Alert Settings</span>
                  </>
                )}
              </button>

              {viewMode === 'stream' && onTriggerSampleAudit && (
                <button
                  onClick={() => {
                    onTriggerSampleAudit();
                    playChime();
                  }}
                  title="Simulate a live platform audit or activity event"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Simulate Event</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Tabs (Stream Mode) or Breadcrumb (Settings Mode) */}
          {viewMode === 'stream' ? (
            <div className="space-y-2.5 pt-1 border-t border-slate-200/80">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/70 flex-wrap">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'all'
                        ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-mono">
                      {notifications.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'audit'
                        ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Platform Audits</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-mono">
                      {auditCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'activity'
                        ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Activity Feed</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-mono">
                      {activityCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('system')}
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeTab === 'system'
                        ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>System & Alerts</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 font-mono">
                      {systemCount}
                    </span>
                  </button>
                </div>

                {/* Mark All Read & Clear actions */}
                <div className="flex items-center gap-1 text-xs">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-colors shadow-xs"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Mark all read</span>
                    </button>
                  )}
                  <button
                    onClick={onClearAll}
                    className="p-1.5 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search audit logs, games, domains, actions..."
                    className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-700 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setUnreadOnly(!unreadOnly)}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs ${
                    unreadOnly
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>Unread Only</span>
                </button>
              </div>
            </div>
          ) : (
            /* Settings Mode Top Nav */
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">Email Alert Dispatch Configuration</span>
              </div>
              {saveBanner && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 flex items-center gap-1 animate-pulse">
                  <Check className="w-3 h-3" />
                  Preferences Saved
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content Body: Stream View vs. Settings Configuration Panel */}
        {viewMode === 'settings' ? (
          /* CONFIGURATION PANEL FOR EMAIL ALERTS & SYSTEM AUDITS */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Master Email Alerts Toggle Card */}
            <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">
                      Automated Email Dispatch
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Send instantaneous email alerts when critical platform audits, container security policies, or game submission statuses are updated.
                    </p>
                  </div>
                </div>

                {/* Master Switch */}
                <button
                  onClick={() => saveSettings({ ...settings, emailAlertsEnabled: !settings.emailAlertsEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    settings.emailAlertsEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Email Alerts"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    settings.emailAlertsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Recipient Email Address Input */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Alert Destination Email Address
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={settings.alertEmailAddress}
                      onChange={(e) => saveSettings({ ...settings, alertEmailAddress: e.target.value })}
                      placeholder="alerts@company.com"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSendTestEmail}
                    disabled={testEmailStatus.status === 'sending' || !settings.emailAlertsEnabled}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50 text-xs font-bold transition-colors shrink-0 shadow-xs"
                  >
                    {testEmailStatus.status === 'sending' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Test...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test Alert</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Email Dispatch Feedback */}
                {testEmailStatus.status === 'success' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-fade-in font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 text-[11px] leading-relaxed">
                      {testEmailStatus.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CONFIGURATION SECTION 1: CRITICAL SYSTEM AUDITS */}
            <div className={`p-5 rounded-3xl bg-slate-50/80 border transition-all space-y-4 ${
              settings.criticalSystemAudits.enabled
                ? 'border-blue-300 ring-2 ring-blue-500/10'
                : 'border-slate-200 opacity-80'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        Critical System Audits & Security Alerts
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-100 text-blue-800">
                        SECURITY
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Trigger email notifications for sandbox breaches, strict CSP containment checks, and DNS verification anomalies.
                    </p>
                  </div>
                </div>

                {/* Toggle System Audits */}
                <button
                  onClick={() => saveSettings({
                    ...settings,
                    criticalSystemAudits: {
                      ...settings.criticalSystemAudits,
                      enabled: !settings.criticalSystemAudits.enabled
                    }
                  })}
                  disabled={!settings.emailAlertsEnabled}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 disabled:opacity-40 ${
                    settings.criticalSystemAudits.enabled && settings.emailAlertsEnabled
                      ? 'bg-blue-600'
                      : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Critical System Audits"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    settings.criticalSystemAudits.enabled && settings.emailAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Detailed Audit Checkboxes */}
              {settings.criticalSystemAudits.enabled && (
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Audits to Trigger Email Dispatch
                  </div>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.criticalSystemAudits.sandboxSecurityEscapes}
                      onChange={(e) => saveSettings({
                        ...settings,
                        criticalSystemAudits: {
                          ...settings.criticalSystemAudits,
                          sandboxSecurityEscapes: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        Sandbox Security & Container Violations
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Alert immediately if an untrusted script execution, cross-domain iframe escape, or unsafe telemetry attempt is blocked.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.criticalSystemAudits.domainOriginRestrictions}
                      onChange={(e) => saveSettings({
                        ...settings,
                        criticalSystemAudits: {
                          ...settings.criticalSystemAudits,
                          domainOriginRestrictions: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        Domain Whitelist & Wildcard Origin Restrictions
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Alert when publisher API requests attempt wildcard origins (<code className="text-blue-600 font-bold">*</code>) and are clamped to strict HTTPS hosts.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.criticalSystemAudits.dnsVerificationFailures}
                      onChange={(e) => saveSettings({
                        ...settings,
                        criticalSystemAudits: {
                          ...settings.criticalSystemAudits,
                          dnsVerificationFailures: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        DNS TXT & ads.txt Verification Failures
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Alert if domain ownership tokens or publisher ads.txt line matching fails during automated verification cycles.
                      </div>
                    </div>
                  </label>

                  {/* Severity Threshold Dropdown */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
                    <span className="text-slate-700 font-bold">Audit Severity Threshold:</span>
                    <select
                      value={settings.criticalSystemAudits.severityThreshold}
                      onChange={(e) => saveSettings({
                        ...settings,
                        criticalSystemAudits: {
                          ...settings.criticalSystemAudits,
                          severityThreshold: e.target.value as any
                        }
                      })}
                      className="bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    >
                      <option value="critical_only">Critical Events Only (Blocks & Breaches)</option>
                      <option value="critical_and_warning">Critical & Warnings (Recommended)</option>
                      <option value="all">All Audit Events (Including Informational Passes)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIGURATION SECTION 2: GAME SUBMISSION STATUS CHANGES */}
            <div className={`p-5 rounded-3xl bg-slate-50/80 border transition-all space-y-4 ${
              settings.gameSubmissionStatus.enabled
                ? 'border-purple-300 ring-2 ring-purple-500/10'
                : 'border-slate-200 opacity-80'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        Game Submission Status Changes
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-100 text-purple-800">
                        QA LIFECYCLE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Receive immediate status dispatches when DochGames QA approves, requests revisions, or updates syndication readiness.
                    </p>
                  </div>
                </div>

                {/* Toggle Game Submissions */}
                <button
                  onClick={() => saveSettings({
                    ...settings,
                    gameSubmissionStatus: {
                      ...settings.gameSubmissionStatus,
                      enabled: !settings.gameSubmissionStatus.enabled
                    }
                  })}
                  disabled={!settings.emailAlertsEnabled}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 p-0.5 disabled:opacity-40 ${
                    settings.gameSubmissionStatus.enabled && settings.emailAlertsEnabled
                      ? 'bg-purple-600'
                      : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Game Submission Status Changes"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    settings.gameSubmissionStatus.enabled && settings.emailAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Detailed Game Submission Checkboxes */}
              {settings.gameSubmissionStatus.enabled && (
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Game Status Triggers for Email Alert
                  </div>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.gameSubmissionStatus.approvedForSyndication}
                      onChange={(e) => saveSettings({
                        ...settings,
                        gameSubmissionStatus: {
                          ...settings.gameSubmissionStatus,
                          approvedForSyndication: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Approved for Global Syndication</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                          LIVE
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Instant email when a title clears 12-point QA testing and is approved for distribution across partner widgets.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.gameSubmissionStatus.changesRequiredFeedback}
                      onChange={(e) => saveSettings({
                        ...settings,
                        gameSubmissionStatus: {
                          ...settings.gameSubmissionStatus,
                          changesRequiredFeedback: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Changes Required / Reviewer Action Notes</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono font-bold border border-amber-200">
                          ACTION REQUIRED
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        High-priority email dispatch when human QA reviewers attach feedback regarding mobile touch controls, audio resumption, or frame pacing.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 cursor-pointer transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={settings.gameSubmissionStatus.newBuildResubmissions}
                      onChange={(e) => saveSettings({
                        ...settings,
                        gameSubmissionStatus: {
                          ...settings.gameSubmissionStatus,
                          newBuildResubmissions: e.target.checked
                        }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-0"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">
                        New Build Uploads & Version Hashing
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Confirmation email when new .zip builds or WebGL patches are submitted to the QA testing queue.
                      </div>
                    </div>
                  </label>

                  {/* Dispatch Mode Radio Pills */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
                    <span className="text-slate-700 font-bold">Dispatch Frequency:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveSettings({
                          ...settings,
                          gameSubmissionStatus: {
                            ...settings.gameSubmissionStatus,
                            dispatchMode: 'realtime'
                          }
                        })}
                        className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all shadow-xs ${
                          settings.gameSubmissionStatus.dispatchMode === 'realtime'
                            ? 'bg-[#D6F938] text-slate-950'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Real-Time (Instant)
                      </button>
                      <button
                        onClick={() => saveSettings({
                          ...settings,
                          gameSubmissionStatus: {
                            ...settings.gameSubmissionStatus,
                            dispatchMode: 'hourly_batch'
                          }
                        })}
                        className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-bold transition-all shadow-xs ${
                          settings.gameSubmissionStatus.dispatchMode === 'hourly_batch'
                            ? 'bg-[#D6F938] text-slate-950'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Hourly Batch Digest
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CONFIGURATION SECTION 3: IN-APP & DEVICE PREFERENCES */}
            <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-3 text-xs shadow-xs">
              <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                In-App & Platform Preferences
              </h4>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer shadow-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>In-App Audio Chime for Notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.inAppSoundEnabled}
                    onChange={(e) => {
                      saveSettings({ ...settings, inAppSoundEnabled: e.target.checked });
                      if (e.target.checked) playChime();
                    }}
                    className="rounded border-slate-300 text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer shadow-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Weekly Revenue & Performance Email Digest</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigestEnabled}
                    onChange={(e) => saveSettings({ ...settings, weeklyDigestEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600"
                  />
                </label>
              </div>
            </div>

            {/* Save & Reset Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => saveSettings(defaultSettings)}
                className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors font-medium"
              >
                Reset to Recommended Defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('stream')}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  View Feed
                </button>
                <button
                  onClick={() => {
                    saveSettings(settings);
                    setViewMode('stream');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold shadow-xs transition-all"
                >
                  Save & Apply Settings
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* NOTIFICATIONS STREAM LIST VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900">No notifications found</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {unreadOnly 
                    ? 'You have caught up with all notifications. Turn off "Unread Only" to see archived audit history.'
                    : 'No entries match your current search and filter settings.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  {onTriggerSampleAudit && (
                    <button
                      onClick={() => {
                        onTriggerSampleAudit();
                        playChime();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Simulate Live Event
                    </button>
                  )}
                  <button
                    onClick={() => setViewMode('settings')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-200 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Configure Email Alerts
                  </button>
                </div>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`pt-3 first:pt-0 transition-all ${
                    !item.read ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className={`p-4 rounded-2xl border transition-all ${
                    !item.read
                      ? 'bg-blue-50/40 border-blue-200 shadow-xs ring-1 ring-blue-500/10'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}>
                    {/* Card Top Row: Category, Severity, Time, Unread Dot */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getCategoryBadge(item.category)}
                        {item.auditDetails?.result && (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                            item.auditDetails.result === 'verified' || item.auditDetails.result === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.auditDetails.result === 'flagged'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {item.auditDetails.result}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                        {!item.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" title="Unread" />
                        )}
                      </div>
                    </div>

                    {/* Title & Message */}
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {getSeverityIcon(item.severity, item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.message}
                        </p>

                        {/* Audit Details Box if present */}
                        {item.auditDetails && (
                          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500">
                              <span className="font-mono text-blue-600 font-bold">
                                Action: {item.auditDetails.action}
                              </span>
                              {item.auditDetails.entityName && (
                                <span className="text-slate-800 truncate max-w-[200px]">
                                  Target: <strong>{item.auditDetails.entityName}</strong>
                                </span>
                              )}
                            </div>
                            {item.auditDetails.checkDetails && (
                              <div className="text-slate-600 font-mono text-[10px] leading-tight pt-1 border-t border-slate-200">
                                {item.auditDetails.checkDetails}
                              </div>
                            )}
                            {item.auditDetails.ipOrOrigin && (
                              <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-0.5">
                                <Globe className="w-3 h-3 text-slate-400" />
                                Origin/Host: <span className="font-mono text-slate-700">{item.auditDetails.ipOrOrigin}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Metadata Chips if present */}
                        {item.metadata && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(item.metadata).map(([k, v]) => (
                              <span key={k} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-mono">
                                {k}: <strong className="text-slate-900">{Array.isArray(v) ? v.join(', ') : String(v)}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Footer: Actor & Action Buttons */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          {item.actor ? (
                            <span className="text-[10px] text-slate-500">
                              Logged by: <strong className="text-slate-800">{item.actor.name}</strong> ({item.actor.role})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">DochGames System Stream</span>
                          )}

                          <div className="flex items-center gap-2">
                            {item.actionLabel && item.actionView && (
                              <button
                                onClick={() => {
                                  onNavigate(item.actionView!);
                                  onClose();
                                }}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-bold transition-colors shadow-xs"
                              >
                                <span>{item.actionLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => onMarkAsRead(item.id)}
                              className="text-[11px] text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-full hover:bg-slate-100 transition-colors font-medium"
                            >
                              {item.read ? 'Mark unread' : 'Mark read'}
                            </button>

                            <button
                              onClick={() => onDeleteNotification(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-500">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Audit Stream: <strong className="text-slate-800">Live & Immutable</strong></span>
            <span>· Email Alerts: <strong className={settings.emailAlertsEnabled ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {settings.emailAlertsEnabled ? 'Active' : 'Disabled'}
            </strong></span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={() => setViewMode(viewMode === 'settings' ? 'stream' : 'settings')}
              className="text-blue-600 hover:underline flex items-center gap-1 font-bold"
            >
              <Settings className="w-3 h-3" />
              <span>{viewMode === 'settings' ? 'View Feed' : 'Alert Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
