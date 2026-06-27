import React from 'react';
import { Menu, User } from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser } from '../db';
import { NammaLogo } from './NammaLogo';
import { useLanguage } from '../LanguageContext';
import { getUnreadNotificationsCount } from '../db_extended';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { navigateTo, path } = useRouter();
  const currentUser = getCurrentUser();
  const { language, setLanguage } = useLanguage();
  const [unreadCount, setUnreadCount] = React.useState(3);

  React.useEffect(() => {
    setUnreadCount(getUnreadNotificationsCount());
  }, [path]);

  return (
    <header id="namma-header" className="bg-white border-b border-slate-100 px-3.5 py-3 flex justify-between items-center sticky top-0 z-30 shadow-sm shrink-0 font-sans">
      <button 
        id="btn-header-home"
        onClick={() => navigateTo('/')} 
        className="flex items-center gap-2 cursor-pointer focus:outline-none shrink-0"
      >
        <NammaLogo variant="navbar" />
      </button>

      <div className="flex items-center gap-3">
        {/* Dynamic Notification Badge */}
        <button
          id="btn-header-notifications"
          onClick={() => navigateTo('/notifications')}
          className="relative flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 cursor-pointer active:scale-95"
          title="Notifications"
        >
          <span>🔔</span>
          <span className="text-slate-800 font-sans font-bold">{unreadCount}</span>
        </button>

        {currentUser ? (
          <button
            id="btn-header-profile"
            onClick={() => navigateTo('/profile')}
            className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden cursor-pointer shadow-sm focus:outline-none hover:border-blue-600 active:scale-95 transition-transform"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <button
            id="btn-header-login"
            onClick={() => navigateTo('/login')}
            className="text-slate-600 hover:text-blue-600 cursor-pointer focus:outline-none active:scale-95 transition-transform"
          >
            <User size={24} />
          </button>
        )}
        
        <button 
          id="btn-header-menu"
          className="text-slate-600 hover:text-blue-600 cursor-pointer focus:outline-none active:scale-95 transition-transform flex items-center justify-center"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};
