import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, LayoutDashboard, PlusCircle, Megaphone, Vote, FileText, 
  Heart, ShieldAlert, Wrench, ShoppingBag, Package, Phone, 
  User, Settings, HelpCircle, Info, LogOut, X, Bell, UserPlus, LogIn
} from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser, logout } from '../db';
import { useLanguage, translations } from '../LanguageContext';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { path, navigateTo } = useRouter();
  const currentUser = getCurrentUser();
  const { t } = useLanguage();

  const menuItems: Array<{ labelKey: keyof typeof translations.en; href: string; icon: React.ReactNode }> = [
    { labelKey: 'home', href: '/', icon: <Home size={16} /> },
    { labelKey: 'dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { labelKey: 'report', href: '/create', icon: <PlusCircle size={16} /> },
    { labelKey: 'announcements', href: '/announcements', icon: <Megaphone size={16} /> },
    { labelKey: 'polls', href: '/polls', icon: <Vote size={16} /> },
    { labelKey: 'feed', href: '/complaints', icon: <FileText size={16} /> },
    { labelKey: 'bloodDonors', href: '/blood-donors', icon: <Heart size={16} className="text-red-500 fill-red-100" /> },
    { labelKey: 'alerts', href: '/alerts', icon: <ShieldAlert size={16} className="text-amber-500" /> },
    { labelKey: 'helpers', href: '/helpers', icon: <Wrench size={16} /> },
    { labelKey: 'marketplace', href: '/marketplace', icon: <ShoppingBag size={16} /> },
    { labelKey: 'lostFound', href: '/lost-found', icon: <Package size={16} /> },
    { labelKey: 'emergency', href: '/emergency', icon: <Phone size={16} /> },
    { labelKey: 'profile', href: '/profile', icon: <User size={16} /> },
    { labelKey: 'settings', href: '/settings', icon: <Settings size={16} /> },
    { labelKey: 'help', href: '/help', icon: <HelpCircle size={16} /> },
    { labelKey: 'about', href: '/about', icon: <Info size={16} /> },
  ];

  const handleNavigate = (href: string) => {
    navigateTo(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigateTo('/');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return path === '/';
    }
    return path.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay with smooth opacity fade */}
          <motion.div 
            id="nav-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-40 cursor-pointer"
          />

          {/* Sliding Navigation Drawer Panel */}
          <motion.div
            id="nav-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute right-0 top-0 bottom-0 w-[290px] bg-white shadow-2xl z-50 flex flex-col h-full border-l border-slate-100 select-none overflow-hidden font-sans"
          >
            {/* Drawer Header - User Info */}
            <div className="p-4.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shrink-0 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-[9px] bg-white/20 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {t('appName')} Citizen Portal
                </span>
                <button 
                  id="btn-close-drawer"
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-150 cursor-pointer"
                >
                  <X size={15} className="stroke-[2.5px]" />
                </button>
              </div>

              {currentUser ? (
                <div className="flex gap-3 items-center relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-white/30 overflow-hidden shadow-md bg-white">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-xs tracking-tight truncate leading-none">
                      {currentUser.name}
                    </h3>
                    <p className="text-[9px] text-blue-100 font-medium truncate mt-1 flex items-center gap-0.5">
                      <Home size={8} />
                      {currentUser.area}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-center relative z-10">
                  <div className="w-11 h-11 rounded-full border-2 border-white/30 bg-blue-100 flex items-center justify-center text-blue-700 shadow-md">
                    <User size={20} className="stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs leading-none">Guest Resident</h3>
                    <p className="text-[9px] text-blue-100 font-medium mt-1">Ward 4, Bengaluru</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5 no-scrollbar">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-1.5 block">
                Menu Directory
              </span>

              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <button
                    key={item.labelKey}
                    onClick={() => handleNavigate(item.href)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full ${
                      active 
                        ? 'bg-blue-50/80 text-blue-700 border-l-4 border-blue-600 pl-2' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className={active ? 'text-blue-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="tracking-tight">{t(item.labelKey)}</span>
                  </button>
                );
              })}

              {/* Authentication Settings / Actions Segment */}
              <div className="border-t border-slate-100 mt-4 pt-3">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pl-3 mb-1.5 block">
                  Account Segment
                </span>

                {currentUser ? (
                  <>
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full ${
                        isActive('/profile') ? 'bg-blue-50/80 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User size={16} className="text-slate-400" />
                      <span>{t('profile')}</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full text-slate-600 hover:bg-slate-50"
                    >
                      <Bell size={16} className="text-slate-400" />
                      <span>Notifications</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>{t('logout')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigate('/login')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full text-slate-600 hover:bg-slate-50"
                    >
                      <LogIn size={16} className="text-slate-400" />
                      <span>{t('login')}</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('/register')}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left w-full text-slate-600 hover:bg-slate-50"
                    >
                      <UserPlus size={16} className="text-slate-400" />
                      <span>{t('register')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Footer Tag */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <span className="text-[9px] text-slate-400 font-bold tracking-wide block">
                {t('appName')} v1.4.0 • Ward 4
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
