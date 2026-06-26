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

      <div className="flex items-center gap-2">
        {/* Instant Language Switcher */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 select-none bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`hover:text-blue-600 transition-colors cursor-pointer ${language === 'en' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            EN
          </button>
          <span className="text-slate-200">|</span>
          <button
            onClick={() => setLanguage('ta')}
            className={`hover:text-blue-600 transition-colors cursor-pointer ${language === 'ta' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            தமிழ்
          </button>
        </div>

        {/* Dynamic Notification Badge */}
        <button
          id="btn-header-notifications"
          onClick={() => navigateTo('/notifications')}
          className="relative flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-150 cursor-pointer active:scale-95"
          title="Notifications"
        >
          <span>🔔</span>
          <span className="text-slate-800 font-sans font-bold">{unreadCount}</span>
        </button>

        {currentUser ? (
          <button
            id="btn-header-profile"
            onClick={() => navigateTo('/profile')}
            className="w-7 h-7 rounded-full border border-slate-200 overflow-hidden cursor-pointer shadow-sm focus:outline-none hover:border-blue-600 active:scale-95 transition-transform"
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
            <User size={18} />
          </button>
        )}
        
        <button 
          id="btn-header-menu"
          className="text-slate-600 hover:text-blue-600 cursor-pointer focus:outline-none active:scale-95 transition-transform"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
};
