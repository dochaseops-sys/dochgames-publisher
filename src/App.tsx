import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { PublisherDashboard } from './components/publisher/PublisherDashboard';
import { WidgetBuilderPage } from './components/publisher/WidgetBuilderPage';
import { WidgetDeploymentPage } from './components/publisher/WidgetDeploymentPage';
import { MyWidgetsPage } from './components/publisher/MyWidgetsPage';
import { PublisherAnalyticsPage } from './components/publisher/PublisherAnalyticsPage';
import { ConnectPropertyModal } from './components/publisher/ConnectPropertyModal';
import { PlayableGameModal } from './components/common/PlayableGameModal';
import { NotificationCenter } from './components/notifications/NotificationCenter';

import { 
  UserProfile, PublisherProperty, WidgetConfig, 
  GameItem, ActivityEvent, PlatformNotification 
} from './types';
import { 
  mockGames, mockProperties, mockWidgets, 
  mockActivities, mockNotifications, initialUsers 
} from './data/mockData';
import { realtime } from './services/websocket';

export function App() {
  // Current user state (Publisher)
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[0]);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Platform state
  const [properties, setProperties] = useState<PublisherProperty[]>(mockProperties);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(mockWidgets);
  const [games, setGames] = useState<GameItem[]>(mockGames);
  const [activities, setActivities] = useState<ActivityEvent[]>(mockActivities);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(mockNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Modals & Active Selections
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [selectedPlayableGame, setSelectedPlayableGame] = useState<GameItem | null>(null);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [selectedDeploymentWidgetId, setSelectedDeploymentWidgetId] = useState<string | undefined>(undefined);
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);

  // Notification toast
  const [toastNotification, setToastNotification] = useState<{ title: string; message: string } | null>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleTriggerSampleAudit = () => {
    const samples: Array<Omit<PlatformNotification, 'id' | 'timestamp' | 'read'>> = [
      {
        category: 'audit',
        severity: 'success',
        title: 'Instant Sandbox Security Verification Passed',
        message: 'Pre-flight integrity check completed for newly compiled game assets. Zero external tracker injections found.',
        actor: { name: 'DochGames Sentinel Bot', role: 'Automated QA Engine' },
        auditDetails: {
          entityType: 'game',
          action: 'SANDBOX_PREFLIGHT_PASS',
          entityName: 'WebGL Sandbox Node #42',
          result: 'verified',
          checkDetails: 'Strict CSP isolated runtime · Zero script injection vulnerabilities detected'
        }
      },
      {
        category: 'activity',
        severity: 'info',
        title: 'New Game Start Surge Detected',
        message: 'A surge of 1,200 concurrent player sessions was recorded on syndicated partner widgets.',
        actor: { name: 'Edge Traffic Telemetry', role: 'System' }
      },
      {
        category: 'system',
        severity: 'success',
        title: 'Dynamic Asset Optimization Deployed',
        message: 'DochGames WebGL Brotli/Wasm asset compression has successfully reduced initial game payload size by 38%.',
        actor: { name: 'CDN Optimizer', role: 'System' }
      }
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    const newNotif: PlatformNotification = {
      ...pick,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setToastNotification({
      title: newNotif.title,
      message: newNotif.message
    });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Helper to merge activities deduplicating by ID
  const mergeActivities = (incoming: ActivityEvent[], existing: ActivityEvent[]): ActivityEvent[] => {
    const seen = new Set<string>();
    const merged: ActivityEvent[] = [];
    for (const item of [...incoming, ...existing]) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged.slice(0, 30);
  };

  // Initialize Realtime WebSocket Connection & Listeners
  useEffect(() => {
    realtime.connect();

    const unsubInit = realtime.on('init', (payload) => {
      setRealtimeConnected(true);
      if (Array.isArray(payload.activities)) {
        setActivities(prev => mergeActivities(payload.activities, prev));
      }
    });

    const unsubActivity = realtime.on('activity', (newActivity: ActivityEvent) => {
      if (newActivity && newActivity.id) {
        setActivities(prev => mergeActivities([newActivity], prev));
      }
    });

    const unsubNotificationReceived = realtime.on('notification:received', (payload: any) => {
      if (payload?.activity) {
        setActivities(prev => mergeActivities([payload.activity], prev));
      }
    });

    const unsubNotification = realtime.on('notification', (notif) => {
      setToastNotification({
        title: notif.action,
        message: `${notif.actor}: ${notif.details}`
      });
      setTimeout(() => setToastNotification(null), 4000);
    });

    return () => {
      unsubInit();
      unsubActivity();
      unsubNotificationReceived();
      unsubNotification();
    };
  }, []);

  // Property creation handler
  const handlePropertyCreated = (newProp: PublisherProperty) => {
    setProperties(prev => [newProp, ...prev]);
    realtime.broadcastNotification(
      currentUser.name,
      'Publisher',
      'PROPERTY_CONNECTED',
      `Connected and verified property: ${newProp.domain}`
    );
  };

  // Widget management handlers
  const handleSaveWidget = (widget: WidgetConfig) => {
    setWidgets(prev => {
      const idx = prev.findIndex(w => w.id === widget.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = widget;
        return copy;
      }
      return [widget, ...prev];
    });

    realtime.broadcastNotification(
      currentUser.name,
      'Publisher',
      'WIDGET_PUBLISHED',
      `Saved & published smart widget "${widget.name}" (${widget.layout})`
    );
  };

  const handleDuplicateWidget = (widget: WidgetConfig) => {
    const duplicated: WidgetConfig = {
      ...widget,
      id: `wdg-${Date.now()}`,
      name: `${widget.name} (Copy)`,
      version: 1,
      publishedVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { impressions: 0, clicks: 0, gameStarts: 0, ctr: 0 }
    };
    setWidgets(prev => [duplicated, ...prev]);
  };

  const handleToggleWidgetStatus = (widgetId: string) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === widgetId) {
        return {
          ...w,
          status: w.status === 'published' ? 'draft' : 'published',
          updatedAt: new Date().toISOString()
        };
      }
      return w;
    }));
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  // Navigation helpers
  const handleOpenDeployment = (widgetId?: string) => {
    if (widgetId) {
      setSelectedDeploymentWidgetId(widgetId);
    } else if (widgets.length > 0) {
      setSelectedDeploymentWidgetId(widgets[0].id);
    }
    setCurrentView('deployment');
  };

  const handleOpenBuilder = (widget?: WidgetConfig) => {
    setEditingWidget(widget || null);
    setCurrentView('widget_builder');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex flex-col font-sans selection:bg-[#D6F938] selection:text-slate-950">
      {/* Platform Navigation */}
      <Navbar
        currentView={currentView}
        currentUser={currentUser}
        realtimeConnected={realtimeConnected}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigate={setCurrentView}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Real-time Notification Toast */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200/90 shadow-xl rounded-2xl p-4 max-w-sm animate-fade-in flex items-start gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-ping mt-1 shrink-0"></span>
          <div className="flex-1 min-w-0">
            <h5 className="font-display font-semibold text-xs text-slate-900">{toastNotification.title}</h5>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{toastNotification.message}</p>
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 sm:py-8">
        
        {/* 1. OVERVIEW DASHBOARD */}
        {currentView === 'dashboard' && (
          <PublisherDashboard
            currentUser={currentUser}
            properties={properties}
            widgets={widgets}
            games={games}
            activities={activities}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onNavigateToBuilder={() => handleOpenBuilder()}
            onNavigateToDeployment={(wId) => handleOpenDeployment(wId)}
            onNavigateToAnalytics={() => setCurrentView('analytics')}
            onNavigateToWidgets={() => setCurrentView('my_widgets')}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {/* 2. PILLAR 1: WIDGET BUILDER */}
        {currentView === 'widget_builder' && (
          <WidgetBuilderPage
            properties={properties}
            games={games}
            existingWidget={editingWidget}
            onSaveWidget={handleSaveWidget}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
            onNavigateToDeployment={(widget) => {
              handleSaveWidget(widget);
              handleOpenDeployment(widget.id);
            }}
          />
        )}

        {/* 3. PILLAR 2: WIDGET DEPLOYMENT */}
        {currentView === 'deployment' && (
          <WidgetDeploymentPage
            widgets={widgets}
            properties={properties}
            games={games}
            selectedWidgetId={selectedDeploymentWidgetId}
            onNavigateToBuilder={(widget) => handleOpenBuilder(widget)}
            onNavigateToAnalytics={() => setCurrentView('analytics')}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
          />
        )}

        {/* 4. PILLAR 3: ANALYTICS */}
        {currentView === 'analytics' && (
          <PublisherAnalyticsPage
            widgets={widgets}
            properties={properties}
            games={games}
            onNavigateToDeployment={(wId) => handleOpenDeployment(wId)}
            onNavigateToBuilder={(widget) => handleOpenBuilder(widget)}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
          />
        )}

        {/* 5. MY WIDGETS REPOSITORY */}
        {currentView === 'my_widgets' && (
          <MyWidgetsPage
            widgets={widgets}
            properties={properties}
            games={games}
            onCreateNew={() => handleOpenBuilder()}
            onEditWidget={(w) => handleOpenBuilder(w)}
            onDuplicateWidget={handleDuplicateWidget}
            onToggleStatus={handleToggleWidgetStatus}
            onDeleteWidget={handleDeleteWidget}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
            onNavigateToDeployment={(wId) => handleOpenDeployment(wId)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">DochGames Publisher Platform</span>
            <span>· Instant HTML5 & WebGL Distribution</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Edge CDN: <strong className="text-emerald-600">v2.6 Active</strong></span>
            <span>Attribution: Real-Time Telemetry</span>
            <span>TLS 1.3 Strict</span>
          </div>
        </div>
      </footer>

      {/* Notification Center Slideover */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        currentUser={currentUser}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onDeleteNotification={handleDeleteNotification}
        onNavigate={(view) => {
          if (view === 'publisher_analytics') {
            setCurrentView('analytics');
          } else if (view === 'widget_builder') {
            setCurrentView('widget_builder');
          } else {
            setCurrentView('dashboard');
          }
          setIsNotificationsOpen(false);
        }}
        onTriggerSampleAudit={handleTriggerSampleAudit}
      />

      {/* Interactive Playable Game Modal */}
      {selectedPlayableGame && (
        <PlayableGameModal
          game={selectedPlayableGame}
          isOpen={!!selectedPlayableGame}
          onClose={() => setSelectedPlayableGame(null)}
        />
      )}

      {/* Connect Property & Generate Publisher Key Modal */}
      <ConnectPropertyModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onPropertyCreated={handlePropertyCreated}
      />
    </div>
  );
}

export default App;
