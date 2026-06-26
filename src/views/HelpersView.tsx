import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Star, ShieldCheck, Phone, MapPin, 
  Wrench, Hammer, Award, Sparkles, Check
} from 'lucide-react';
import { useRouter } from '../router';

interface Helper {
  id: string;
  name: string;
  role: 'Plumber' | 'Electrician' | 'Carpenter' | 'Appliance Repair' | 'Gardener';
  rating: number;
  reviewsCount: number;
  experience: string;
  location: string;
  phone: string;
  isVerified: boolean;
  avatar: string;
}

export const HelpersView: React.FC = () => {
  const { goBack } = useRouter();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const helpers: Helper[] = [
    {
      id: 'h1',
      name: 'Manjunath Swamy',
      role: 'Electrician',
      rating: 4.9,
      reviewsCount: 38,
      experience: '12 years exp',
      location: 'CMH Road, Indiranagar',
      phone: '9845022111',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'h2',
      name: 'Karthik Rao',
      role: 'Plumber',
      rating: 4.8,
      reviewsCount: 24,
      experience: '8 years exp',
      location: 'Hal 2nd Stage, Indiranagar',
      phone: '9900033111',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'h3',
      name: 'Basavaraj M.',
      role: 'Carpenter',
      rating: 4.7,
      reviewsCount: 45,
      experience: '15 years exp',
      location: 'Domlur Main Road',
      phone: '9740044111',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'h4',
      name: 'Yogesh Sharma',
      role: 'Appliance Repair',
      rating: 4.6,
      reviewsCount: 19,
      experience: '6 years exp',
      location: 'Defense Colony',
      phone: '9620055111',
      isVerified: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'h5',
      name: 'Muniraju Gowda',
      role: 'Gardener',
      rating: 4.9,
      reviewsCount: 52,
      experience: '20 years exp',
      location: 'Eshwara Temple Road',
      phone: '9510066111',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const roles = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Appliance Repair', 'Gardener'];

  const filteredHelpers = helpers.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                          h.location.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'All' ? true : h.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 flex flex-col gap-5 min-h-screen pb-24 relative">
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
            <Wrench size={16} className="text-blue-600" />
            Namma Trusted Helpers
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Vetted Service Providers
          </p>
        </div>
      </div>

      {/* Trust Notice Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[8px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
            Verified Local Hub
          </span>
          <h4 className="font-extrabold text-white text-xs mt-1.5 leading-snug">
            Verified by Residents
          </h4>
          <p className="text-[9px] text-blue-100 mt-0.5 leading-relaxed font-semibold">
            All listed partners have completed security background checks and are rated directly by neighborhood resident associations.
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <ShieldCheck size={24} className="text-emerald-300 animate-pulse" />
        </div>
      </div>

      {/* Search and Role Filter Chips */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search electrician, plumber, CMH Road..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Role:</span>
          <div className="flex gap-1.5 ml-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                  selectedRole === r 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Helpers list */}
      <div className="flex flex-col gap-3.5">
        {filteredHelpers.map((helper) => (
          <div 
            key={helper.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center hover:border-slate-300 transition-all duration-150"
          >
            <div className="flex gap-3.5 items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shrink-0">
                <img 
                  src={helper.avatar} 
                  alt={helper.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs tracking-tight flex items-center gap-1">
                  {helper.name}
                  {helper.isVerified && (
                    <ShieldCheck size={14} className="text-emerald-600 fill-emerald-50 shrink-0" title="Vetted Partner" />
                  )}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                    {helper.role}
                  </span>
                  <span className="text-[9px] font-extrabold text-amber-600 flex items-center gap-0.5">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    {helper.rating} ({helper.reviewsCount})
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold flex items-center gap-0.5 mt-1">
                  <MapPin size={10} className="text-slate-400" />
                  {helper.location} • {helper.experience}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveCall(`${helper.name} (${helper.phone})`)}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl cursor-pointer transition-all duration-150"
              title="Call Helper"
            >
              <Phone size={14} className="stroke-[2.5px]" />
            </button>
          </div>
        ))}
      </div>

      {/* Active Call Simulator Toast */}
      {activeCall && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
              <Phone size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-blue-400 tracking-wider block animate-pulse">
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
    </div>
  );
};
