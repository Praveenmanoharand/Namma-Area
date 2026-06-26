import React, { useEffect, useState } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [time, setTime] = useState('02:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 md:p-6 transition-colors duration-300">
      {/* Phone Case Mockup for Desktop */}
      <div className="relative w-full max-w-md h-screen md:h-[880px] md:rounded-[44px] md:border-[12px] md:border-slate-900 md:shadow-2xl bg-slate-50 flex flex-col overflow-hidden">
        {/* Notch & Speaker Grill for Desktop */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-slate-800 rounded-b-2xl z-50 items-center justify-center">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-1"></div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 text-slate-800 text-xs px-6 py-2 pt-3 flex justify-between items-center font-medium z-40 select-none border-b border-slate-100 shrink-0">
          <div>{time}</div>
          <div className="flex items-center gap-1.5">
            <Signal size={13} className="text-slate-800" />
            <Wifi size={13} className="text-slate-800" />
            <Battery size={15} className="text-slate-800" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-y-auto relative no-scrollbar">
          {children}
        </div>

        {/* Home Indicator Line for Desktop */}
        <div className="hidden md:flex bg-white h-5 items-center justify-center border-t border-slate-100 shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
