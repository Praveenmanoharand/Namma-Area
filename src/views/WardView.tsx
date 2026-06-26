import React from 'react';
import { useRouter } from '../router';
import { getWardProjects } from '../db_extended';
import { 
  ChevronLeft, Info, Map, User, ShieldCheck, Mail, Calendar, TrendingUp, CheckCircle, BarChart2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const WardView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();

  const projects = getWardProjects();

  const councillor = {
    name: "Rajesh Gowda",
    role: "Ward Councillor",
    ward: "Ward 4, Indiranagar East",
    email: "rajesh.gowda@bbmp.gov.in",
    phone: "+91 98450 12345",
    office: "Ward Office, 12th Main Road, Hal 2nd Stage, Indiranagar",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    message: "Welcome to Ward 4 community portal. My goal is to build a transparent, plastic-free, green, and water-sustainable Indiranagar with direct citizen support."
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Ongoing': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div id="ward-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
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
          Know Your Ward
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Councillor Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col gap-3.5">
        <div className="flex gap-3.5 items-center">
          <img
            src={councillor.avatar}
            alt={councillor.name}
            className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">{councillor.name}</h3>
            <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md inline-block mt-0.5 uppercase tracking-wider">{councillor.role}</span>
            <span className="text-[8px] text-slate-400 font-bold block mt-1">{councillor.ward}</span>
          </div>
        </div>

        {/* Councillor message quote */}
        <p className="text-[10px] text-slate-500 italic bg-slate-50/70 border border-slate-100 p-3 rounded-2xl leading-relaxed font-semibold">
          "{councillor.message}"
        </p>

        {/* Councillor contacts */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-[9px] text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <Mail size={11} className="text-slate-400 shrink-0" />
            <a href={`mailto:${councillor.email}`} className="hover:underline">{councillor.email}</a>
          </div>
          <div className="flex items-center gap-2">
            <User size={11} className="text-slate-400 shrink-0" />
            <span>Office: {councillor.office}</span>
          </div>
        </div>
      </div>

      {/* Ward Development Projects */}
      <div className="flex flex-col gap-3.5 mt-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <BarChart2 size={13} />
          Active Public Works ({projects.length})
        </h3>

        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3"
          >
            {/* Project status row */}
            <div className="flex justify-between items-center gap-2">
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-[10px] font-bold text-slate-800">{project.budget} Allocated</span>
            </div>

            {/* Core project info */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{project.title}</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-semibold">
                {project.description}
              </p>
            </div>

            {/* Progress bar (Only if ongoing) */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold uppercase">
                <span>Construction Progress</span>
                <span className="text-slate-800 font-bold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    project.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2.5 border-t border-slate-50 text-[8px] text-slate-400 font-semibold">
              <div>
                <span className="block uppercase font-bold text-[7px] tracking-wider text-slate-400">Authorized Agency</span>
                <span className="text-slate-700 font-bold block mt-0.5 truncate">{project.contractor}</span>
              </div>
              <div className="text-right">
                <span className="block uppercase font-bold text-[7px] tracking-wider text-slate-400">Expected Finish</span>
                <span className="text-slate-700 font-bold block mt-0.5">
                  {new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
