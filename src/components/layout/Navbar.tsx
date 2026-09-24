import React, { useState, useRef, useEffect } from 'react';
import { 
  Gamepad2, Plus, Bell, Home, Layers, BarChart3, Globe, 
  HelpCircle, User, LogOut, ChevronDown 
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface NavbarProps {
  currentRole?: UserRole;
  currentView: string;
  currentUser: UserProfile;
  publisherName?: string;
  companyName?: string;
  avatarUrl?: string;
  realtimeConnected?: boolean;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onSelectRole?: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  onCreateWidget: () => void;
  onOpenConnectModal?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  publisherName,
  companyName,
  avatarUrl,
  unreadNotificationsCount,
  onOpenNotifications,
  onNavigate,
  onCreateWidget,
  onSignOut
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = publisherName || currentUser.name || 'Alex Mercer';
  const displayCompany = companyName || currentUser.companyOrStudio || 'GameZone Daily Media';

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'widgets', label: 'Widgets', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-slate-900 tracking-tight">
                  Doch<span className="text-blue-600">Games</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Publisher Suite
                </span>
              </div>
            </div>
          </div>

          {/* TrendTide Center Floating Pill Menu - Exactly 5 core tabs */}
          <nav className="hidden md:flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
            {navItems.map(item => {
              const isActive = currentView === item.id || 
                (item.id === 'widgets' && currentView === 'builder');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Global Prominent + Create Widget CTA Button */}
            <button
              onClick={onCreateWidget}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-black transition-all shadow-sm hover:shadow active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create widget</span>
            </button>

            {/* Circular Notifications Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-xs group"
              title="Platform Notifications"
              aria-label="Platform Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Interactive User Avatar Menu Dropdown */}
            <div className="relative pl-1 border-l border-slate-200/80" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-label="Publisher account menu"
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                {/* Avatar circle or image */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shadow-xs ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs ring-2 ring-slate-100">
                    {initials}
                  </div>
                )}

                {/* Name & Company on Desktop */}
                <div className="hidden xl:block text-left text-xs pr-1">
                  <div className="font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                    {displayCompany}
                  </div>
                </div>

                <ChevronDown 
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu Popover */}
              {isProfileMenuOpen && (
                <div 
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Menu User Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-display font-black text-sm text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {displayCompany}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        Publisher
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('profile_settings');
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                        currentView === 'profile_settings'
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Profile & Settings</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('help');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Help & Documentation</span>
                    </button>
                  </div>

                  {/* Sign Out Link */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto gap-1">
          {navItems.map(item => {
            const isActive = currentView === item.id || 
              (item.id === 'widgets' && currentView === 'builder');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-1 ${
                  isActive ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
