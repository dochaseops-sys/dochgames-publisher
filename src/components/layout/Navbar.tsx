import React from 'react';
import { 
  Gamepad2, Plus, Bell, Home, Layers, BarChart3, Globe, HelpCircle 
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';

interface NavbarProps {
  currentRole?: UserRole;
  currentView: string;
  currentUser: UserProfile;
  realtimeConnected?: boolean;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onSelectRole?: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  onCreateWidget: () => void;
  onOpenConnectModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  unreadNotificationsCount,
  onOpenNotifications,
  onNavigate,
  onCreateWidget
}) => {
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

            {/* User Profile Pill / Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200/80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs ring-2 ring-slate-100">
                {currentUser.avatar || 'P'}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">{currentUser.companyOrStudio || 'Publisher'}</div>
              </div>
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
