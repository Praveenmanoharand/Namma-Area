import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Tag, Plus, Phone, MapPin, 
  ShoppingBag, Check, Sparkles, Image
} from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser } from '../db';

interface ProductItem {
  id: string;
  title: string;
  price: string;
  category: 'Electronics' | 'Furniture' | 'Books' | 'Tools' | 'Vehicles' | 'Other';
  description: string;
  location: string;
  image: string;
  contact: string;
  type: 'Sell' | 'Rent' | 'Free';
}

export const MarketplaceView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<'browse' | 'list'>('browse');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [activeCall, setActiveCall] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<ProductItem['category']>('Other');
  const [formDesc, setFormDesc] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formType, setFormType] = useState<ProductItem['type']>('Sell');
  const [submitted, setSubmitted] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'p1',
      title: 'Ergonomic Office Chair',
      price: '₹2,500',
      category: 'Furniture',
      description: 'Used for 6 months. High back mesh support with adjustable height and metal legs. Excellent condition.',
      location: 'Defense Colony, Indiranagar',
      image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=400&q=80',
      contact: '9845012345',
      type: 'Sell'
    },
    {
      id: 'p2',
      title: 'Bosch Power Drill (Drilling Machine)',
      price: '₹150 / day',
      category: 'Tools',
      description: 'Bosch impact drill machine with complete bit set. Renting out for home repairs.',
      location: 'Indiranagar 5th Cross',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
      contact: '9886023456',
      type: 'Rent'
    },
    {
      id: 'p3',
      title: 'HC Verma Physics & NCERT Textbook Set',
      price: 'Free',
      category: 'Books',
      description: 'CBSE Class 11 and 12 preparation reference books. Giving away for free to students.',
      location: 'Domlur Layout',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
      contact: '9900034567',
      type: 'Free'
    }
  ]);

  const handleListProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPrice || !formContact) {
      alert('Please fill out required fields');
      return;
    }

    const newItem: ProductItem = {
      id: 'prod_' + Date.now(),
      title: formTitle,
      price: formPrice,
      category: formCategory,
      description: formDesc,
      location: formLocation || 'Ward 4, Indiranagar',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      contact: formContact,
      type: formType
    };

    const updated = [newItem, ...products];
    setProducts(updated);
    setSubmitted(true);

    // Points credit
    if (currentUser) {
      const updatedUser = { ...currentUser, contributionsCount: (currentUser.contributionsCount || 0) + 6 };
      localStorage.setItem('namma_user', JSON.stringify(updatedUser));
      const users = JSON.parse(localStorage.getItem('namma_users_db') || '[]');
      const userIdx = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIdx !== -1) {
        users[userIdx] = updatedUser;
        localStorage.setItem('namma_users_db', JSON.stringify(users));
      }
    }

    setTimeout(() => {
      setSubmitted(false);
      setActiveTab('browse');
      // Reset form
      setFormTitle('');
      setFormPrice('');
      setFormCategory('Other');
      setFormDesc('');
      setFormLocation('');
      setFormContact('');
      setFormType('Sell');
    }, 1500);
  };

  const categories = ['All', 'Electronics', 'Furniture', 'Books', 'Tools', 'Vehicles', 'Other'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'All' ? true : p.category === catFilter;
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
            <ShoppingBag size={16} className="text-emerald-600" />
            Namma Marketplace
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Garage Sale & Shared Tools
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'browse' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Browse Listings
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus size={14} />
          Post Ad (+6 pts)
        </button>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search bar and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chairs, drills, text books..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Category:</span>
              <div className="flex gap-1.5 ml-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatFilter(cat)}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                      catFilter === cat 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Feed Grid */}
          <div className="flex flex-col gap-4">
            {filteredProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:border-slate-300 transition-all duration-150"
              >
                <div className="h-32 bg-slate-100 relative">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute top-2.5 left-2.5 text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-xs shadow-md`}>
                    {p.category}
                  </span>
                  <span className={`absolute top-2.5 right-2.5 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider text-white ${
                    p.type === 'Sell' ? 'bg-blue-600' : p.type === 'Rent' ? 'bg-orange-500' : 'bg-emerald-600'
                  }`}>
                    {p.type}
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{p.title}</h4>
                      <span className="font-mono text-xs font-black text-emerald-600 shrink-0">{p.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-1.5 font-semibold">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5">
                      <MapPin size={11} />
                      {p.location}
                    </span>

                    <button
                      onClick={() => setActiveCall(`Seller (${p.contact})`)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-600 font-black rounded-lg text-[9px] uppercase flex items-center gap-1 cursor-pointer transition-all duration-150"
                    >
                      <Phone size={11} />
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Create Ad Form */
        <form onSubmit={handleListProduct} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" />
              List an Item
            </h3>
            <p className="text-[9px] text-slate-500 leading-normal mt-0.5">
              Sell, rent out, or give away items within Ward 4 residents.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check size={24} className="stroke-[3px]" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Item Listed Successfully!</h4>
              <p className="text-[10px] text-slate-500">Your marketplace advertisement is now active.</p>
            </div>
          ) : (
            <>
              {/* Type */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                {(['Sell', 'Rent', 'Free'] as ProductItem['type'][]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setFormType(t)}
                    className={`py-1.5 text-[10px] font-black rounded-lg transition-all duration-150 cursor-pointer ${
                      formType === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Product / Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Wooden Dining Table, Study Lamp"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Price / Rent Cost *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. ₹1,200 or ₹100/day"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductItem['category'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Books">Books</option>
                    <option value="Tools">Tools</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Item Details & Condition
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe age, condition, usage details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold resize-none"
                />
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="e.g. 9845012345"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Location Area
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Eshwara Layout"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100 cursor-pointer mt-2"
              >
                Submit Marketplace Ad
              </button>
            </>
          )}
        </form>
      )}

      {/* Active Call Simulator Toast */}
      {activeCall && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse">
              <Phone size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block animate-pulse">
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
