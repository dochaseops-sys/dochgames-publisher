import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { PublisherHomePage } from './components/publisher/home/PublisherHomePage';
import { WidgetsPage } from './components/publisher/widgets/WidgetsPage';
import { WidgetFlow } from './components/publisher/builder/WidgetFlow';
import { PublisherAnalyticsPage } from './components/publisher/analytics/PublisherAnalyticsPage';
import { WebsitesPage } from './components/publisher/websites/WebsitesPage';
import { PublisherHelpPage } from './components/publisher/help/PublisherHelpPage';
import { ConnectPropertyModal } from './components/publisher/ConnectPropertyModal';
import { PlayableGameModal } from './components/common/PlayableGameModal';
import { NotificationCenter } from './components/notifications/NotificationCenter';

import { 
  UserProfile, PublisherProperty, WidgetConfig, 
  GameItem, PlatformNotification 
} from './types';
import { 
  mockGames, mockNotifications, initialUsers 
} from './data/mockData';
import { getWebsites } from './services/websites';
import { getWidgets } from './services/widgets';

export function App() {
  // Current user state (Publisher)
  const [currentUser] = useState<UserProfile>(initialUsers[0]);
  
  // 5 Top-level Navigation views: 'home' | 'widgets' | 'analytics' | 'websites' | 'help'
  // Sub-flow view: 'builder' (3-step continuous flow)
  const [currentView, setCurrentView] = useState<string>('home');

  // Active builder sub-state
  const [builderWidgetId, setBuilderWidgetId] = useState<string | undefined>(undefined);
  const [builderStep, setBuilderStep] = useState<1 | 2 | 3>(1);

  // Platform state
  const [properties, setProperties] = useState<PublisherProperty[]>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(mockNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Modals
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [selectedPlayableGame, setSelectedPlayableGame] = useState<GameItem | null>(null);

  // Load properties and widgets from persistent services
  const refreshData = () => {
    const props = getWebsites();
    setProperties(props);
    const wdgs = getWidgets();
    setWidgets(wdgs);
  };

  useEffect(() => {
    refreshData();
  }, []);

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

  // Launch Create Widget Flow (Step 1)
  const handleCreateNewWidget = (propertyId?: string) => {
    setBuilderWidgetId(undefined);
    setBuilderStep(1);
    setCurrentView('builder');
  };

  // Open existing widget at specific step (Step 2 = Customise, Step 3 = Install)
  const handleSelectWidget = (widgetId: string, step: 1 | 2 | 3 = 2) => {
    setBuilderWidgetId(widgetId);
    setBuilderStep(step);
    setCurrentView('builder');
  };

  // Navigation mapper to support legacy triggers
  const handleNavigate = (view: string) => {
    if (view === 'dashboard' || view === 'home') {
      setCurrentView('home');
    } else if (view === 'my_widgets' || view === 'widgets') {
      refreshData();
      setCurrentView('widgets');
    } else if (view === 'widget_builder') {
      handleCreateNewWidget();
    } else if (view === 'deployment') {
      // If deployment requested, open builder on Step 3 for first widget
      if (widgets.length > 0) {
        handleSelectWidget(widgets[0].id, 3);
      } else {
        handleCreateNewWidget();
      }
    } else if (view === 'publisher_analytics' || view === 'analytics') {
      setCurrentView('analytics');
    } else if (view === 'websites') {
      refreshData();
      setCurrentView('websites');
    } else if (view === 'help') {
      setCurrentView('help');
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex flex-col font-sans selection:bg-[#D6F938] selection:text-slate-950">
      {/* 5-Tab Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigate={handleNavigate}
        onCreateWidget={() => handleCreateNewWidget()}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* TAB 1: HOME */}
        {currentView === 'home' && (
          <PublisherHomePage
            widgets={widgets}
            properties={properties}
            onCreateWidget={() => handleCreateNewWidget()}
            onSelectWidget={(wId, step) => handleSelectWidget(wId, step)}
            onNavigateTab={(tab) => handleNavigate(tab)}
            onConnectWebsite={() => setIsConnectModalOpen(true)}
          />
        )}

        {/* TAB 2: WIDGETS */}
        {currentView === 'widgets' && (
          <WidgetsPage
            widgets={widgets}
            properties={properties}
            onCreateWidget={() => handleCreateNewWidget()}
            onSelectWidget={(wId, step) => handleSelectWidget(wId, step)}
            onRefresh={refreshData}
          />
        )}

        {/* CONTINUOUS 3-STEP BUILDER & INSTALLATION FLOW */}
        {currentView === 'builder' && (
          <WidgetFlow
            widgetId={builderWidgetId}
            initialStep={builderStep}
            onFinish={() => {
              refreshData();
              setCurrentView('widgets');
            }}
            onViewAnalytics={() => {
              refreshData();
              setCurrentView('analytics');
            }}
            onPlayGame={(game) => setSelectedPlayableGame(game)}
          />
        )}

        {/* TAB 3: ANALYTICS */}
        {currentView === 'analytics' && (
          <PublisherAnalyticsPage
            widgets={widgets}
            onSelectWidget={(wId, step) => handleSelectWidget(wId, step)}
          />
        )}

        {/* TAB 4: WEBSITES */}
        {currentView === 'websites' && (
          <WebsitesPage
            websites={properties}
            onRefresh={refreshData}
            onCreateWidgetForWebsite={(propId) => handleCreateNewWidget(propId)}
            onViewWidgetsForWebsite={(propId) => {
              refreshData();
              setCurrentView('widgets');
            }}
          />
        )}

        {/* TAB 5: HELP */}
        {currentView === 'help' && (
          <PublisherHelpPage />
        )}
      </main>

      {/* Professional, Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">DochGames Publisher Platform</span>
            <span>· Instant HTML5 & WebGL Game Syndication</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button onClick={() => setCurrentView('help')} className="hover:text-blue-600 transition-colors">
              Installation Guides
            </button>
            <button onClick={() => setCurrentView('websites')} className="hover:text-blue-600 transition-colors">
              Domains
            </button>
            <a href="mailto:support@dochgames.com" className="hover:text-blue-600 transition-colors">
              support@dochgames.com
            </a>
          </div>
        </div>
      </footer>

      {/* Slideover Notifications */}
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
          handleNavigate(view);
          setIsNotificationsOpen(false);
        }}
        onTriggerSampleAudit={() => {}}
      />

      {/* Playable Game Modal */}
      {selectedPlayableGame && (
        <PlayableGameModal
          game={selectedPlayableGame}
          isOpen={!!selectedPlayableGame}
          onClose={() => setSelectedPlayableGame(null)}
        />
      )}

      {/* Connect Property Modal */}
      <ConnectPropertyModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onPropertyCreated={(newProp) => {
          refreshData();
          setIsConnectModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
