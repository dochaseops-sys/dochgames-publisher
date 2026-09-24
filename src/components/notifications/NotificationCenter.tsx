import React, { useState, useMemo } from 'react';
import { 
  Bell, Check, CheckCheck, Trash2, X, Sparkles, 
  DollarSign, Play, Globe, ExternalLink, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { PlatformNotification, UserProfile } from '../../types';

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

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const displayedNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  if (!isOpen) return null;

  const renderIcon = (notif: PlatformNotification) => {
    if (notif.category === 'revenue') {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <DollarSign className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (notif.title.toLowerCase().includes('milestone') || notif.title.toLowerCase().includes('play')) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Play className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (notif.title.toLowerCase().includes('website') || notif.title.toLowerCase().includes('domain')) {
      return (
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4" />
        </div>
      );
    }
    if (notif.title.toLowerCase().includes('game') || notif.title.toLowerCase().includes('catalogue')) {
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
    );
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 5) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-slate-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D6F938] text-slate-950">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Updates about your widgets, traffic, and earnings</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {displayedNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-700">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {filter === 'unread' 
                  ? 'You have no unread notifications right now.'
                  : 'You have no notifications at this time.'}
              </p>
            </div>
          ) : (
            displayedNotifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 transition-colors flex items-start gap-3.5 ${
                  notif.read ? 'bg-white' : 'bg-blue-50/40'
                }`}
              >
                {/* Icon */}
                {renderIcon(notif)}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                        {notif.actor?.name || 'DochGames'}
                      </span>
                      <h3 className={`text-xs font-bold truncate ${notif.read ? 'text-slate-800' : 'text-slate-950 font-black'}`}>
                        {notif.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-2">
                      {formatTimestamp(notif.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {notif.actionLabel && notif.actionView ? (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(notif.actionView!);
                          onClose();
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <span>{notif.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : <span />}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(notif.id)}
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-700"
                        title={notif.read ? 'Mark unread' : 'Mark read'}
                      >
                        {notif.read ? 'Mark unread' : 'Mark read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(notif.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>{notifications.length} total updates</span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-slate-500 hover:text-rose-600 font-semibold"
            >
              Clear all
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationCenter;
