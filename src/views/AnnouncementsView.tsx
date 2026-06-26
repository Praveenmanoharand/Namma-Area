import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Megaphone, Calendar, Tag, ShieldAlert, Droplet, 
  Flame, HardHat, Sparkles, Check, HeartHandshake, Info, Search 
} from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser } from '../db';
import { KeywordSearchIndex } from '../utils/searchIndex';

interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'Government Update' | 'Water Supply' | 'Electricity Maintenance' | 'Road Work' | 'Community Event';
  image: string;
  details?: string;
}

export const AnnouncementsView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [registeredAnnouncements, setRegisteredAnnouncements] = useState<string[]>([]);
  const [selectedAnn, setSelectedAnn] = useState<AnnouncementItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load registered list from localStorage on mount
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('registered_announcements') || '[]');
    setRegisteredAnnouncements(list);
  }, []);

  const handleRegister = (annId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid triggering card details click
    
    let updatedList = [...registeredAnnouncements];
    const index = updatedList.indexOf(annId);
    
    if (index > -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(annId);
    }
    
    localStorage.setItem('registered_announcements', JSON.stringify(updatedList));
    setRegisteredAnnouncements(updatedList);

    // Dynamic points update
    if (currentUser) {
      const currentPoints = currentUser.contributionsCount || 0;
      const change = index > -1 ? -15 : 15;
      const finalPoints = Math.max(0, currentPoints + change);
      
      // Update locally
      const updatedUser = { ...currentUser, contributionsCount: finalPoints };
      localStorage.setItem('namma_user', JSON.stringify(updatedUser));
      
      // Sync in users DB
      const users = JSON.parse(localStorage.getItem('namma_users_db') || '[]');
      const userIdx = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIdx !== -1) {
        users[userIdx] = updatedUser;
        localStorage.setItem('namma_users_db', JSON.stringify(users));
      }
    }
  };

  const SEED_ANNOUNCEMENTS: AnnouncementItem[] = [
    {
      id: 'ann_gov1',
      title: 'BBMP Ward Sabhe Meeting Scheduled',
      date: 'June 28, 10:30 AM',
      description: 'Monthly ward committee council sabhe at the BBMP Sector Office on 12th Main Road. Citizens are invited to raise solid waste and parking grievances.',
      category: 'Government Update',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
      details: 'Meeting will be chaired by our Ward Corporator along with Nodal Officers from BESCOM, BWSSB, and traffic police inspector.'
    },
    {
      id: 'ann_wat1',
      title: 'Water Supply Disruption Notice: Indiranagar Stage 2',
      date: 'June 26, 6:00 AM - 6:00 PM',
      description: 'BWSSB maintenance on the Kaveri trunk pipelines at Stage 2 pipeline junction. Water supplies will be paused. Residents are advised to store water in advance.',
      category: 'Water Supply',
      image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=400&q=80',
      details: 'Alternative tanker assistance can be requested via BWSSB emergency desk (Dial 1916). Repairs will finish by evening.'
    },
    {
      id: 'ann_ele1',
      title: 'Scheduled BESCOM Grid Line Upgrades',
      date: 'June 27, 9:00 AM - 4:00 PM',
      description: 'Critical transformer upgrades and high tension line spacing maintenance. Power interruptions scheduled across defense colony and central ward pockets.',
      category: 'Electricity Maintenance',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80',
      details: 'Line workers will replace overhead cables with safe insulated cables. Your cooperation is appreciated.'
    },
    {
      id: 'ann_rd1',
      title: 'Tarring & Trenching Work: Indiranagar 100ft Signal',
      date: 'Ongoing till June 30',
      description: 'BBMP road construction crew will overlay asphalt on potholed lanes near the main signal during night shifts. Divert via 12th main road during peak traffic hours.',
      category: 'Road Work',
      image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80',
      details: 'Work is being conducted strictly between 11 PM and 5 AM. Speed restrictions are in place during the daytime.'
    },
    {
      id: 'ann_com1',
      title: 'Defense Colony Lake Restoration Drive',
      date: 'June 28, 7:30 AM',
      description: 'Volunteer clean-up drive and sapling plantation around the Defense Colony lake belt. Gardening tools, heavy gloves, and light breakfast provided.',
      category: 'Community Event',
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80',
      details: 'A beautiful local civic initiative led by Sector 4 Resident Association. Earn +15 Contribution Points for participation.'
    }
  ];

  const categories = [
    { label: 'All', val: 'All', icon: Megaphone },
    { label: 'Govt', val: 'Government Update', icon: Info },
    { label: 'Water', val: 'Water Supply', icon: Droplet },
    { label: 'BESCOM', val: 'Electricity Maintenance', icon: Flame },
    { label: 'Roads', val: 'Road Work', icon: HardHat },
    { label: 'Events', val: 'Community Event', icon: Sparkles }
  ];

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Government Update': return { bg: 'bg-indigo-50 border-indigo-100 text-indigo-700', iconColor: 'text-indigo-600', label: 'Government' };
      case 'Water Supply': return { bg: 'bg-sky-50 border-sky-100 text-sky-700', iconColor: 'text-sky-600', label: 'Water Supply' };
      case 'Electricity Maintenance': return { bg: 'bg-amber-50 border-amber-100 text-amber-700', iconColor: 'text-amber-600', label: 'BESCOM Power' };
      case 'Road Work': return { bg: 'bg-rose-50 border-rose-100 text-rose-700', iconColor: 'text-rose-600', label: 'Road Work' };
      case 'Community Event': return { bg: 'bg-emerald-50 border-emerald-100 text-emerald-700', iconColor: 'text-emerald-600', label: 'Community Event' };
      default: return { bg: 'bg-slate-50 border-slate-100 text-slate-700', iconColor: 'text-slate-600', label: 'General' };
    }
  };

  const searchIndex = useMemo(() => {
    return new KeywordSearchIndex(SEED_ANNOUNCEMENTS, ['title', 'description', 'category', 'details']);
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const searched = searchIndex.search(searchTerm, SEED_ANNOUNCEMENTS);
    return searched.filter(ann => {
      if (activeFilter === 'All') return true;
      return ann.category === activeFilter;
    });
  }, [searchIndex, searchTerm, activeFilter]);

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
            <Megaphone size={16} className="text-blue-600" />
            Ward Announcements
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Critical Broadcast Board
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="announcements-search-input"
          type="text"
          placeholder="Search announcements by keyword, meeting, water..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Categories Filter Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = activeFilter === c.val;
          return (
            <button
              key={c.val}
              onClick={() => { setActiveFilter(c.val); setSelectedAnn(null); }}
              className={`flex items-center gap-1 px-3 py-2 text-[10px] font-black rounded-xl border shrink-0 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Icon size={12} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Details Dialog */}
      {selectedAnn && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[80vh]">
            <div className="h-40 bg-slate-100 relative">
              <img 
                src={selectedAnn.image} 
                alt={selectedAnn.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedAnn(null)}
                className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white p-1.5 rounded-full hover:bg-slate-900 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
              <div>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                  getCategoryTheme(selectedAnn.category).bg
                }`}>
                  {getCategoryTheme(selectedAnn.category).label}
                </span>
                <h3 className="font-extrabold text-slate-900 text-xs mt-2.5 leading-snug">{selectedAnn.title}</h3>
                <span className="text-[9px] text-slate-400 font-bold block mt-1">{selectedAnn.date}</span>
              </div>

              <div className="text-[11px] text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                <p>{selectedAnn.description}</p>
                {selectedAnn.details && (
                  <p className="pt-2 border-t border-slate-200 text-slate-500 font-medium">
                    {selectedAnn.details}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                  <span className="text-[10px] text-blue-800 font-bold">Earn 15 Contribution Points</span>
                </div>
                <button
                  onClick={(e) => {
                    handleRegister(selectedAnn.id, e);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide border cursor-pointer transition-all ${
                    registeredAnnouncements.includes(selectedAnn.id)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {registeredAnnouncements.includes(selectedAnn.id) ? 'Registered ✓' : 'Register to help'}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2">
              <button 
                onClick={() => setSelectedAnn(null)}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List Feed */}
      <div className="flex flex-col gap-3.5">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <ShieldAlert size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-800 text-sm font-bold">No announcements found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your keyword searches or filters</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const theme = getCategoryTheme(ann.category);
            const isRegistered = registeredAnnouncements.includes(ann.id);

            return (
              <div 
                key={ann.id}
                onClick={() => setSelectedAnn(ann)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-150 cursor-pointer flex flex-col"
              >
                <div className="h-24 bg-slate-100 relative">
                  <img 
                    src={ann.image} 
                    alt={ann.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-2.5 left-2.5 text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-xs shadow-md`}>
                    {theme.label}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block">{ann.date}</span>
                    <h4 className="font-extrabold text-slate-900 text-xs mt-1 leading-snug">{ann.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-1">{ann.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] text-blue-600 font-extrabold flex items-center gap-1">
                      <Megaphone size={11} />
                      Critical Notice
                    </span>

                    <button
                      onClick={(e) => handleRegister(ann.id, e)}
                      className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider cursor-pointer transition-all duration-150 ${
                        isRegistered 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {isRegistered ? (
                        <span className="flex items-center gap-1">
                          <Check size={11} className="stroke-[3px]" />
                          Registered
                        </span>
                      ) : (
                        'Register to help (+15 pts)'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
