import React, { useState, useEffect } from 'react';
import { useRouter } from '../router';
import { getCurrentUser, getComplaints, ANNOUNCEMENTS, getCitizenScoreAndRank } from '../db';
import { 
  LayoutDashboard, AlertCircle, CheckCircle2, Award, ArrowRight, Plus, 
  Eye, MapPin, Shield, Activity, Flame, Building, Megaphone, Phone, 
  ExternalLink, Check, Volume2, Info, Briefcase, Vote, PackageOpen, PhoneCall,
  Droplet, ShieldAlert, Heart, ShoppingBag, Bell, Users, Sparkles
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const DashboardView: React.FC = () => {
  const { navigateTo } = useRouter();
  const currentUser = getCurrentUser();
  const allComplaints = getComplaints();
  const { t, language } = useLanguage();
  
  // Local interactive states
  const [registeredAnnouncements, setRegisteredAnnouncements] = useState<string[]>([]);
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Clear simulated call after 4 seconds
  useEffect(() => {
    if (activeCall) {
      const timer = setTimeout(() => setActiveCall(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCall]);

  // Clear copy indicator after 2 seconds
  useEffect(() => {
    if (copiedNumber) {
      const timer = setTimeout(() => setCopiedNumber(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedNumber]);

  // Filter complaints created by this user
  const userComplaints = allComplaints.filter(c => c.creatorId === (currentUser?.id || 'arjun_kumar'));

  const complaintsCount = currentUser?.complaintsCount ?? userComplaints.length;
  const resolvedCount = currentUser?.resolvedCount ?? userComplaints.filter(c => c.status === 'Resolved').length;

  // Extract ward and location dynamically
  const getWardAndLocation = () => {
    if (!currentUser?.area) return { ward: '4', location: 'Chennai' };
    const parts = currentUser.area.split(',');
    const wardPart = parts[0]?.trim() || 'Ward 4';
    const wardNumber = wardPart.replace(/\D/g, '') || '4';
    const locationPart = parts[1]?.trim() || 'Chennai';
    return { ward: wardNumber, location: locationPart };
  };
  const { ward, location: userLoc } = getWardAndLocation();

  return (
    <div id="dashboard-view" className="flex flex-col gap-6 p-4 pb-12 font-sans">
      {/* Greeting Card - Premium Polished Style */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-5 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden transition-all duration-300 hover:shadow-xl active:scale-[0.99]">
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full translate-x-4 -translate-y-4"></div>
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt="User Avatar"
            className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Welcome Back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Praveen'} 👋
            </h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-blue-100 font-medium font-sans">
              <span>📍 Ward {ward} • {userLoc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t('quickActions')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            id="dash-action-create"
            onClick={() => navigateTo('/create')}
            className="bg-blue-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-blue-200/30 hover:bg-blue-700 active:scale-95 transition-all duration-150 cursor-pointer border border-blue-600"
          >
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center mb-2 text-white">
              <Plus size={20} />
            </div>
            <span className="text-xs font-semibold">{t('reportNewIssue')}</span>
          </button>

          <button
            id="dash-action-feed"
            onClick={() => navigateTo('/complaints')}
            className="bg-white text-slate-800 border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center mb-2 text-slate-600">
              <Eye size={20} />
            </div>
            <span className="text-xs font-semibold">{t('exploreCommunity')}</span>
          </button>
        </div>
      </div>

      {/* Realistic Dashboard Stats Metrics Summary Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Ward Analytics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs hover:border-blue-500 hover:shadow-sm transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <AlertCircle size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-none">12</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1.5 leading-tight">Active Complaints</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs hover:border-blue-500 hover:shadow-sm transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-none">48</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1.5 leading-tight">Resolved Complaints</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Services Hub */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Community Hub</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: language === 'ta' ? 'குறையை பதிவிடு' : 'Report Issue', path: '/create', icon: Plus, bg: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
            { label: language === 'ta' ? 'இரத்த தானம்' : 'Blood Donors', path: '/blood-donors', icon: Droplet, bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
            { label: language === 'ta' ? 'அறிவிப்புகள்' : 'Area Alerts', path: '/alerts', icon: ShieldAlert, bg: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
            { label: language === 'ta' ? 'அவசர எண்கள்' : 'Emergency', path: '/emergency', icon: PhoneCall, bg: 'bg-red-50 text-red-600', border: 'border-red-100' },
            { label: language === 'ta' ? 'ஆலோசனைகள்' : 'Suggestions', path: '/suggestions', icon: Sparkles, bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
            { label: language === 'ta' ? 'தன்னார்வலர்கள்' : 'Volunteers', path: '/volunteers', icon: Heart, bg: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
            { label: language === 'ta' ? 'சந்தை பகுதி' : 'Marketplace', path: '/marketplace', icon: ShoppingBag, bg: 'bg-teal-50 text-teal-600', border: 'border-teal-100' },
            { label: language === 'ta' ? 'அறிவிப்பு பெட்டி' : 'Notifications', path: '/notifications', icon: Bell, bg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
            { label: language === 'ta' ? 'குழுக்கள்' : 'Area Groups', path: '/groups', icon: Users, bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' },
            { label: language === 'ta' ? 'மாற்றங்கள்' : 'Impact Gallery', path: '/impact', icon: CheckCircle2, bg: 'bg-emerald-150/10 text-emerald-700', border: 'border-emerald-150/20' },
            { label: language === 'ta' ? 'மதிப்பீடு' : 'Leaderboard', path: '/leaderboard', icon: Award, bg: 'bg-amber-100/40 text-amber-800', border: 'border-amber-200' },
            { label: language === 'ta' ? 'வார்டு விபரம்' : 'Know Your Ward', path: '/ward', icon: MapPin, bg: 'bg-blue-100/30 text-blue-800', border: 'border-blue-200' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigateTo(item.path)}
                className="bg-white border border-slate-200 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-blue-500 hover:shadow-xs active:scale-95 transition-all duration-150 cursor-pointer w-full h-[88px] box-border"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 shrink-0 ${item.bg} border ${item.border}`}>
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-semibold text-slate-800 leading-tight block break-words max-w-full font-sans line-clamp-2">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={14} className="text-rose-600" />
            {t('emergencyContactsTitle')}
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">24/7 Support</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Ward Police', num: '112', desc: 'Emergency response patrol', icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { name: 'Namma Ambulance', num: '108', desc: 'Arogya Kavacha trauma', icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { name: 'Fire Department', num: '101', desc: 'State fire & rescue force', icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { name: 'BBMP Control Room', num: '080-22221188', desc: 'Municipality emergency support', icon: Building, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          ].map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all duration-150 relative overflow-hidden"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border mb-2.5 ${contact.color}`}>
                    <Icon size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{contact.name}</h4>
                  <p className="text-[9px] text-slate-500 leading-normal mt-0.5 min-h-[24px] font-medium">{contact.desc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between gap-1">
                  <span className="font-mono text-[11px] font-bold text-slate-700 tracking-tight">{contact.num}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(contact.num);
                        setCopiedNumber(contact.num);
                      }}
                      className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer transition-all duration-100"
                      title="Copy Number"
                    >
                      {copiedNumber === contact.num ? <Check size={12} className="text-emerald-600 stroke-[2.5px]" /> : <ExternalLink size={12} />}
                    </button>
                    <button
                      onClick={() => setActiveCall(contact.name + " (" + contact.num + ")")}
                      className="p-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer transition-all duration-100"
                      title="Simulate Call"
                    >
                      <Phone size={12} className="stroke-[2.5px]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Announcements Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Megaphone size={14} className="text-blue-600" />
            {t('announcementsTitle')}
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {ANNOUNCEMENTS.length} New
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {ANNOUNCEMENTS.map((ann) => {
            const isRegistered = registeredAnnouncements.includes(ann.id);
            return (
              <div 
                key={ann.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row hover:border-slate-300 transition-all duration-200"
              >
                {/* Image Section */}
                <div className="h-32 sm:w-32 bg-slate-100 relative shrink-0">
                  <img 
                    src={ann.image} 
                    alt={ann.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur text-white text-[8px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                    {ann.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 font-semibold block mb-1">{ann.date}</span>
                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{ann.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2 font-medium">{ann.description}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[9px] text-slate-400 font-semibold">Ward Updates</span>
                    <button 
                      onClick={() => {
                        if (isRegistered) {
                          setRegisteredAnnouncements(prev => prev.filter(id => id !== ann.id));
                        } else {
                          setRegisteredAnnouncements(prev => [...prev, ann.id]);
                        }
                      }}
                      className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-all duration-150 cursor-pointer ${
                        isRegistered 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {isRegistered ? (
                        <span className="flex items-center gap-1">
                          <Check size={11} className="stroke-[3px]" />
                          Saved
                        </span>
                      ) : (
                        ann.actionText || 'Read Update'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Active Call Simulator Toast */}
      {activeCall && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center animate-pulse">
              <Phone size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-rose-400 tracking-wider block animate-pulse">
                Simulating Call...
              </span>
              <p className="text-xs font-bold text-slate-200">Connecting to {activeCall}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveCall(null)}
            className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 cursor-pointer"
          >
            End
          </button>
        </div>
      )}

      {/* Floating Copy Confirmation Toast */}
      {copiedNumber && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl px-4 py-2 text-[10px] font-bold shadow-xl z-50 flex items-center gap-1.5 border border-slate-800 animate-in fade-in zoom-in duration-200">
          <Check size={12} className="text-emerald-500 stroke-[3px]" />
          <span>Copied {copiedNumber} to clipboard!</span>
        </div>
      )}

      {/* Stats Cards Section */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Progress</h3>
        <div className="flex flex-col gap-3">
          {/* Complaints Submitted Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div className="flex gap-3.5 items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Complaints Submitted</span>
                <span className="text-xl font-bold text-slate-900">{complaintsCount}</span>
              </div>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Active Area
            </span>
          </div>

          {/* Complaints Resolved Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-3.5 items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Complaints Resolved</span>
                  <span className="text-xl font-bold text-slate-900">{resolvedCount}</span>
                </div>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">
                {complaintsCount > 0 ? Math.round((resolvedCount / complaintsCount) * 100) : 100}% Done
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${complaintsCount > 0 ? (resolvedCount / complaintsCount) * 100 : 100}%` }}
              ></div>
            </div>
          </div>

          {/* Contributions Card */}
          {(() => {
            const scoreInfo = getCitizenScoreAndRank(currentUser?.id || 'arjun_kumar');
            return (
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4.5 shadow-md flex justify-between items-center relative overflow-hidden">
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="flex gap-3.5 items-center relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/25 text-white flex items-center justify-center border border-white/20">
                    <Award size={22} className="text-yellow-200 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider block">Citizen Civic Standing</span>
                    <span className="text-lg font-bold block leading-none mt-1">{scoreInfo.score} Points</span>
                    <span className="text-[10px] text-orange-50 font-bold block mt-1">{scoreInfo.title}</span>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider block">Ward Rank</span>
                  <span className="text-xl font-bold block leading-none mt-1">#{scoreInfo.rank}</span>
                  <span className="text-[8px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                    Top 3%
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* User Reported Complaints List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Reported Issues</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{userComplaints.length} Total</span>
        </div>

        {userComplaints.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-slate-500 text-xs font-medium">You have not submitted any complaints yet.</p>
            <button
              onClick={() => navigateTo('/create')}
              className="mt-3 text-xs text-blue-600 font-bold hover:underline cursor-pointer focus:outline-none"
            >
              Submit your first complaint <ArrowRight size={12} className="inline" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {userComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo(`/complaints/${item.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex gap-3 cursor-pointer hover:border-blue-600 hover:shadow-md transition-all duration-150"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.status === 'Resolved' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : item.status === 'In Progress'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-50">
                    <span className="text-[9px] text-slate-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] text-blue-600 font-bold">
                      {item.upvotes} Upvotes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
