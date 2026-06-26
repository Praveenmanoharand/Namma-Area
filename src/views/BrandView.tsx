import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Sparkles, Layers, ShieldCheck, Moon, Sun, 
  CheckCircle2, Compass, Home, AppWindow, Users, Grid, Check
} from 'lucide-react';
import { useRouter } from '../router';
import { NammaLogo, LogoConcept } from '../components/NammaLogo';

interface ConceptDetails {
  id: LogoConcept;
  name: string;
  tagline: string;
  description: string;
  tamilStance: string;
  houseStance: string;
  communityStance: string;
  bestUse: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const BrandView: React.FC = () => {
  const { goBack } = useRouter();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  // Track globally active concept to highlight it
  const [activeConcept, setActiveConcept] = useState<LogoConcept>(() => {
    return (localStorage.getItem('namma_active_concept') as LogoConcept) || 'concept1';
  });

  // Track currently inspected concept in detail view
  const [inspectedConcept, setInspectedConcept] = useState<LogoConcept>('concept1');

  useEffect(() => {
    const handleConceptChange = () => {
      const saved = localStorage.getItem('namma_active_concept') as LogoConcept;
      if (saved) setActiveConcept(saved);
    };
    window.addEventListener('namma_concept_updated', handleConceptChange);
    return () => window.removeEventListener('namma_concept_updated', handleConceptChange);
  }, []);

  const handleSelectConcept = (conceptId: LogoConcept) => {
    localStorage.setItem('namma_active_concept', conceptId);
    setActiveConcept(conceptId);
    window.dispatchEvent(new Event('namma_concept_updated'));
  };

  const concepts: ConceptDetails[] = [
    {
      id: 'concept1',
      name: 'Concept 1: Tamil "ந" + Community',
      tagline: 'The Neighborhood Gathering',
      description: 'A highly polished, purely authentic Tamil letter "ந" integrated with subtle circular nodes at the top, representing active civic gathering points and community interaction.',
      tamilStance: 'Absolute priority on traditional letter anatomy, ensuring immediate readability for any Tamil speaker.',
      houseStance: 'Integrates flat vector structure as a solid ground base.',
      communityStance: 'Clean rounded circular elements forming a supportive social crown.',
      bestUse: 'Core brand emblem, scalable favicon, and official mobile application launcher.',
      icon: Sparkles
    },
    {
      id: 'concept2',
      name: 'Concept 2: Tamil "ந" + House Concept',
      tagline: 'Unified Shelter and Heritage',
      description: 'Integrates the pitched roof outline naturally with the horizontal bar and left vertical pillar of the Tamil letter "ந". The final symbol is a single, highly unified icon of modern tech civic utility.',
      tamilStance: 'Directly forms the structural columns of the house.',
      houseStance: 'Apex roof contour covering the Tamil script, offering structural cohesion.',
      communityStance: 'Represents shelter, security, and a digital safe-haven for neighborhood issues.',
      bestUse: 'Main civic reporting system, municipal alerts, and high-impact infrastructure platforms.',
      icon: Home
    },
    {
      id: 'concept3',
      name: 'Concept 3: Tamil "ந" + Neighborhood Grid',
      tagline: 'The Connected Civic Grid',
      description: 'A modern design representing smart city planning and infrastructure, overlaying the Tamil letter "ந" onto a tech-forward 3x3 geometric grid block network.',
      tamilStance: 'Sleek, modern letter strokes intersecting with structural block corners.',
      houseStance: 'Symmetrical alignment suggesting modular ward layouts.',
      communityStance: 'Grid matrix representing interconnected community wards and citizen services.',
      bestUse: 'Social features, community hubs, citizen discussion boards, and volunteer coordination.',
      icon: Grid
    },
    {
      id: 'concept4',
      name: 'Concept 4: Tamil "ந" + Community Circle',
      tagline: 'The Ring of Collaboration',
      description: 'Presents the traditional Tamil letter "ந" centered inside a modern, beautifully pulsing community orbit path and concentric circle lines, showing citizen unity.',
      tamilStance: 'Perfect minimalist monoline geometry centered beautifully within the protective frame.',
      houseStance: 'Integrated horizontal upper anchor providing stability to the inner glyph.',
      communityStance: 'Dashed outer circular orbits representing a protective ring of safety, neighborhood watch, and local community circle.',
      bestUse: 'Safety apps, security alerts, high-contrast badges, and local community watch portals.',
      icon: ShieldCheck
    },
    {
      id: 'concept5',
      name: 'Concept 5: Hybrid Monogram "ந + A"',
      tagline: 'The Interlocking Glyphs',
      description: 'An elite, interlocking typographic monogram merging the Latin letter "A" (Area) and the Tamil letter "ந" (Namma) into a unified tech logo. The sharp apex of the "A" doubles as a house roof while the loops of "ந" form the crossbar.',
      tamilStance: 'Seamlessly fused inside the capital "A". The loop of "ந" elegantly forms the inner crossbar. High-tech, memorable, and premium.',
      houseStance: 'The sharp green peak of the letter "A" functions as a modern stylized roof silhouette.',
      communityStance: 'The seamless connection of dual scripts represents local roots and global technology coming together.',
      bestUse: 'Primary platform favicon, high-scaling corporate identity, store launch icon, and premium mobile headers.',
      icon: AppWindow
    }
  ];

  const inspectedDetails = concepts.find(c => c.id === inspectedConcept) || concepts[0];

  const brandColors = [
    { name: 'Primary Blue', hex: '#2563EB', role: 'Trust, Civic Integrity & Digital Security', description: 'Used for letter (ந) stems, connection pathways, and active interactive elements.' },
    { name: 'Primary Green', hex: '#10B981', role: 'Growth, Prosperity & Local Neighborhoods', description: 'Used for pitched house roof vectors, active citizen badges, and positive indicators.' },
    { name: 'Dark Navy', hex: '#0F172A', role: 'Contrast, Precision & Solid Foundation', description: 'Deep tech-navy used for sharp modern typography and premium dark backgrounds.' },
    { name: 'Pure White', hex: '#FFFFFF', role: 'Clarity, Transparency & Accessibility', description: 'Clean canvases, cards, and high-contrast space.' }
  ];

  return (
    <div className={`p-4 flex flex-col gap-6 min-h-screen pb-24 transition-colors duration-300 font-sans ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Header */}
      <div className={`flex justify-between items-center border-b pb-3 ${
        themeMode === 'dark' ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={goBack}
            className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
              themeMode === 'dark' ? 'bg-slate-900 text-slate-300 hover:bg-slate-850' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className={`text-sm font-black tracking-tight flex items-center gap-1.5 ${
              themeMode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <Sparkles size={16} className="text-blue-500" />
              Brand Design Studio
            </h2>
            <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
              "Namma Area" Startup Brand & Logo Suite
            </p>
          </div>
        </div>

        {/* Global theme toggle within studio */}
        <button
          onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
          className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
            themeMode === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {themeMode === 'light' ? (
            <>
              <Moon size={11} />
              Dark Canvas
            </>
          ) : (
            <>
              <Sun size={11} />
              Light Canvas
            </>
          )}
        </button>
      </div>

      {/* Global State Status */}
      <div className={`rounded-2xl p-4 border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 ${
        themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/50 border-blue-100'
      }`}>
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
            <NammaLogo variant="favicon" size={20} mode="dark" />
          </div>
          <div>
            <span className="text-[8px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Active Brand Identity
            </span>
            <h4 className={`text-xs font-black uppercase tracking-wide mt-1 ${
              themeMode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {concepts.find(c => c.id === activeConcept)?.name}
            </h4>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
              The selected logo instantly updates across the header, menus, and entire system.
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
          <ShieldCheck size={14} className="stroke-[2.5px]" />
          <span>Vetted Identity</span>
        </div>
      </div>

      {/* Interactive 5 Concepts Hub */}
      <div>
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-3 pl-1 ${
          themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Explore & Switch Concepts (5 Proposals)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {concepts.map((concept) => {
            const ConceptIcon = concept.icon;
            const isInspected = inspectedConcept === concept.id;
            const isActive = activeConcept === concept.id;

            return (
              <button
                key={concept.id}
                onClick={() => setInspectedConcept(concept.id)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isInspected 
                    ? 'border-blue-600 ring-2 ring-blue-600/15' 
                    : themeMode === 'dark' ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-350 shadow-xs'
                }`}
              >
                {isActive && (
                  <span className="absolute top-2 right-2 text-emerald-500" title="Active Platform Identity">
                    <CheckCircle2 size={15} className="fill-emerald-50" />
                  </span>
                )}
                
                <div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                    isInspected 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ConceptIcon size={16} />
                  </div>
                  <h4 className={`font-black text-xs leading-snug ${
                    themeMode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {concept.name.split(':')[0]}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5 leading-none">
                    {concept.tagline}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100/10 flex justify-between items-center w-full">
                  <span className="text-[9px] text-blue-500 font-black uppercase tracking-wider">
                    {isInspected ? 'Inspecting' : 'View Details'}
                  </span>
                  
                  {isActive && (
                    <span className="text-[8px] uppercase bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Showcase & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left and Middle Columns: Showcasing All 6 Requested Deliverables for the Inspected Concept */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border flex flex-col gap-4 ${
          themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex justify-between items-center border-b border-slate-100/10 pb-3">
            <div>
              <span className="text-[8px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Interactive Showcase
              </span>
              <h3 className={`text-sm font-black uppercase mt-1 ${
                themeMode === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                {inspectedDetails.name}
              </h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                Inspecting all 6 deliverables in {themeMode === 'light' ? 'Light Theme Mock' : 'Dark Theme Mock'}:
              </p>
            </div>

            {activeConcept !== inspectedConcept ? (
              <button
                onClick={() => handleSelectConcept(inspectedConcept)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl cursor-pointer shadow-md transition-all duration-150 flex items-center gap-1 active:scale-98"
              >
                <Check size={11} className="stroke-[3px]" />
                Make This App Logo
              </button>
            ) : (
              <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 size={12} className="stroke-[2.5px]" />
                Selected Logo
              </span>
            )}
          </div>

          {/* Deliverables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Primary Full Logo (Light / Dark responsive) */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-between gap-3 text-center ${
              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Deliverable 1 & 5/6: Primary Logo
              </span>
              <NammaLogo variant="full" concept={inspectedConcept} mode={themeMode} />
              <p className="text-[9px] text-slate-400 font-semibold px-2">
                Unified symbol combining "People + Home + Community" paired with Inter typography.
              </p>
            </div>

            {/* 2. Premium App Icon */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-between gap-3 text-center ${
              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Deliverable 2: App Icon
              </span>
              {inspectedConcept === 'concept5' ? (
                <div className="w-[120px] h-[120px]">
                  <NammaLogo variant="favicon" concept="concept5" size={120} />
                </div>
              ) : (
                <NammaLogo variant="icon" concept={inspectedConcept} mode={themeMode} />
              )}
              <p className="text-[9px] text-slate-400 font-semibold px-2">
                Scalable, flat-vector mobile app launcher with bold contrast, optimal for docks.
              </p>
            </div>

            {/* 3. Navbar Logo (Compact) */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-between gap-3 text-center ${
              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Deliverable 3: Navbar Logo
              </span>
              <div className={`w-full py-4 rounded-xl border flex justify-center ${
                themeMode === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-100'
              }`}>
                <NammaLogo variant="navbar" concept={inspectedConcept} mode={themeMode} />
              </div>
              <p className="text-[9px] text-slate-400 font-semibold px-2">
                Horizontal, narrow layout crafted for header strips, sub-bars, and sticky panels.
              </p>
            </div>

            {/* 4. Favicon / Multi-scale Micro symbol */}
            <div className={`p-4 rounded-xl border flex flex-col items-center justify-between gap-3 text-center ${
              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-150'
            }`}>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Deliverable 4: Favicon & Symbols
              </span>
              <div className="flex gap-4 items-center py-2">
                <div className="flex flex-col items-center gap-1">
                  <NammaLogo variant="favicon" concept={inspectedConcept} size={16} mode={themeMode} />
                  <span className="text-[7px] font-bold text-slate-400">16x16</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <NammaLogo variant="favicon" concept={inspectedConcept} size={32} mode={themeMode} />
                  <span className="text-[7px] font-bold text-slate-400">32x32</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <NammaLogo variant="favicon" concept={inspectedConcept} size={48} mode={themeMode} />
                  <span className="text-[7px] font-bold text-slate-400">48x48</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold px-2">
                Flawless scale rendering ensuring the Tamil "ந" remains recognizable at 16px.
              </p>
            </div>

          </div>
        </div>

        {/* Right Column: In-depth Design System Anatomy & Geometric Story */}
        <div className="flex flex-col gap-4">
          
          {/* Anatomy card */}
          <div className={`rounded-2xl p-5 border flex flex-col gap-3.5 ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
              themeMode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              <Layers size={14} className="text-blue-500" />
              Symbolic Integration Story
            </h3>

            <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
              {inspectedDetails.description}
            </p>

            <div className="flex flex-col gap-2.5 mt-1 border-t border-slate-100/10 pt-3">
              <div>
                <span className="text-[8px] uppercase font-black text-blue-500">1. Tamil Identity: "ந"</span>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-normal">
                  {inspectedDetails.tamilStance}
                </p>
              </div>

              <div>
                <span className="text-[8px] uppercase font-black text-emerald-500">2. Neighborhood: House Element</span>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-normal">
                  {inspectedDetails.houseStance}
                </p>
              </div>

              <div>
                <span className="text-[8px] uppercase font-black text-indigo-500">3. Civic Unity: Community Element</span>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-normal">
                  {inspectedDetails.communityStance}
                </p>
              </div>

              <div>
                <span className="text-[8px] uppercase font-black text-amber-500">Recommended Stature</span>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-normal">
                  {inspectedDetails.bestUse}
                </p>
              </div>
            </div>
          </div>

          {/* Logo specifications check (Removing traditional badges/government look) */}
          <div className={`rounded-2xl p-4.5 border flex flex-col gap-2.5 ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className={`text-[10px] font-black uppercase tracking-wider ${
              themeMode === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              Corporate Logo Integrity
            </h4>
            <div className="flex flex-col gap-1.5 text-[9px] font-bold text-slate-400 leading-normal">
              <span className="flex items-center gap-1.5 text-emerald-500">
                ✔️ No government seal or municipal badges (Clean & Independent)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                ✔️ No dotted outer circles or outdated badge borders
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                ✔️ No GPS/location pin markers or generic Google Map pointers
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                ✔️ Pure flat vector geometry compatible with SVG standards
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Brand Color Specifications */}
      <div className={`p-4.5 rounded-2xl border flex flex-col gap-4 ${
        themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
          themeMode === 'dark' ? 'text-white' : 'text-slate-950'
        }`}>
          <Layers size={14} className="text-blue-500" />
          Namma Area Color Palettes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {brandColors.map((color, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border flex items-center gap-3.5 ${
                themeMode === 'dark' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-lg border border-slate-200/50 shrink-0 shadow-xs"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-black ${
                    themeMode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {color.name}
                  </span>
                  <span className="font-mono text-[8px] font-bold text-slate-400">{color.hex}</span>
                </div>
                <span className="text-[9px] font-extrabold text-blue-500 block mt-0.5 leading-tight">{color.role}</span>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-normal font-semibold">
                  {color.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography system */}
      <div className={`p-4.5 rounded-2xl border flex flex-col gap-3 ${
        themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xs font-black uppercase tracking-wide ${
          themeMode === 'dark' ? 'text-white' : 'text-slate-950'
        }`}>
          Typography & Text Anatomy
        </h3>
        
        <div className="flex flex-col gap-3 text-[10px] text-slate-500 font-semibold leading-normal">
          <div className="border-l-3 border-blue-500 pl-3">
            <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Primary Brand Typeface</span>
            <span className={`text-lg font-black tracking-widest font-sans uppercase block ${
              themeMode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              NAMMA AREA
            </span>
            <span className="text-[9px] text-slate-400">Inter Black (Modern high-tracking startup presentation)</span>
          </div>

          <div className="border-l-3 border-emerald-500 pl-3">
            <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Tagline Font (Secondary English)</span>
            <span className="italic font-bold block text-[11px] text-slate-400">
              "Together We Improve Our Neighborhood"
            </span>
            <span className="text-[9px] text-slate-400">Inter Medium Italic</span>
          </div>

          <div className="border-l-3 border-blue-600 pl-3">
            <span className="font-bold text-slate-400 block uppercase text-[8px] tracking-wider mb-0.5">Tagline Font (Tamil Script)</span>
            <span className={`font-sans font-black text-xs block ${
              themeMode === 'dark' ? 'text-sky-300' : 'text-blue-600'
            }`}>
              நம்ம பகுதி, நம்ம பொறுப்பு
            </span>
            <span className="text-[9px] text-slate-400 font-sans">Tamil Standard Sans-Serif font (Latha / Inter pairing)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
