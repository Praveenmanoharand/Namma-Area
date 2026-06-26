import React, { useState } from 'react';
import { 
  ArrowLeft, HelpCircle, BookOpen, Phone, ChevronDown, 
  MessageSquare, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { useRouter } from '../router';

interface FAQ {
  q: string;
  a: string;
}

export const HelpView: React.FC = () => {
  const { goBack } = useRouter();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      q: 'How do I raise a grievance on Namma Area?',
      a: 'Navigate to the bottom tabs, click "Report", fill out the title, select category (Street Lights, Sanitation, Water, Roads etc.), specify location, attach a photo of the incident, and submit. BBMP ward engineers receive this automatically.'
    },
    {
      q: 'What is the Citizen Civic Standing score?',
      a: 'The Citizen Score is a loyalty rating based on your civic contributions. You gain +10 points for raising issues, +5 points for voting on policies, +15 points for volunteering, and +8 points for posting local jobs. Your score increases your ward rank!'
    },
    {
      q: 'Are my contact details safe on the directory?',
      a: 'Yes, your phone number is encrypted and only visible to authorized municipal officers or directly simulated for registered helpers and blood donors on request.'
    },
    {
      q: 'Who manages the Namma Area platform?',
      a: 'Namma Area is built in partnership with Ward 4 Resident Welfare Association, BBMP Ward Corporator office, and Bengaluru Civic Technology Cell volunteers.'
    }
  ];

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
            <HelpCircle size={16} className="text-blue-600" />
            Help & Support
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Grievances & Platform User Manual
          </p>
        </div>
      </div>

      {/* Manual Intro Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4.5 shadow-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[8px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider">
            Quick Guide
          </span>
          <h4 className="font-extrabold text-white text-xs mt-1.5 leading-snug">
            Ward 4 Democratic Portal
          </h4>
          <p className="text-[9px] text-blue-100 mt-0.5 leading-relaxed font-semibold">
            Namma Area is your direct digital interface with BBMP. Learn how to raise complaints, participate in voting, register as a blood donor, and keep our neighborhood beautiful.
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <BookOpen size={24} className="text-yellow-200 animate-pulse" />
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <HelpCircle size={14} />
          Frequently Asked Questions
        </h3>

        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-150"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-left cursor-pointer hover:bg-slate-50"
              >
                <span className="font-extrabold text-slate-900 text-xs leading-snug pr-4">
                  {faq.q}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-slate-50 pt-3 text-[10px] text-slate-600 leading-relaxed font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helpdesk Contact Support Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <MessageSquare size={14} className="text-blue-600" />
          Ward Grievance Coordinator
        </h3>
        <p className="text-[10px] text-slate-500 font-semibold leading-normal">
          For app issues, user feedback, or direct assistance with BBMP municipal listings:
        </p>

        <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-3 mt-1">
          <div>
            <h4 className="font-extrabold text-slate-800 text-[11px]">Namma Area Citizen Support</h4>
            <span className="text-[10px] font-mono text-slate-500 block">support@nammaarea.in</span>
          </div>
          <a 
            href="mailto:support@nammaarea.in"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all duration-150"
          >
            <ExternalLink size={11} />
            Email
          </a>
        </div>
      </div>
    </div>
  );
};
