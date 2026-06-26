import React, { useState } from 'react';
import { useRouter } from '../router';
import { 
  getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationsCount 
} from '../db_extended';
import { 
  Bell, FileText, ShieldAlert, Megaphone, Vote, CheckCheck, ChevronLeft, Inbox
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const NotificationsView: React.FC = () => {
  const { goBack, navigateTo } = useRouter();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(getNotifications());
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = getUnreadNotificationsCount();

  const handleMarkRead = (id: string, relatedId?: string, type?: string) => {
    markNotificationAsRead(id);
    const updated = getNotifications();
    setNotifications(updated);
    
    // Auto navigate if there is a related route
    if (relatedId) {
      if (type === 'complaint') {
        navigateTo(`/complaints/${relatedId}`);
      } else if (type === 'poll') {
        navigateTo('/polls');
      }
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <FileText size={16} className="text-blue-500" />;
      case 'alert':
        return <ShieldAlert size={16} className="text-amber-500" />;
      case 'announcement':
        return <Megaphone size={16} className="text-teal-500" />;
      case 'poll':
        return <Vote size={16} className="text-purple-500" />;
      case 'emergency':
        return <ShieldAlert size={16} className="text-rose-600" />;
      default:
        return <Bell size={16} className="text-slate-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'complaint': return 'Complaint Update';
      case 'alert': return 'Area Alert';
      case 'announcement': return 'Civic Announcement';
      case 'poll': return 'Poll Update';
      case 'emergency': return 'Emergency Alert';
      default: return 'Notification';
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-white border-slate-100';
    switch (type) {
      case 'emergency': return 'bg-rose-50/50 border-rose-100 ring-1 ring-rose-600/5';
      case 'alert': return 'bg-amber-55/10 border-amber-100';
      default: return 'bg-blue-50/30 border-blue-50';
    }
  };

  return (
    <div id="notifications-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button 
          onClick={goBack}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ChevronLeft size={16} className="stroke-[2.5px]" />
          <span>{t('back')}</span>
        </button>
        <h1 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Bell size={14} className="text-blue-600" />
          Notification Center
        </h1>
        <div className="w-12"></div> {/* Spacer for symmetry */}
      </div>

      {/* Tabs and Actions */}
      <div className="flex justify-between items-center bg-slate-50 p-1 rounded-xl">
        <div className="flex gap-1 flex-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Updates ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
              activeTab === 'unread' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {unreadCount > 0 && (
        <button
          onClick={handleMarkAllRead}
          className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-[10px] font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <CheckCheck size={14} className="text-blue-600 stroke-[2.5px]" />
          Mark all as read
        </button>
      )}

      {/* Notifications List */}
      <div className="flex flex-col gap-3 mt-1">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Inbox size={22} />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold">No updates found</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">You are all caught up on your neighborhood updates!</p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id, notif.relatedId, notif.type)}
              className={`p-3.5 rounded-2xl border transition-all duration-150 relative cursor-pointer hover:shadow-xs flex gap-3 ${getBgColor(notif.type, notif.read)}`}
            >
              {/* Icon Container */}
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(notif.type)}
              </div>

              {/* Text Area */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    notif.type === 'emergency' ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {getTypeLabel(notif.type)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className={`text-xs font-bold text-slate-900 mt-1 ${!notif.read ? 'pr-3' : ''}`}>
                  {notif.title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                  {notif.description}
                </p>
                
                {notif.relatedId && (
                  <span className="text-[9px] text-blue-600 font-bold mt-2.5 inline-flex items-center gap-0.5 hover:underline">
                    View Details &rarr;
                  </span>
                )}
              </div>

              {/* Unread blue dot indicator */}
              {!notif.read && (
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full absolute top-3.5 right-3.5 ring-4 ring-blue-50" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
