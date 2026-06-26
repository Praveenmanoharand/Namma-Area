import React from 'react';
import { useRouter } from '../router';
import { getCurrentUser, getComplaints } from '../db';
import { 
  ChevronLeft, Map, Star, Shield, Droplet, Trash2, Zap, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const MyAreaView: React.FC = () => {
  const { goBack, navigateTo } = useRouter();
  const { t } = useLanguage();
  const currentUser = getCurrentUser();
  const complaints = getComplaints();

  // Metrics specifically for Indiranagar Ward 4
  const areaName = "Indiranagar Layout";
  const wardNumber = "Ward 4";
  const councillorName = "Councillor Rajesh Gowda";
  const safetyScore = 88;
  const cleanlinessScore = 75;
  const waterScore = 92;
  const electricityStatus = "Stable • No maintenance planned";
  const areaRating = 4.4;

  const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div id="my-area-view" className="flex flex-col gap-6 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
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
          <Map size={14} className="text-blue-600" />
          My Area Dashboard
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Ward Info Header Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-5 translate-y-5 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
        <span className="text-[9px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
          Currently Viewing
        </span>
        <h2 className="text-base font-bold tracking-tight mt-1">{areaName}</h2>
        <p className="text-xs text-blue-100 mt-1 font-medium">{wardNumber} • BBMP Zone East</p>
        
        <div className="border-t border-white/10 mt-4 pt-3 flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] text-blue-200 block">Elected Representative</span>
            <span className="font-semibold">{councillorName}</span>
          </div>
          <button 
            onClick={() => navigateTo('/ward')}
            className="text-[10px] bg-white text-blue-700 font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-150 shadow-sm"
          >
            Ward Profile
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid (Active / Resolved / Area Rating) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-1.5">
            <AlertCircle size={15} />
          </div>
          <span className="text-[18px] font-bold text-slate-900 block leading-tight">{activeComplaints}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Active Issues</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <CheckCircle size={15} />
          </div>
          <span className="text-[18px] font-bold text-slate-900 block leading-tight">{resolvedComplaints}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Resolved</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-1.5">
            <Star size={15} className="fill-amber-400 text-amber-500" />
          </div>
          <span className="text-[18px] font-bold text-slate-900 block leading-tight">{areaRating}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Area Rating</span>
        </div>
      </div>

      {/* Scorecards (Bento Grid Style) */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Liveability Indexes</h3>
        <div className="flex flex-col gap-3.5">
          {/* Safety Score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Safety Index Score</h4>
                  <span className="text-[9px] text-slate-400 font-medium">Night lighting, CCTV density, & patrols</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">{safetyScore}%</span>
            </div>
            {/* Progress gauge bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${safetyScore}%` }}></div>
            </div>
          </div>

          {/* Cleanliness Score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Trash2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sanitation & Cleanliness</h4>
                  <span className="text-[9px] text-slate-400 font-medium">Garbage collection & public cleaning schedules</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">{cleanlinessScore}%</span>
            </div>
            {/* Progress gauge bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${cleanlinessScore}%` }}></div>
            </div>
          </div>

          {/* Water Supply Score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Droplet size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Water Supply & Drainage</h4>
                  <span className="text-[9px] text-slate-400 font-medium">Daily supply consistency & contamination checks</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">{waterScore}%</span>
            </div>
            {/* Progress gauge bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${waterScore}%` }}></div>
            </div>
          </div>

          {/* Grid Power Status Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Electricity & Power Grid</h4>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">{electricityStatus}</span>
              </div>
            </div>
            <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3.5 flex gap-2.5 items-start">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
          These scores are calculated algorithmically based on citizen feedback reports, grievance turnaround times, and official municipal sensor reports on the Ward 4 portal.
        </p>
      </div>
    </div>
  );
};

function councillorLabel() {
  return "Rajesh Gowda";
}
