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
  const [imgError, setImgError] = useState(false);

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

  // Render the SVGs for the perfect concept
  const renderSymbolSVG = (symbolSize: number = 100, targetConcept: LogoConcept) => {
    if (!imgError) {
      return (
        <img
          src="/logo.png"
          alt="Namma Area Logo"
          width={symbolSize}
          height={symbolSize}
          className="object-contain"
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <svg
        width={symbolSize}
        height={symbolSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* House Roof (Green #10B981) */}
        <motion.path
          d="M 12 34 L 50 8 L 88 34"
          stroke={greenColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Chimney (Green #10B981) */}
        <motion.path
          d="M 68 22 V 12 H 74 V 22"
          stroke={greenColor}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={greenColor}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        
        {/* 4-Pane Window (Green #10B981) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <rect x="45.5" y="18" width="3.5" height="3.5" fill={greenColor} rx="0.5" />
          <rect x="51" y="18" width="3.5" height="3.5" fill={greenColor} rx="0.5" />
          <rect x="45.5" y="23.5" width="3.5" height="3.5" fill={greenColor} rx="0.5" />
          <rect x="51" y="23.5" width="3.5" height="3.5" fill={greenColor} rx="0.5" />
        </motion.g>
        
        {/* Tamil Letter "ந" (Blue #2563EB) */}
        {/* Top bar */}
        <motion.path
          d="M 29 32 H 66"
          stroke={blueColor}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        />
        {/* Left leg/pillar */}
        <motion.path
          d="M 34 32 V 58"
          stroke={blueColor}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        />
        {/* Middle leg/pillar */}
        <motion.path
          d="M 50 32 V 58"
          stroke={blueColor}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        {/* Right curve and bottom sweep */}
        <motion.path
          d="M 50 40 C 58 40, 71 44, 71 54 C 71 64, 58 68, 38 68 C 30 68, 28 64, 28 60"
          stroke={blueColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        />
        
        {/* Community Circle (People) */}
        {/* Left Blue Person */}
        <motion.circle
          cx="13"
          cy="58"
          r="5"
          fill={blueColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />
        <motion.path
          d="M 8 64 C 8 84, 24 93, 50 93"
          stroke={blueColor}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
        
        {/* Right Blue Person */}
        <motion.circle
          cx="87"
          cy="58"
          r="5"
          fill={blueColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />
        <motion.path
          d="M 92 64 C 92 84, 76 93, 50 93"
          stroke={blueColor}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />
        
        {/* Center Bottom Green Person */}
        <motion.circle
          cx="50"
          cy="78"
          r="5"
          fill={greenColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
        />
        <motion.path
          d="M 23 72 C 32 84, 68 84, 77 72"
          stroke={greenColor}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
      </svg>
    );
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
        >
          <span style={{ color: blueColor }}>NAMMA</span> <span style={{ color: greenColor }}>AREA</span>
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
          >
            <span style={{ color: blueColor }}>NAMMA</span> <span style={{ color: greenColor }}>AREA</span>
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
        >
          <span style={{ color: blueColor }}>NAMMA</span> <span style={{ color: greenColor }}>AREA</span>
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
