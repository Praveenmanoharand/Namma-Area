import React, { useState, useEffect } from 'react';
import { getEmergencyContacts } from '../db';
import { EmergencyContact } from '../types';
import { 
  ArrowLeft, Search, Phone, Shield, Flame, Activity, Building, 
  Lightbulb, Droplets, Check, ExternalLink, AlertTriangle 
} from 'lucide-react';
import { useRouter } from '../router';

export const EmergencyView: React.FC = () => {
  const { goBack } = useRouter();
  const [contacts] = useState<EmergencyContact[]>(getEmergencyContacts());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  
  // Interactive simulator states
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Auto-clear active call simulated dialer
  useEffect(() => {
    if (activeCall) {
      const timer = setTimeout(() => setActiveCall(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCall]);

  // Auto-clear clipboard copier
  useEffect(() => {
    if (copiedNumber) {
      const timer = setTimeout(() => setCopiedNumber(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedNumber]);

  const categories = [
    'All', 'Police', 'Ambulance', 'Fire Service', 'Municipality', 'Electricity Board', 'Water Board'
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Police': return { icon: Shield, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'Ambulance': return { icon: Activity, color: 'text-rose-600 bg-rose-50 border-rose-100' };
      case 'Fire Service': return { icon: Flame, color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'Municipality': return { icon: Building, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'Electricity Board': return { icon: Lightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' };
      case 'Water Board': return { icon: Droplets, color: 'text-sky-600 bg-sky-50 border-sky-100' };
      default: return { icon: Phone, color: 'text-slate-600 bg-slate-50 border-slate-100' };
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.number.includes(search) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' ? true : c.category === selectedCat;
    return matchesSearch && matchesCat;
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
            <Phone size={16} className="text-rose-600 animate-pulse" />
            Emergency Contacts
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            24/7 Direct Ward Emergency Lines
          </p>
        </div>
      </div>

      {/* Critical Warning Alert banner */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="font-extrabold text-[11px] uppercase tracking-wide">Ambulance & Fire Patrol</h4>
          <p className="text-[10px] leading-relaxed text-red-700 mt-0.5 font-medium">
            For critical medical, cardiac trauma, or fire accidents, utilize direct quick dialers. These lines bypass municipality waitlists.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by desk name (e.g., Police, BESCOM)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
        />
      </div>

      {/* Category Horizontal Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl border shrink-0 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-rose-600 border-rose-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredContacts.map((contact) => {
          const config = getCategoryIcon(contact.category);
          const Icon = config.icon;

          return (
            <div 
              key={contact.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-150"
            >
              <div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 ${config.color}`}>
                  <Icon size={16} className="stroke-[2.5px]" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{contact.name}</h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-relaxed line-clamp-2 font-medium">
                  {contact.description}
                </p>
              </div>

              {/* Call and copy bar */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="font-mono text-[11px] font-black text-slate-800 tracking-tight">{contact.number}</span>
                
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contact.number);
                      setCopiedNumber(contact.number);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer transition-all duration-100"
                    title="Copy Number"
                  >
                    {copiedNumber === contact.number ? <Check size={12} className="text-emerald-600 stroke-[2.5px]" /> : <ExternalLink size={12} />}
                  </button>
                  <button
                    onClick={() => setActiveCall(contact.name + " (" + contact.number + ")")}
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-all duration-100"
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
    </div>
  );
};
