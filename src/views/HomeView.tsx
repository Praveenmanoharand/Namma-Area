import React from 'react';
import { AlertCircle, CheckCircle2, Users, Building, ArrowRight, ShieldCheck, Calendar, Radio, Sparkles, MapPin } from 'lucide-react';
import { useRouter } from '../router';
import { getComplaints } from '../db';
import { ANNOUNCEMENTS, OPPORTUNITIES } from '../db';
import { useLanguage } from '../LanguageContext';

export const HomeView: React.FC = () => {
  const { navigateTo } = useRouter();
  const complaints = getComplaints().slice(0, 3); // Get first few complaints for recent reports
  const { t } = useLanguage();

  return (
    <div id="home-view" className="flex flex-col gap-6 p-4 pb-12 font-sans">
      {/* Official Badge */}
      <div className="flex justify-center mt-2">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold border border-blue-100 shadow-sm animate-pulse">
          <ShieldCheck size={14} className="text-blue-600" />
          {t('officialBadge')}
        </span>
      </div>

      {/* Hero Headline & Intro */}
      <div className="text-center px-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 leading-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-slate-600 text-xs mt-3 leading-relaxed font-medium max-w-sm mx-auto">
          {t('heroSubtitle')}
        </p>
      </div>

      {/* Primary Buttons */}
      <div className="flex flex-col gap-3 px-2">
        <button
          id="home-btn-report"
          onClick={() => navigateTo('/create')}
          className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-blue-200/50 cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          {t('reportAnIssue')}
        </button>
        <button
          id="home-btn-explore"
          onClick={() => navigateTo('/complaints')}
          className="w-full bg-white text-blue-600 border-2 border-blue-600 py-3.5 px-4 rounded-xl font-bold hover:bg-blue-50 active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          {t('exploreCommunity')}
        </button>
      </div>

      {/* Metrics Statistics Grid */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-100 transition-all duration-200">
          <AlertCircle size={24} className="text-blue-600 mb-2" />
          <span className="text-lg font-bold text-slate-900">1.2k+</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{t('issuesReported')}</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-100 transition-all duration-200">
          <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
          <span className="text-lg font-bold text-slate-900">850+</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{t('issuesResolved')}</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-100 transition-all duration-200">
          <Users size={24} className="text-teal-600 mb-2" />
          <span className="text-lg font-bold text-slate-900">5k+</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{t('activeCitizens')}</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-100 transition-all duration-200">
          <Building size={24} className="text-amber-600 mb-2" />
          <span className="text-lg font-bold text-slate-900">12</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{t('areasConnected')}</span>
        </div>
      </div>

      {/* Recent Reports section */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('recentReports')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('realTimeUpdates')}</p>
          </div>
          <button 
            id="home-btn-view-all-complaints"
            onClick={() => navigateTo('/complaints')}
            className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            {t('viewAll')} <ArrowRight size={14} />
          </button>
        </div>

        {/* Horizontal scroll of recent items */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x px-1">
          {complaints.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigateTo(`/complaints/${item.id}`)}
              className="min-w-[260px] max-w-[260px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-col snap-start cursor-pointer hover:border-blue-600 hover:shadow-md transition-all duration-200"
            >
              <div className="relative h-32 bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white ${
                  item.status === 'Resolved' ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {item.status === 'Resolved' ? t('resolved').toUpperCase() : 'URGENT'}
                </span>
              </div>
              <div className="p-3.5">
                <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">{item.description}</p>
                
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400" />
                    {item.location}
                  </span>
                  {/* Miniature progress bar */}
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.status === 'Resolved' ? 'bg-emerald-500 w-full' : 'bg-blue-600 w-1/2'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements section */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">{t('announcementsTitle')}</h2>
        <div className="flex flex-col gap-4">
          {ANNOUNCEMENTS.map((ann) => (
            <div 
              key={ann.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-600 transition-all duration-200"
            >
              <img 
                src={ann.image} 
                alt={ann.title} 
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-max mb-2">
                  {ann.category === 'Community Drive' ? <Calendar size={11} /> : <Radio size={11} />}
                  {ann.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{ann.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{ann.description}</p>
                <button
                  id={`btn-ann-action-${ann.id}`}
                  onClick={() => navigateTo('/register')}
                  className="mt-3.5 text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer focus:outline-none"
                >
                  {ann.actionText} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Opportunities section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1">Local Opportunities</h2>
        <p className="text-xs text-slate-500 mb-4 font-medium">Help build a better community or find work within your local area.</p>

        <div className="flex flex-col divide-y divide-slate-100">
          {OPPORTUNITIES.map((opp) => (
            <div key={opp.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{opp.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{opp.organization} • {opp.duration}</p>
                </div>
              </div>
              <button 
                id={`btn-opp-${opp.id}`}
                onClick={() => navigateTo('/register')}
                className="text-xs text-blue-600 font-bold border border-slate-200 hover:border-blue-600 px-3 py-1 rounded-lg cursor-pointer animate-none"
              >
                Apply
              </button>
            </div>
          ))}
        </div>

        <button
          id="btn-all-listings"
          onClick={() => navigateTo('/complaints')}
          className="w-full mt-4 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all duration-150 cursor-pointer"
        >
          View All Listings
        </button>
      </div>

      {/* Call to action card */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-blue-200/50 mt-2">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-700 rounded-full opacity-40"></div>
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-emerald-500 rounded-full opacity-20"></div>

        <h2 className="text-lg font-bold tracking-tight relative z-10">Ready to make a difference?</h2>
        <p className="text-blue-100 text-xs mt-2 max-w-xs mx-auto relative z-10 leading-relaxed font-medium">
          Join over 5,000 citizens who are actively working to improve their neighborhoods every single day.
        </p>

        <div className="flex flex-col gap-2.5 mt-5 relative z-10">
          <button
            id="home-cta-signup"
            onClick={() => navigateTo('/register')}
            className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-xs hover:bg-slate-100 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-md"
          >
            {t('register')}
          </button>
          <button
            id="home-cta-report"
            onClick={() => navigateTo('/create')}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-900 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-md"
          >
            {t('reportAnIssue')}
          </button>
        </div>
      </div>

      {/* Footer support links */}
      <footer className="mt-6 border-t border-slate-200 pt-6 px-2 text-center text-slate-500">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center justify-center gap-1.5">
          <MapPin size={16} className="text-blue-600 fill-blue-600" />
          {t('appName')}
        </h3>
        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-medium">
          Empowering citizens to build smarter, safer, and cleaner neighborhoods through digital collaboration and transparency.
        </p>
        
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-[11px] font-bold text-slate-600 max-w-xs mx-auto">
          <button onClick={() => navigateTo('/dashboard')} className="hover:text-blue-600 hover:underline cursor-pointer">How it Works</button>
          <button onClick={() => navigateTo('/complaints')} className="hover:text-blue-600 hover:underline cursor-pointer">Statistics</button>
          <button onClick={() => navigateTo('/profile')} className="hover:text-blue-600 hover:underline cursor-pointer">Privacy Policy</button>
          <button onClick={() => navigateTo('/login')} className="hover:text-blue-600 hover:underline cursor-pointer">Contact Us</button>
        </div>

        <div className="text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100 font-medium">
          © {new Date().getFullYear()} {t('appName')} Civic Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
