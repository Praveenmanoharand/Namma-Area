import React from 'react';
import { LayoutDashboard, Compass, Plus, User } from 'lucide-react';
import { useRouter, RoutePath } from '../router';

export const BottomNavigation: React.FC = () => {
  const { path, navigateTo } = useRouter();

  const isTabActive = (tabPath: RoutePath): boolean => {
    if (tabPath === '/dashboard') {
      return path === '/dashboard' || path === '/';
    }
    if (tabPath === '/complaints') {
      return path === '/complaints' || path.startsWith('/complaints/');
    }
    return path === tabPath;
  };

  return (
    <nav id="bottom-nav-bar" className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 sticky bottom-0 z-30 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.03)] shrink-0 select-none">
      {/* 1. Home Tab */}
      <button
        id="nav-dashboard"
        onClick={() => navigateTo('/dashboard')}
        className={`flex flex-col items-center gap-0.5 flex-1 cursor-pointer focus:outline-none transition-all duration-200 active:scale-95 ${
          isTabActive('/dashboard') ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`transition-transform duration-200 ${isTabActive('/dashboard') ? 'scale-110' : 'scale-100'}`}>
          <LayoutDashboard size={21} className={isTabActive('/dashboard') ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
        </div>
        <span className="text-[10px] tracking-wide font-sans">Home</span>
        <div className={`w-1.5 h-1.5 rounded-full bg-blue-600 transition-all duration-200 ${isTabActive('/dashboard') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      </button>

      {/* 2. Feed Tab */}
      <button
        id="nav-reports"
        onClick={() => navigateTo('/complaints')}
        className={`flex flex-col items-center gap-0.5 flex-1 cursor-pointer focus:outline-none transition-all duration-200 active:scale-95 ${
          isTabActive('/complaints') ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`transition-transform duration-200 ${isTabActive('/complaints') ? 'scale-110' : 'scale-100'}`}>
          <Compass size={21} className={isTabActive('/complaints') ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
        </div>
        <span className="text-[10px] tracking-wide font-sans">Feed</span>
        <div className={`w-1.5 h-1.5 rounded-full bg-blue-600 transition-all duration-200 ${isTabActive('/complaints') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      </button>

      {/* 3. Floating Create Button */}
      <div className="flex-1 flex justify-center -mt-8 relative z-40">
        <button
          id="nav-create"
          onClick={() => navigateTo('/create')}
          className={`w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg transition-all duration-200 cursor-pointer focus:outline-none active:scale-95 ${
            isTabActive('/create') 
              ? 'bg-blue-700 scale-105 shadow-blue-300 ring-4 ring-blue-600/20' 
              : 'bg-blue-600 shadow-blue-200/80 hover:scale-105'
          }`}
        >
          <Plus size={28} className="stroke-[2.5px]" />
        </button>
      </div>

      {/* 4. Profile Tab */}
      <button
        id="nav-profile"
        onClick={() => navigateTo('/profile')}
        className={`flex flex-col items-center gap-0.5 flex-1 cursor-pointer focus:outline-none transition-all duration-200 active:scale-95 ${
          isTabActive('/profile') ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`transition-transform duration-200 ${isTabActive('/profile') ? 'scale-110' : 'scale-100'}`}>
          <User size={21} className={isTabActive('/profile') ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
        </div>
        <span className="text-[10px] tracking-wide font-sans">Profile</span>
        <div className={`w-1.5 h-1.5 rounded-full bg-blue-600 transition-all duration-200 ${isTabActive('/profile') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      </button>
    </nav>
  );
};
