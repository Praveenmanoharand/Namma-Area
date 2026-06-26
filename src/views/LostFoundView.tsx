import React, { useState, useEffect } from 'react';
import { 
  getLostFoundItems, createLostFoundItem, getCurrentUser, getCitizenScoreAndRank, subscribeToLostFound 
} from '../db';
import { LostFoundItem } from '../types';
import { 
  Search, Filter, MapPin, Calendar, Phone, Plus, List, Tag, 
  ArrowLeft, Check, AlertCircle, Sparkles, Image as ImageIcon, ShieldCheck
} from 'lucide-react';
import { useRouter } from '../router';

export const LostFoundView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const [items, setItems] = useState<LostFoundItem[]>(getLostFoundItems());

  useEffect(() => {
    return subscribeToLostFound(() => {
      setItems(getLostFoundItems());
    });
  }, []);
  const [activeTab, setActiveTab] = useState<'feed' | 'report'>('feed');
  
  // Feed states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);

  // Form states
  const [formType, setFormType] = useState<'lost' | 'found'>('lost');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<LostFoundItem['category']>('Electronics');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formContact, setFormContact] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Preset images helper for easy entry
  const PRESET_IMAGES = [
    { name: 'Wallet/Bag', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80' },
    { name: 'Keys', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80' },
    { name: 'Phone/Tech', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dog/Pet', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDescription || !formContact) {
      alert('Please fill out all required fields.');
      return;
    }

    const finalImage = formImage || PRESET_IMAGES[0].url;

    createLostFoundItem(
      formType,
      formName,
      formCategory,
      formDescription,
      formLocation,
      formDate,
      finalImage,
      formContact
    );

    // Refresh data
    setItems(getLostFoundItems());
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('feed');
      // Reset form
      setFormName('');
      setFormDescription('');
      setFormLocation('');
      setFormContact('');
      setFormImage('');
    }, 1500);
  };

  const categories: string[] = [
    'All', 'Electronics', 'Documents', 'Wallets & Bags', 'Keys', 'Pets', 'Vehicles', 'Other'
  ];

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' ? true : item.type === typeFilter;
    const matchesCat = catFilter === 'All' ? true : item.category === catFilter;
    return matchesSearch && matchesType && matchesCat;
  });

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
            <Tag size={16} className="text-blue-600" />
            Lost & Found Desk
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Citizen Bulletin
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => { setActiveTab('feed'); setSelectedItem(null); }}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'feed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <List size={14} />
          Bulletin Feed
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'report' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus size={14} />
          Report Item (+10 pts)
        </button>
      </div>

      {activeTab === 'feed' ? (
        <>
          {/* Detailed Item Modal Overlay */}
          {selectedItem && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
                <div className="h-44 bg-slate-100 relative">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white p-1.5 rounded-full hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  <span className={`absolute bottom-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider text-white shadow-md ${
                    selectedItem.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}>
                    {selectedItem.type}
                  </span>
                </div>

                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
                  <div>
                    <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight mt-1.5">{selectedItem.name}</h3>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedItem.description}
                  </p>

                  <div className="flex flex-col gap-2.5 text-[10px] text-slate-600 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span>{selectedItem.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>Reported date: {selectedItem.date}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={11} className="stroke-[2.5px]" />
                      Contact Claimant Info
                    </h4>
                    <p className="text-xs font-black text-slate-900">{selectedItem.contactInfo}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mt-2">
                    <img 
                      src={selectedItem.creatorAvatar} 
                      alt={selectedItem.creatorName} 
                      className="w-7 h-7 rounded-full object-cover border border-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Reported By</p>
                      <p className="text-[10px] text-slate-700 font-black">{selectedItem.creatorName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 cursor-pointer transition-all duration-150"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lost bags, keys, wallets..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            {/* Sub-Filters */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
                <div className="flex gap-1.5 ml-2">
                  {(['all', 'lost', 'found'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                        typeFilter === t 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Cat:</span>
                <div className="flex gap-1.5 ml-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCatFilter(cat)}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                        catFilter === cat 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feed List */}
          <div className="flex flex-col gap-3.5">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
                <h4 className="font-extrabold text-slate-800 text-xs">No Items Found</h4>
                <p className="text-[10px] text-slate-500 mt-1">Be the first to list or adjust your filters.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex gap-3.5 hover:border-slate-300 transition-all duration-150 cursor-pointer select-none"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute top-1.5 left-1.5 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white ${
                      item.type === 'lost' ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[8px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold">{item.date}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-950 text-xs leading-snug mt-1.5 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-normal line-clamp-1 mt-0.5">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-slate-50">
                      <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                        <MapPin size={10} />
                        {item.location}
                      </span>
                      <span className="text-[9px] font-black text-blue-600 hover:underline flex items-center gap-0.5">
                        Claim details
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Report Item Form */
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              File Claim Form
            </h3>
            <p className="text-[9px] text-slate-500 leading-normal mt-0.5">
              Ensure accurate location details. You will receive 10 Contribution Points upon submission.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check size={24} className="stroke-[3px]" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Claim Registered!</h4>
              <p className="text-[10px] text-slate-500">Your bulletin points have been logged.</p>
            </div>
          ) : (
            <>
              {/* Type Toggle */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Type of Report
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('lost')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all duration-150 cursor-pointer ${
                      formType === 'lost' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('found')}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all duration-150 cursor-pointer ${
                      formType === 'found' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Leather Fossil Wallet, House Keys"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LostFoundItem['category'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents</option>
                    <option value="Wallets & Bags">Wallets & Bags</option>
                    <option value="Keys">Keys</option>
                    <option value="Pets">Pets</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Approx. Location *
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Near Indiranagar Metro Station"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Details & Description *
                </label>
                <textarea
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe colors, markings, exact coordinates, contents inside..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold resize-none"
                />
              </div>

              {/* Contact Info */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Claim/Contact Information *
                </label>
                <input
                  type="text"
                  required
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="e.g. Call Amit 9876001122 or drop at sector office"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Image Presets Selector */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Select Visual/Photo Preset
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className={`h-11 rounded-lg overflow-hidden border-2 relative transition-all cursor-pointer ${
                        formImage === preset.url ? 'border-blue-600 scale-102 shadow' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={preset.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[6px] font-black text-white py-0.5 truncate uppercase">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="Or paste custom image URL"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 cursor-pointer mt-2 transition-all duration-150"
              >
                Submit Claim Report
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
};
