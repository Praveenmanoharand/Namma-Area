import React from 'react';
import { 
  ArrowLeft, Info, Heart, Award, MapPin, 
  Users, CheckCircle, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useRouter } from '../router';

export const AboutView: React.FC = () => {
  const { goBack, navigateTo } = useRouter();

  return (
    <div className="p-4 flex flex-col gap-5 min-h-screen pb-24">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <button 
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-all duration-150"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <Info size={16} className="text-blue-600 animate-pulse" />
            About Namma Area
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Democratic Smart Ward Platform
          </p>
        </div>
      </div>

      {/* Hero Banner with Map Pin */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-3">
        <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15">
          <MapPin size={100} className="text-blue-500 fill-blue-500" />
        </div>
        <div className="relative z-10">
          <span className="text-[8px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            Initiative Overview
          </span>
          <h4 className="font-extrabold text-white text-sm mt-2 leading-tight">
            Namma Area: Ward 4, Indiranagar, Bengaluru
          </h4>
          <p className="text-[10px] text-slate-300 mt-1 leading-relaxed font-semibold">
            An award-winning neighborhood civic portal connecting local residents with BBMP corporators, service technicians, and medical resources directly.
          </p>
        </div>
      </div>

      {/* Brand Design Language Showcase CTA */}
      <button 
        id="btn-about-brand-identity"
        onClick={() => navigateTo('/brand')}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4.5 shadow-md flex items-center justify-between text-left cursor-pointer hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 select-none relative overflow-hidden group"
      >
        <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-all duration-500"></div>
        <div className="relative z-10 pr-2">
          <span className="text-[8px] bg-white/20 text-white font-black px-2 py-0.5 rounded uppercase tracking-widest">
            Design & Culture
          </span>
          <h4 className="font-black text-xs text-white mt-1.5 leading-tight">
            Explore Brand Identity & Logo
          </h4>
          <p className="text-[9px] text-blue-100 mt-1 font-bold">
            Understand the Tamil "ந", House Roof, and Circle geometry.
          </p>
        </div>
        <div className="bg-white/10 p-2.5 rounded-xl border border-white/25 shrink-0 hover:bg-white/20 transition-all">
          <Sparkles size={16} className="text-amber-300 fill-amber-300" />
        </div>
      </button>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
          <Users size={16} className="text-blue-600 mx-auto mb-1" />
          <span className="text-[8px] text-slate-400 font-bold uppercase block">Residents</span>
          <span className="text-xs font-black text-slate-800 mt-0.5 block">14,200+</span>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
          <CheckCircle size={16} className="text-emerald-600 mx-auto mb-1" />
          <span className="text-[8px] text-slate-400 font-bold uppercase block">Resolved</span>
          <span className="text-xs font-black text-slate-800 mt-0.5 block">1,890+</span>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl text-center shadow-xs">
          <Award size={16} className="text-amber-500 mx-auto mb-1" />
          <span className="text-[8px] text-slate-400 font-bold uppercase block">Volunteers</span>
          <span className="text-xs font-black text-slate-800 mt-0.5 block">320+</span>
        </div>
      </div>

      {/* Objective section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-black text-slate-950 flex items-center gap-1.5 uppercase tracking-wide">
          <Sparkles size={14} className="text-blue-600" />
          Our Mission Objectives
        </h3>

        <div className="flex flex-col gap-2.5 text-[10px] text-slate-600 font-semibold leading-relaxed">
          <div className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
            <p><strong>Absolute Grievance Transparency</strong>: Track resolution states for pothole repairs, street light replacements, and garbage clearance live on-chain with timestamps and officer photos.</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
            <p><strong>Strengthen Local Economy</strong>: Provide free, community-curated job boards for domestic helpers and marketplace boards for garages.</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
            <p><strong>Decentralized Emergency Support</strong>: Crowdsource blood networks and real-time safety alert systems directly managed by ward safety officers.</p>
          </div>
        </div>
      </div>

      {/* Administrative info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <ShieldCheck size={14} className="text-emerald-600" />
          BBMP Administrative Info
        </h3>
        <div className="text-[9px] text-slate-500 font-semibold flex flex-col gap-2">
          <div>
            <span className="font-bold text-slate-700 block">BBMP Ward Office Address</span>
            <span>Indiranagar Ward 4 corporator desk, 12th Main Road, Opp Metro Station, Bengaluru - 560038</span>
          </div>
          <div>
            <span className="font-bold text-slate-700 block">Joint Commissioner (East Zone)</span>
            <span>Shri. G. Somasekhar, IAS</span>
          </div>
        </div>
      </div>

      {/* Crafted credit */}
      <div className="text-center py-2 text-[9px] text-slate-400 font-bold flex items-center justify-center gap-1">
        <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
        <span>Made with love for Bengaluru</span>
      </div>
    </div>
  );
};
