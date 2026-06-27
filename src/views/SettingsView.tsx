import React, { useState } from 'react';
import { 
  ArrowLeft, Settings, Bell, Globe, Shield, HelpCircle, 
  Check, Smartphone, Sparkles, Languages
} from 'lucide-react';
import { useRouter } from '../router';
import { getCurrentUser, updateUserProfile } from '../db';
import { useLanguage } from '../LanguageContext';

export const SettingsView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const { language, setLanguage, t } = useLanguage();

  // Settings states
  const [notifyEmergency, setNotifyEmergency] = useState(true);
  const [notifyGrievance, setNotifyGrievance] = useState(true);
  const [notifyPolls, setNotifyPolls] = useState(false);
  const [formPhone, setFormPhone] = useState(currentUser?.mobileNumber || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      mobileNumber: formPhone,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  return (
    <div className="p-4 flex flex-col gap-5 min-h-screen pb-24 relative font-sans">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <button 
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition-all duration-150"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Settings size={16} className="text-blue-600 animate-spin-slow" />
            {t('settings')}
          </h2>
          <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
            Configure your Namma Area experience
          </p>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <Globe size={14} className="text-blue-600" />
          {t('chooseLanguage')}
        </h3>
        <p className="text-[10px] text-slate-500 font-medium leading-normal">
          {t('languageDesc')}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <button
            onClick={() => setLanguage('en')}
            className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              language === 'en' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Languages size={14} />
            English
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              language === 'ta' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            தமிழ் (Tamil)
          </button>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3.5">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <Bell size={14} className="text-blue-600" />
          {t('wardNotifications')}
        </h3>

        <div className="flex flex-col gap-3.5">
          {/* Emergency Alert notifications toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">{t('emergencyAlerts')}</h4>
              <p className="text-[10px] text-slate-500 font-medium">{t('emergencyAlertsDesc')}</p>
            </div>
            <button
              onClick={() => setNotifyEmergency(!notifyEmergency)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors ${notifyEmergency ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifyEmergency ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Grievance progress notifications toggle */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">{t('myGrievanceUpdates')}</h4>
              <p className="text-[10px] text-slate-500 font-medium">{t('myGrievanceUpdatesDesc')}</p>
            </div>
            <button
              onClick={() => setNotifyGrievance(!notifyGrievance)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors ${notifyGrievance ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifyGrievance ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Polls toggle */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs">{t('newCommunityPolls')}</h4>
              <p className="text-[10px] text-slate-500 font-medium">{t('newCommunityPollsDesc')}</p>
            </div>
            <button
              onClick={() => setNotifyPolls(!notifyPolls)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors ${notifyPolls ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notifyPolls ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      {currentUser && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Smartphone size={14} className="text-blue-600" />
            {t('contactInfo')}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium leading-normal">
            {t('contactInfoDesc')}
          </p>

          <div className="flex flex-col gap-2.5 mt-1">
            <input
              type="tel"
              required
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="e.g. 9845012345"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-medium bg-slate-50"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all duration-150 active:scale-[0.98]"
            >
              {t('saveChange')}
            </button>
          </div>
        </form>
      )}

      {/* Safety & Moderation guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 flex items-start gap-3">
        <Shield className="text-slate-500 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="font-bold text-[11px] uppercase tracking-wide text-slate-800">{t('verifiedShield')}</h4>
          <p className="text-[10px] leading-relaxed text-slate-500 mt-0.5 font-medium">
            {t('verifiedShieldDesc')}
          </p>
        </div>
      </div>

      {/* Floating Save Confirmation Toast */}
      {showSavedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl px-4 py-2 text-[10px] font-bold shadow-xl z-50 flex items-center gap-1.5 border border-slate-800 animate-in fade-in zoom-in duration-200">
          <Check size={12} className="text-emerald-500 stroke-[3px]" />
          <span>{t('savedSuccessfully')}</span>
        </div>
      )}
    </div>
  );
};
