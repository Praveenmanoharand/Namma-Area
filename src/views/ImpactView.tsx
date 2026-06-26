import React, { useState } from 'react';
import { useRouter } from '../router';
import { getImpactItems } from '../db_extended';
import { ImpactItem } from '../types';
import { 
  ChevronLeft, Sparkles, MapPin, Calendar, CheckCircle, MessageSquare, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const ImpactView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();

  const [items] = useState<ImpactItem[]>(getImpactItems());
  const [activeImageState, setActiveImageState] = useState<Record<string, 'before' | 'after'>>({});

  const handleToggleState = (id: string, state: 'before' | 'after') => {
    setActiveImageState(prev => ({
      ...prev,
      [id]: state
    }));
  };

  return (
    <div id="impact-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
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
          <Sparkles size={14} className="text-emerald-600 fill-emerald-50" />
          Impact Gallery
        </h1>
        <div className="w-12"></div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-3xl p-4 flex flex-col gap-2">
        <h3 className="font-bold text-emerald-850 text-xs flex items-center gap-1.5">
          <CheckCircle size={14} className="text-emerald-600 stroke-[2.5px]" />
          Resolutions that Matter
        </h3>
        <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
          Explore the before-and-after of complaints resolved in Indiranagar Ward 4. Real change driven by active citizen reporting and dedicated public work divisions!
        </p>
      </div>

      {/* Gallery Cards List */}
      <div className="flex flex-col gap-5 mt-1">
        {items.map((item) => {
          const currentView = activeImageState[item.id] || 'after'; // default to showing "after"
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col"
            >
              {/* Image Frame Container */}
              <div className="w-full h-44 relative bg-slate-900">
                <img
                  src={currentView === 'before' ? item.beforeImage : item.afterImage}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-300 brightness-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Before/After overlay pill */}
                <span className={`absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider text-white shadow-md ${
                  currentView === 'before' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {currentView === 'before' ? 'Before Repair' : 'After Repair'}
                </span>

                {/* Switch Controls Pill Overlay */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md p-1 rounded-xl flex gap-1">
                  <button
                    onClick={() => handleToggleState(item.id, 'before')}
                    className={`py-1.5 px-3 rounded-lg text-[8px] font-bold uppercase transition-all cursor-pointer ${
                      currentView === 'before' 
                        ? 'bg-rose-600 text-white' 
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => handleToggleState(item.id, 'after')}
                    className={`py-1.5 px-3 rounded-lg text-[8px] font-bold uppercase transition-all cursor-pointer ${
                      currentView === 'after' 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    After
                  </button>
                </div>
              </div>

              {/* Information Text Content */}
              <div className="p-4 flex flex-col gap-2.5">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[9px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" />
                      {item.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} className="text-slate-400" />
                      Resolved: {item.resolutionDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold pr-1">
                    {item.description}
                  </p>
                </div>

                {/* Responsible officer & user review feedback */}
                <div className="bg-slate-50 rounded-2xl p-3 mt-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-700 font-bold">
                    <ShieldCheck size={12} className="text-emerald-600 stroke-[2.5px]" />
                    <span>Overseen by: {item.officerName}</span>
                  </div>
                  <div className="flex gap-2 items-start border-t border-slate-100/60 pt-2 text-[9px] text-slate-500 italic font-medium">
                    <MessageSquare size={11} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>"{item.feedback}"</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
