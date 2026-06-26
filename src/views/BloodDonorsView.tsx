import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Heart, UserPlus, Phone, MapPin, 
  AlertCircle, Check, Award, FlameKindling, Droplet
} from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser } from '../db';

interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
  isAvailable: boolean;
  contributions: number;
}

export const BloodDonorsView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeCall, setActiveCall] = useState<string | null>(null);

  // Form states
  const [formGroup, setFormGroup] = useState('O+');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Initial donors seed
    const initialDonors: Donor[] = [
      { id: '1', name: 'Ramesh Gowda', bloodGroup: 'O+', location: 'Indiranagar 12th Cross', phone: '9845011111', isAvailable: true, contributions: 5 },
      { id: '2', name: 'Sneha Hegde', bloodGroup: 'A-', location: 'Defense Colony', phone: '9886022222', isAvailable: true, contributions: 3 },
      { id: '3', name: 'Vikram Singh', bloodGroup: 'B+', location: 'Domlur Stage 2', phone: '9900033333', isAvailable: true, contributions: 8 },
      { id: '4', name: 'Farhan Akhter', bloodGroup: 'AB+', location: 'Hal 2nd Stage', phone: '9740044444', isAvailable: false, contributions: 2 },
      { id: '5', name: 'Priya Narayanan', bloodGroup: 'O-', location: 'Indiranagar 100ft Road', phone: '9620055555', isAvailable: true, contributions: 6 },
    ];

    const stored = localStorage.getItem('namma_donors');
    if (stored) {
      setDonors(JSON.parse(stored));
    } else {
      localStorage.setItem('namma_donors', JSON.stringify(initialDonors));
      setDonors(initialDonors);
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newDonor: Donor = {
      id: 'donor_' + Date.now(),
      name: currentUser.name,
      bloodGroup: formGroup,
      location: formLocation || currentUser.area,
      phone: formPhone || currentUser.mobileNumber || '9999999999',
      isAvailable: true,
      contributions: 0,
    };

    const updated = [newDonor, ...donors];
    localStorage.setItem('namma_donors', JSON.stringify(updated));
    setDonors(updated);
    setRegistered(true);

    // Reward points for registering
    const currentPoints = currentUser.contributionsCount || 0;
    const updatedUser = { ...currentUser, contributionsCount: currentPoints + 20 };
    localStorage.setItem('namma_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('namma_users_db') || '[]');
    const userIdx = users.findIndex((u: any) => u.id === currentUser.id);
    if (userIdx !== -1) {
      users[userIdx] = updatedUser;
      localStorage.setItem('namma_users_db', JSON.stringify(users));
    }

    setTimeout(() => {
      setRegistered(false);
      setShowRegisterModal(false);
    }, 1500);
  };

  const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.location.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'All' ? true : d.bloodGroup === selectedGroup;
    return matchesSearch && matchesGroup;
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
            <Heart size={16} className="text-red-600 fill-red-100" />
            Namma Blood Network
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Lifesavers Registry
          </p>
        </div>
      </div>

      {/* Critical Request Alert */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-start gap-3">
        <AlertCircle className="text-red-600 shrink-0 mt-0.5 animate-pulse" size={16} />
        <div>
          <h4 className="font-extrabold text-[11px] uppercase tracking-wide">Emergency Request</h4>
          <p className="text-[10px] leading-relaxed text-red-700 mt-0.5 font-medium">
            Urgent requirement for O-negative blood at Chinmaya Mission Hospital (CMH) Indiranagar. Contact CMH Helpdesk or any donor below.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
        <div>
          <span className="text-[8px] text-slate-400 font-bold uppercase block">Active Volunteers</span>
          <span className="text-lg font-black text-slate-800">{donors.length} Donors</span>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-red-100 transition-all duration-150 cursor-pointer"
        >
          <UserPlus size={14} />
          Join Network (+20 pts)
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donors by name or cross road..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 font-semibold"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Group:</span>
          <div className="flex gap-1.5 ml-2">
            {bloodGroups.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                  selectedGroup === g 
                    ? 'bg-red-600 border-red-600 text-white shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div className="flex flex-col gap-3.5">
        {filteredDonors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
            <h4 className="font-extrabold text-slate-800 text-xs">No Donors Found</h4>
            <p className="text-[10px] text-slate-500 mt-1">Try another blood group or broaden search terms.</p>
          </div>
        ) : (
          filteredDonors.map((donor) => (
            <div 
              key={donor.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex justify-between items-center hover:border-slate-300 transition-all duration-150"
            >
              <div className="flex gap-3.5 items-center">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center shrink-0">
                  <Droplet size={14} className="text-red-600 fill-red-200" />
                  <span className="text-[10px] font-black text-red-600 leading-none mt-0.5">{donor.bloodGroup}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs tracking-tight flex items-center gap-1">
                    {donor.name}
                    {donor.contributions > 0 && (
                      <span className="text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Award size={10} />
                        {donor.contributions} donations
                      </span>
                    )}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold flex items-center gap-0.5 mt-0.5">
                    <MapPin size={10} className="text-slate-400" />
                    {donor.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  donor.isAvailable 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {donor.isAvailable ? 'Available' : 'Busy'}
                </span>
                <button
                  onClick={() => setActiveCall(`${donor.name} (${donor.phone})`)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl cursor-pointer transition-all duration-150"
                  title="Call Donor"
                >
                  <Phone size={13} className="stroke-[2.5px]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleRegister} className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
            <div className="bg-red-600 p-5 text-white relative">
              <button 
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 bg-white/15 backdrop-blur text-white p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <h3 className="font-extrabold text-white text-sm leading-tight flex items-center gap-1.5">
                <Heart size={16} className="text-white fill-white/20 animate-pulse" />
                Register as a Lifesaver
              </h3>
              <p className="text-[10px] text-red-100 font-bold mt-1">
                Help emergency requirements in Ward 4 and earn +20 civic points.
              </p>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              {registered ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check size={24} className="stroke-[3px]" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Successfully Registered!</h4>
                  <p className="text-[10px] text-slate-500">You are now a registered local donor volunteer.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                      Select Blood Group
                    </label>
                    <select
                      value={formGroup}
                      onChange={(e) => setFormGroup(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-red-500 font-semibold"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                      Location / Cross Area
                    </label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Indiranagar 5th Cross"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-lg shadow-red-100 cursor-pointer mt-2"
                  >
                    Confirm Registration
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Active Call Simulator Toast */}
      {activeCall && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
              <Phone size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-red-400 tracking-wider block animate-pulse">
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
