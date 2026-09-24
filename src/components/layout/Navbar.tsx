import React from 'react';
import { 
  Gamepad2, Globe, Layout, BarChart3, Plus, Shield, 
  User, ChevronDown, Sparkles, Bell, Code2, Layers
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
  onOpenConnectModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  unreadNotificationsCount,
  onOpenNotifications,
  onNavigate,
  onOpenConnectModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                  Doch<span className="text-blue-600">Games</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                  Publisher Suite
                </span>
              </div>
            </div>
          </div>

          {/* TrendTide Center Floating Pill Menu - Focused on 3 Core Pillars */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('widget_builder')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'widget_builder'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Widget Builder
            </button>
            <button
              onClick={() => onNavigate('deployment')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'deployment'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Deploy & Embed
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'analytics'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => onNavigate('my_widgets')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'my_widgets'
                  ? 'bg-[#D6F938] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              My Widgets
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Quick Connect Property */}
            <button
              onClick={onOpenConnectModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Connect Domain
            </button>

            {/* Quick Build Widget CTA */}
            <button
              onClick={() => onNavigate('widget_builder')}
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D6F938] hover:bg-[#cbf026] text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Widget
            </button>

            {/* Circular Notifications Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-xs group"
              title="Platform Audit & Activity Notifications"
              aria-label="Platform Notifications and Audits"
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

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto gap-1.5">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className={`whitespace-nowrap px-3 py-1 rounded-full font-semibold transition-all ${
              currentView === 'dashboard' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => onNavigate('widget_builder')} 
            className={`whitespace-nowrap px-3 py-1 rounded-full font-semibold transition-all ${
              currentView === 'widget_builder' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Builder
          </button>
          <button 
            onClick={() => onNavigate('deployment')} 
            className={`whitespace-nowrap px-3 py-1 rounded-full font-semibold transition-all ${
              currentView === 'deployment' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deploy
          </button>
          <button 
            onClick={() => onNavigate('analytics')} 
            className={`whitespace-nowrap px-3 py-1 rounded-full font-semibold transition-all ${
              currentView === 'analytics' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => onNavigate('my_widgets')} 
            className={`whitespace-nowrap px-3 py-1 rounded-full font-semibold transition-all ${
              currentView === 'my_widgets' ? 'bg-[#D6F938] text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Widgets
          </button>

          <button 
            onClick={onOpenNotifications} 
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1 shrink-0"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Alerts</span>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-600 text-white font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
