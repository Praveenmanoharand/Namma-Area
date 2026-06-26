import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, MapPin, X, CheckCircle2, Building2, Navigation } from 'lucide-react';
import { TN_DISTRICTS_UNIQUE, buildAreaString } from '../data/tamilnadu-wards';

interface WardSelectorProps {
  value: string;
  onChange: (area: string) => void;
  disabled?: boolean;
}

export const WardSelector: React.FC<WardSelectorProps> = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'district' | 'ward'>('district');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [search, setSearch] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Parse existing value back to district/ward if editing
  useEffect(() => {
    if (value && value.includes(', Tamil Nadu')) {
      const parts = value.replace(', Tamil Nadu', '').split(', ');
      if (parts.length >= 2) {
        const ward = parts[0];
        const district = parts[1];
        const districtObj = TN_DISTRICTS_UNIQUE.find(d => d.name === district);
        if (districtObj) {
          setSelectedDistrict(district);
        }
      }
    }
  }, []);

  // Focus search when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 80);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const filteredDistricts = useMemo(() => {
    if (!search.trim()) return TN_DISTRICTS_UNIQUE;
    const q = search.toLowerCase();
    return TN_DISTRICTS_UNIQUE.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.wards.some(w => w.toLowerCase().includes(q))
    );
  }, [search]);

  const currentDistrict = TN_DISTRICTS_UNIQUE.find(d => d.name === selectedDistrict);

  const filteredWards = useMemo(() => {
    if (!currentDistrict) return [];
    if (!search.trim()) return currentDistrict.wards;
    const q = search.toLowerCase();
    return currentDistrict.wards.filter(w => w.toLowerCase().includes(q));
  }, [currentDistrict, search]);

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setStep('ward');
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const handleWardSelect = (ward: string) => {
    const area = buildAreaString(selectedDistrict, ward);
    onChange(area);
    setIsOpen(false);
    setSearch('');
  };

  const handleBack = () => {
    setStep('district');
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const handleOpen = () => {
    setStep('district');
    setSearch('');
    if (selectedDistrict) setStep('ward');
    setIsOpen(true);
  };

  // Display label
  const displayLabel = value && value.includes(', Tamil Nadu')
    ? value
    : 'Select your Ward';

  const isPlaceholder = displayLabel === 'Select your Ward';

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        id="ward-selector-trigger"
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center gap-2.5 pl-3.5 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs transition-all duration-200 outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-left
          ${isOpen ? 'border-blue-600 ring-2 ring-blue-600/20 bg-white' : 'border-slate-200 hover:border-slate-300'}`}
      >
        <Navigation size={14} className="text-slate-400 shrink-0" />
        <span className={`flex-1 truncate font-medium ${isPlaceholder ? 'text-slate-400' : 'text-slate-900'}`}>
          {displayLabel}
        </span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm px-2">
          <div
            ref={overlayRef}
            className="bg-white rounded-t-3xl w-full max-w-md shadow-2xl flex flex-col"
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {step === 'ward' && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <ChevronDown size={14} className="text-slate-600 rotate-90" />
                    </button>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step === 'district' ? '📍 Select District' : `🏘️ ${selectedDistrict}`}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {step === 'district'
                        ? 'Tamil Nadu → District → Ward'
                        : `Select your ward in ${selectedDistrict}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-slate-600" />
                </button>
              </div>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold">
                <span className={`px-2 py-0.5 rounded-full ${step === 'district' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  Tamil Nadu
                </span>
                <ChevronDown size={10} className="text-slate-400 -rotate-90" />
                <span className={`px-2 py-0.5 rounded-full ${step === 'ward' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {selectedDistrict || 'District'}
                </span>
                <ChevronDown size={10} className="text-slate-400 -rotate-90" />
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Ward</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-5 py-3 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={step === 'district' ? 'Search district...' : 'Search ward...'}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all text-slate-900 placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 py-2">
              {step === 'district' ? (
                filteredDistricts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <MapPin size={28} className="mb-2 opacity-40" />
                    <p className="text-xs font-medium">No districts found</p>
                  </div>
                ) : (
                  filteredDistricts.map(district => (
                    <button
                      key={district.name}
                      type="button"
                      onClick={() => handleDistrictSelect(district.name)}
                      className={`w-full flex items-center justify-between px-5 py-3 hover:bg-blue-50 transition-colors text-left group
                        ${selectedDistrict === district.name ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                          ${selectedDistrict === district.name ? 'bg-blue-600' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
                          <Building2 size={13} className={selectedDistrict === district.name ? 'text-white' : 'text-slate-500'} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{district.name}</p>
                          <p className="text-[10px] text-slate-400">{district.wards.length} wards</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {selectedDistrict === district.name && (
                          <CheckCircle2 size={14} className="text-blue-600" />
                        )}
                        <ChevronDown size={12} className="text-slate-400 -rotate-90" />
                      </div>
                    </button>
                  ))
                )
              ) : (
                filteredWards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <MapPin size={28} className="mb-2 opacity-40" />
                    <p className="text-xs font-medium">No wards found</p>
                  </div>
                ) : (
                  filteredWards.map(ward => {
                    const fullArea = buildAreaString(selectedDistrict, ward);
                    const isSelected = value === fullArea;
                    return (
                      <button
                        key={ward}
                        type="button"
                        onClick={() => handleWardSelect(ward)}
                        className={`w-full flex items-center justify-between px-5 py-2.5 hover:bg-blue-50 transition-colors text-left group
                          ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0
                            ${isSelected ? 'bg-blue-600' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
                            <MapPin size={11} className={isSelected ? 'text-white' : 'text-slate-500'} />
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                            {ward}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 size={14} className="text-blue-600 shrink-0" />}
                      </button>
                    );
                  })
                )
              )}
            </div>

            {/* Bottom safe area */}
            <div className="h-4 shrink-0" />
          </div>
        </div>
      )}
    </div>
  );
};
