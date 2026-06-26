import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type LogoConcept = 'concept1' | 'concept2' | 'concept3' | 'concept4' | 'concept5';

interface NammaLogoProps {
  variant?: 'icon' | 'full' | 'navbar' | 'favicon' | 'showcase';
  concept?: LogoConcept; // Explicit concept override for showroom
  mode?: 'light' | 'dark';
  className?: string;
  size?: number;
}

export const NammaLogo: React.FC<NammaLogoProps> = ({
  variant = 'navbar',
  concept,
  mode = 'light',
  className = '',
  size
}) => {
  const isDark = mode === 'dark';

  // State to read active concept dynamically from localStorage
  const [activeConcept, setActiveConcept] = useState<LogoConcept>(() => {
    const saved = localStorage.getItem('namma_active_concept') as LogoConcept;
    return saved || 'concept1';
  });

  // Listen for changes in selected concept to update the entire app logo in real-time
  useEffect(() => {
    const handleConceptChange = () => {
      const saved = localStorage.getItem('namma_active_concept') as LogoConcept;
      if (saved) {
        setActiveConcept(saved);
      }
    };
    window.addEventListener('namma_concept_updated', handleConceptChange);
    window.addEventListener('storage', handleConceptChange);
    return () => {
      window.removeEventListener('namma_concept_updated', handleConceptChange);
      window.removeEventListener('storage', handleConceptChange);
    };
  }, []);

  // Use the explicitly provided concept or fall back to the active global concept
  const selectedConcept = concept || activeConcept;

  // Core colors as requested
  const blueColor = '#2563EB';
  const greenColor = '#10B981';
  const navyColor = '#0F172A';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const taglineColor = isDark ? '#94A3B8' : '#64748B';
  const brandHighlightColor = isDark ? '#38BDF8' : '#2563EB';

  // Dimensions based on variant
  const getDimensions = () => {
    if (size) return { width: size, height: size };
    switch (variant) {
      case 'icon':
        return { width: 130, height: 130 };
      case 'favicon':
        return { width: 32, height: 32 };
      case 'navbar':
        return { width: 160, height: 40 };
      case 'full':
        return { width: 280, height: 190 };
      case 'showcase':
        return { width: 200, height: 200 };
      default:
        return { width: 160, height: 40 };
    }
  };

  const { width, height } = getDimensions();

  // Render the SVGs for the different concepts
  const renderSymbolSVG = (symbolSize: number = 100, targetConcept: LogoConcept) => {
    switch (targetConcept) {
      case 'concept1': // Concept 1: Tamil "ந" + Community
        return (
          <svg
            width={symbolSize}
            height={symbolSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Elegant community nodes (people) forming a supportive arch */}
            <motion.circle cx="28" cy="20" r="3.5" fill={greenColor} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} />
            <motion.circle cx="50" cy="14" r="4.5" fill={greenColor} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
            <motion.circle cx="72" cy="20" r="3.5" fill={greenColor} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
            
            {/* Top horizontal bar of 'ந' */}
            <motion.path
              d="M 30 35 H 70"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Left vertical pillar */}
            <motion.path
              d="M 38 35 V 70"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            />
            {/* Sweeping curve of "ந" forming the perfect loop */}
            <motion.path
              d="M 62 35 V 48 C 62 54, 56 58, 50 58 C 44 58, 41 53, 44 47 C 47 41, 56 42, 61 46 C 66 50, 68 58, 68 70"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
          </svg>
        );

      case 'concept2': // Concept 2: Tamil "ந" + House
        return (
          <svg
            width={symbolSize}
            height={symbolSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* House roof silhouette integrating with the top bar of 'ந' */}
            <motion.path
              d="M 20 40 L 50 18 L 80 40"
              stroke={greenColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Left pillar of 'ந' acting as the left wall of the house */}
            <motion.path
              d="M 38 40 V 72"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            />

            {/* Right sweeping 'ந' loop acting as the interior door and dynamic flow of the house */}
            <motion.path
              d="M 62 40 V 50 C 62 56, 56 60, 50 60 C 44 60, 41 55, 44 49 C 47 43, 56 44, 61 48 C 66 52, 68 60, 68 72"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        );

      case 'concept3': // Concept 3: Tamil "ந" + Neighborhood Grid
        return (
          <svg
            width={symbolSize}
            height={symbolSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Background neighborhood grid blocks (subtle tech overlay) */}
            <motion.rect x="25" y="25" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="42" y="25" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="59" y="25" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="25" y="42" width="12" height="12" rx="3" fill={greenColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="42" y="42" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="59" y="42" width="12" height="12" rx="3" fill={greenColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="25" y="59" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="42" y="59" width="12" height="12" rx="3" fill={greenColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.rect x="59" y="59" width="12" height="12" rx="3" fill={blueColor} fillOpacity="0.08" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

            {/* Geometric "ந" on top of the neighborhood grid */}
            <motion.path
              d="M 30 35 H 70"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M 38 35 V 70"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            <motion.path
              d="M 62 35 V 48 C 62 54, 56 58, 50 58 C 44 58, 41 53, 44 47 C 47 41, 56 42, 61 46 C 66 50, 68 58, 68 70"
              stroke={greenColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </svg>
        );

      case 'concept4': // Concept 4: Tamil "ந" + Community Circle
        return (
          <svg
            width={symbolSize}
            height={symbolSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Circular community ring of citizens gathering around */}
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              stroke={greenColor}
              strokeWidth="3.5"
              strokeDasharray="6 6"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 0.7 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="43"
              stroke={blueColor}
              strokeWidth="1.5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 0.8 }}
            />

            {/* Tamil letter 'ந' centered inside the community circle */}
            <motion.path
              d="M 34 38 H 66"
              stroke={blueColor}
              strokeWidth="6.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.path
              d="M 41 38 V 65"
              stroke={blueColor}
              strokeWidth="6.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.path
              d="M 59 38 V 46 C 59 51, 55 55, 50 55 C 45 55, 42 51, 45 46 C 48 41, 55 42, 59 45 C 63 48, 64 54, 64 65"
              stroke={blueColor}
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            />
          </svg>
        );

      case 'concept5': // Concept 5: Modern Monogram "ந + A" (Area)
        return (
          <svg
            width={symbolSize}
            height={symbolSize}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* The structural Latin letter 'A' legs */}
            <motion.path
              d="M 50 18 L 24 76"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
            />
            <motion.path
              d="M 50 18 L 76 76"
              stroke={blueColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            />

            {/* Pitched Roof element serving as the apex of both "A" and geometric protection */}
            <motion.path
              d="M 37 46 L 50 18 L 63 46"
              stroke={greenColor}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />

            {/* Seamless loop crossbar of 'A' forming the Tamil 'ந' right side loop */}
            <motion.path
              d="M 36 50 H 58 V 59 C 58 64, 53 68, 47 68 C 41 68, 37 63, 40 57 C 43 51, 52 52, 57 56 C 61 60, 63 68, 63 76"
              stroke={blueColor}
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  // 1. Favicon Version
  if (variant === 'favicon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderSymbolSVG(size || 32, selectedConcept)}
      </div>
    );
  }

  // 2. Icon Variant (App store / Dashboard card)
  if (variant === 'icon') {
    return (
      <div 
        id={`namma-icon-${selectedConcept}`}
        className={`flex flex-col items-center justify-center rounded-3xl p-5 shadow-lg border select-none transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800' 
            : 'bg-white border-slate-100'
        } ${className}`}
        style={{ width, height }}
      >
        <div className="relative flex items-center justify-center" style={{ width: 68, height: 68 }}>
          {renderSymbolSVG(68, selectedConcept)}
        </div>
        <span 
          className="text-[9px] font-black tracking-widest mt-2.5 uppercase font-sans"
          style={{ color: textColor }}
        >
          NAMMA AREA
        </span>
      </div>
    );
  }

  // 3. Full Logo Version (Showroom / Welcome Page)
  if (variant === 'full') {
    return (
      <div 
        id={`namma-full-${selectedConcept}`}
        className={`flex flex-col items-center text-center p-4 rounded-3xl select-none transition-all duration-300 ${
          isDark ? 'bg-slate-900/40 border border-slate-800/40' : 'bg-transparent'
        } ${className}`}
        style={{ width, height }}
      >
        <div className="relative flex items-center justify-center mb-3" style={{ width: 76, height: 76 }}>
          {renderSymbolSVG(76, selectedConcept)}
        </div>
        
        <div>
          <h1 
            className="text-base font-semibold tracking-widest uppercase font-sans leading-none"
            style={{ color: textColor }}
          >
            NAMMA AREA
          </h1>
          <p 
            className="text-[10px] font-semibold mt-1.5 tracking-wide leading-none font-sans"
            style={{ color: taglineColor }}
          >
            நம்ம பகுதி, நம்ம பொறுப்பு
          </p>
        </div>
      </div>
    );
  }

  // 4. Showcase circular container
  if (variant === 'showcase') {
    return (
      <div 
        id={`namma-showcase-${selectedConcept}`}
        className={`flex items-center justify-center p-8 rounded-3xl shadow-inner select-none transition-all duration-300 ${
          isDark ? 'bg-slate-950 border border-slate-800' : 'bg-slate-50 border border-slate-100'
        } ${className}`}
        style={{ width, height }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {renderSymbolSVG(size || 110, selectedConcept)}
        </div>
      </div>
    );
  }

  // 5. Default / Navbar Horizontal Layout
  return (
    <div 
      id={`namma-navbar-${selectedConcept}`}
      className={`flex items-center gap-2.5 select-none ${className}`}
      style={{ height }}
    >
      <div className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28 }}>
        {renderSymbolSVG(28, selectedConcept)}
      </div>
      <div className="flex flex-col leading-none">
        <span 
          className="text-[12.5px] font-semibold tracking-wider uppercase font-sans"
          style={{ color: textColor }}
        >
          NAMMA AREA
        </span>
        <span 
          className="text-[8.5px] font-semibold tracking-wide mt-1 font-sans text-slate-500"
          style={{ color: taglineColor }}
        >
          நம்ம பகுதி, நம்ம பொறுப்பு
        </span>
      </div>
    </div>
  );
};
