import React from 'react';
import { useRouter } from '../router';
import { CheckCircle2, ArrowRight, Eye, LayoutDashboard, ShieldCheck } from 'lucide-react';

export const SuccessView: React.FC = () => {
  const { navigateTo } = useRouter();

  return (
    <div id="success-view" className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
      {/* Interactive Success Checkmark Ring Illustration */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-6">
        {/* Outer subtle concentric rings */}
        <div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping opacity-35"></div>
        <div className="absolute w-28 h-28 bg-emerald-100/50 rounded-full"></div>
        <div className="absolute w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
          <CheckCircle2 size={44} className="text-white stroke-[2.5]" />
        </div>
      </div>

      {/* Success Messages */}
      <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
        Grievance Registered!
      </h1>
      <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
        Your complaint has been successfully recorded in the Indiranagar Ward database. A notification and reference ID have been dispatched to the civic area officers.
      </p>

      {/* Dispatch status indicator */}
      <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 flex items-center gap-2 max-w-xs mx-auto">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">
          Verification Pending: ETA 24 Hrs
        </span>
      </div>

      {/* Navigational Action Keys */}
      <div className="flex flex-col gap-3 w-full mt-8 max-w-xs">
        <button
          id="success-btn-dashboard"
          onClick={() => navigateTo('/dashboard')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-lg shadow-blue-200/50 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LayoutDashboard size={14} />
          Go to Dashboard
        </button>
        <button
          id="success-btn-feed"
          onClick={() => navigateTo('/complaints')}
          className="w-full bg-white text-slate-700 border border-slate-200 hover:border-slate-300 py-3.5 px-4 rounded-xl font-bold text-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Eye size={14} />
          View Community Feed
        </button>
      </div>
    </div>
  );
};
