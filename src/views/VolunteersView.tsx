import React, { useState } from 'react';
import { useRouter } from '../router';
import { getVolunteerEvents, getVolunteerProfiles, joinVolunteerEvent } from '../db_extended';
import { VolunteerEvent, VolunteerProfile } from '../types';
import { 
  ChevronLeft, Users, Calendar, MapPin, Sparkles, Heart, Check, Plus, Star
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const VolunteersView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();

  const [events, setEvents] = useState<VolunteerEvent[]>(getVolunteerEvents());
  const [profiles] = useState<VolunteerProfile[]>(getVolunteerProfiles());
  const [activeTab, setActiveTab] = useState<'drives' | 'profiles'>('drives');
  const [joinedMessage, setJoinedMessage] = useState<string | null>(null);

  const handleJoin = (id: string, title: string) => {
    const updatedEvent = joinVolunteerEvent(id);
    if (!updatedEvent) return;
    
    setEvents(getVolunteerEvents());
    
    const isJoined = updatedEvent.participants.includes('arjun_kumar');
    setJoinedMessage(isJoined ? `Registered successfully for "${title}"!` : `Cancelled registration for "${title}".`);
    
    setTimeout(() => {
      setJoinedMessage(null);
    }, 2500);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tree Plantation': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Clean-up Drives': return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'Blood Donation Camps': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Disaster Relief': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div id="volunteers-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button 
          onClick={goBack}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ChevronLeft size={16} className="stroke-[2.5px]" />
          <span>{t('back')}</span>
        </button>
        <h1 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Users size={14} className="text-blue-600" />
          Volunteer Network
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Slide Controls Drive vs Profiles */}
      <div className="flex bg-slate-50 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('drives')}
          className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
            activeTab === 'drives' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming Drives ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
            activeTab === 'profiles' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Area Volunteers ({profiles.length})
        </button>
      </div>

      {/* Floating alert */}
      {joinedMessage && (
        <div className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 shadow-lg flex items-center gap-2 z-55 animate-in fade-in slide-in-from-bottom-2">
          <Heart size={12} className="text-rose-400 fill-rose-400" />
          <span>{joinedMessage}</span>
        </div>
      )}

      {/* 1. UPCOMING DRIVES TAB */}
      {activeTab === 'drives' && (
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-3xl p-4">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Sparkles size={14} />
              Namma Area Civic Action
            </h4>
            <p className="text-[10px] text-slate-600 mt-1 leading-relaxed font-semibold">
              Get active, meet your neighbors, and build a model community. Click "Join Drive" below to reserve a slot. We coordinate with BBMP teams for logistics.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const hasJoined = event.participants.includes('arjun_kumar');
              return (
                <div
                  key={event.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  {/* Photo Banner */}
                  <div className="w-full h-32 relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute top-3 left-3 text-[8px] font-bold px-2 py-0.5 rounded uppercase border tracking-wider ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{event.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      {event.description}
                    </p>

                    {/* Meta blocks */}
                    <div className="grid grid-cols-2 gap-2 mt-1 pt-2.5 border-t border-slate-50 text-[9px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-blue-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-emerald-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Join Control Row */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[9px] text-slate-400 font-bold">
                        {event.participants.length} {event.participants.length === 1 ? 'resident joined' : 'residents joined'}
                      </span>
                      
                      <button
                        onClick={() => handleJoin(event.id, event.title)}
                        className={`py-2 px-4 rounded-xl text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          hasJoined
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100'
                        }`}
                      >
                        {hasJoined ? (
                          <>
                            <Check size={11} className="stroke-[3px]" />
                            <span>Registered</span>
                          </>
                        ) : (
                          <>
                            <Plus size={11} className="stroke-[3px]" />
                            <span>Join Drive</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VOLUNTEER PROFILES TAB */}
      {activeTab === 'profiles' && (
        <div className="flex flex-col gap-3">
          <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3 flex gap-2.5 items-center">
            <Heart size={14} className="text-blue-600 shrink-0 fill-blue-50" />
            <p className="text-[9px] text-slate-600 leading-relaxed font-semibold">
              Meet our ward's active volunteers who offer their valuable skills to local events! Want to join this list? Edit your skills in your Profile.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 mt-1">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex gap-3.5"
              >
                {/* Profile Image */}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0 shadow-xs"
                  referrerPolicy="no-referrer"
                />

                {/* Info and stats block */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{profile.name}</h4>
                      <span className="text-[8px] text-slate-400 font-semibold">{profile.area}</span>
                    </div>
                    {/* Participation Count Badge */}
                    <div className="flex items-center gap-0.5 bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded-lg text-[8px] shrink-0">
                      <Star size={9} className="fill-indigo-600 text-indigo-600" />
                      <span>{profile.participationCount} Drives</span>
                    </div>
                  </div>

                  {/* Skills lists */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-slate-50 text-slate-600 text-[8px] font-bold px-2 py-0.5 rounded-md border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Small collapsed history list */}
                  <div className="mt-3 pt-2.5 border-t border-slate-50">
                    <span className="text-[8px] text-slate-400 uppercase tracking-wider font-bold block">Recent History</span>
                    <p className="text-[9px] text-slate-600 mt-0.5 truncate font-semibold">
                      {profile.history.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
