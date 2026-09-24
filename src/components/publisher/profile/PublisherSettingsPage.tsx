import React, { useState, useEffect } from 'react';
import { 
  PublisherProfile, 
  PublisherBusiness, 
  PublisherNotificationPreferences, 
  PublisherSecurityInfo, 
  PublisherAdvancedInfo, 
  SettingsSection 
} from '../../../types/publisherProfile';
import { PublisherProperty } from '../../../types';
import { publisherProfileService } from '../../../services/publisherProfile';
import { SettingsNavigation } from './SettingsNavigation';
import { ProfileSummary } from './ProfileSummary';
import { PersonalProfileForm } from './PersonalProfileForm';
import { PublishingBusinessForm } from './PublishingBusinessForm';
import { NotificationPreferencesForm } from './NotificationPreferencesForm';
import { SecuritySettings } from './SecuritySettings';
import { AdvancedPublisherSettings } from './AdvancedPublisherSettings';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { ChevronRight } from 'lucide-react';

interface PublisherSettingsPageProps {
  properties: PublisherProperty[];
  initialSection?: SettingsSection;
  onNavigateHome: () => void;
  onNavigateWebsites: () => void;
  onSignOut: () => void;
  onProfileUpdated?: (profile: PublisherProfile) => void;
  onBusinessUpdated?: (business: PublisherBusiness) => void;
}

export const PublisherSettingsPage: React.FC<PublisherSettingsPageProps> = ({
  properties,
  initialSection = 'profile',
  onNavigateHome,
  onNavigateWebsites,
  onSignOut,
  onProfileUpdated,
  onBusinessUpdated
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);
  const [loading, setLoading] = useState(true);

  // Profile data models
  const [profile, setProfile] = useState<PublisherProfile | null>(null);
  const [business, setBusiness] = useState<PublisherBusiness | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<PublisherNotificationPreferences | null>(null);
  const [securityInfo, setSecurityInfo] = useState<PublisherSecurityInfo | null>(null);
  const [advancedInfo, setAdvancedInfo] = useState<PublisherAdvancedInfo | null>(null);

  // Unsaved changes state tracking
  const [isCurrentFormDirty, setIsCurrentFormDirty] = useState(false);
  const [pendingSection, setPendingSection] = useState<SettingsSection | null>(null);
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prof, biz, notifs, sec, adv] = await Promise.all([
          publisherProfileService.getProfile(),
          publisherProfileService.getBusiness(),
          publisherProfileService.getNotificationPreferences(),
          publisherProfileService.getSecurityInfo(),
          publisherProfileService.getAdvancedInfo()
        ]);
        if (isMounted) {
          setProfile(prof);
          setBusiness(biz);
          setNotificationPrefs(notifs);
          setSecurityInfo(sec);
          setAdvancedInfo(adv);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load publisher settings:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle section switching with dirty check
  const handleSelectSection = (newSection: SettingsSection) => {
    if (newSection === activeSection) return;
    if (isCurrentFormDirty) {
      setPendingSection(newSection);
      setIsUnsavedDialogOpen(true);
    } else {
      setActiveSection(newSection);
    }
  };

  const handleDiscardAndSwitch = () => {
    setIsCurrentFormDirty(false);
    setIsUnsavedDialogOpen(false);
    if (pendingSection) {
      setActiveSection(pendingSection);
      setPendingSection(null);
    }
  };

  const handleStayOnCurrent = () => {
    setIsUnsavedDialogOpen(false);
    setPendingSection(null);
  };

  // Section Name Helper
  const getSectionTitle = (sec: SettingsSection): string => {
    switch (sec) {
      case 'profile':
        return 'Personal Profile';
      case 'business':
        return 'Publishing Business';
      case 'notifications':
        return 'Notification Preferences';
      case 'security':
        return 'Security & Sign-in';
      case 'advanced':
        return 'Advanced Identifiers';
      default:
        return 'Settings';
    }
  };

  // Form Save Handlers
  const handleSaveProfile = async (updates: Partial<PublisherProfile>) => {
    const updated = await publisherProfileService.updateProfile(updates);
    setProfile(updated);
    setIsCurrentFormDirty(false);
    onProfileUpdated?.(updated);
  };

  const handleSaveBusiness = async (updates: Partial<PublisherBusiness>) => {
    const updated = await publisherProfileService.updateBusiness(updates);
    setBusiness(updated);
    setIsCurrentFormDirty(false);
    onBusinessUpdated?.(updated);
  };

  const handleSaveNotifications = async (updates: Partial<PublisherNotificationPreferences>) => {
    const updated = await publisherProfileService.updateNotificationPreferences(updates);
    setNotificationPrefs(updated);
    setIsCurrentFormDirty(false);
  };

  const handleChangePassword = async (current: string, newPass: string) => {
    return publisherProfileService.changePassword(current, newPass);
  };

  const handleRequestDataExport = async () => {
    return publisherProfileService.requestDataExport();
  };

  const handleDeleteAccount = async (phrase: string) => {
    return publisherProfileService.requestAccountDeletion(phrase);
  };

  if (loading || !profile || !business || !notificationPrefs || !securityInfo || !advancedInfo) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading Profile & Settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Page Heading */}
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-blue-600 transition-colors"
          >
            DochGames
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-800">Profile & Settings</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your personal identity, publishing business details, alert preferences and account security.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Summary Card */}
      <ProfileSummary
        profile={profile}
        business={business}
      />

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation Menu */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <SettingsNavigation
              activeSection={activeSection}
              onSelectSection={handleSelectSection}
              hasUnsavedChanges={isCurrentFormDirty}
            />
          </div>
        </aside>

        {/* Right Side: Active Section Form / View */}
        <main className="lg:col-span-8">
          {activeSection === 'profile' && (
            <PersonalProfileForm
              initialProfile={profile}
              onSave={handleSaveProfile}
              onDirtyChange={setIsCurrentFormDirty}
            />
          )}

          {activeSection === 'business' && (
            <PublishingBusinessForm
              initialBusiness={business}
              properties={properties}
              onSave={handleSaveBusiness}
              onDirtyChange={setIsCurrentFormDirty}
              onNavigateToWebsites={onNavigateWebsites}
            />
          )}

          {activeSection === 'notifications' && (
            <NotificationPreferencesForm
              initialPreferences={notificationPrefs}
              onSave={handleSaveNotifications}
              onDirtyChange={setIsCurrentFormDirty}
            />
          )}

          {activeSection === 'security' && (
            <SecuritySettings
              securityInfo={securityInfo}
              onChangePassword={handleChangePassword}
              onSignOut={onSignOut}
            />
          )}

          {activeSection === 'advanced' && (
            <AdvancedPublisherSettings
              advancedInfo={advancedInfo}
              onRequestDataExport={handleRequestDataExport}
              onRequestAccountDeletion={handleDeleteAccount}
              onAccountDeleted={onSignOut}
            />
          )}
        </main>
      </div>

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesDialog
        isOpen={isUnsavedDialogOpen}
        sectionName={getSectionTitle(activeSection)}
        onStay={handleStayOnCurrent}
        onDiscardAndLeave={handleDiscardAndSwitch}
      />
    </div>
  );
};
