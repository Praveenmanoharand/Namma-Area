import React, { useState } from 'react';
import { useRouter } from '../router';
import { getLeaderboard } from '../db_extended';
import { LeaderboardUser } from '../types';
import { 
  ChevronLeft, Trophy, Star, MessageSquare, Heart, FileText, Vote, Award
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const LeaderboardView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();

  const [users] = useState<LeaderboardUser[]>(getLeaderboard());

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs shadow-sm">
            🥇
          </span>
        );
      case 1:
        return (
          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-sm">
            🥈
          </span>
        );
      case 2:
        return (
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center font-bold text-xs shadow-sm">
            🥉
          </span>
        );
      default:
        return (
          <span className="w-6 h-6 rounded-full bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center font-bold text-[10px]">
            {index + 1}
          </span>
        );
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Civic Leader': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Area Champion': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Grievance Warrior': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div id="leaderboard-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
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
          <Trophy size={14} className="text-blue-600 fill-blue-50" />
          Citizen Leaderboard
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Intro Stats Summary Card */}
      <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-3xl p-5 text-white shadow-md relative overflow-hidden flex flex-col gap-3">
        <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
            <Trophy size={20} className="text-amber-300 fill-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-tight">Indiranagar Ward 4 Stars</h3>
            <p className="text-[10px] text-indigo-100 font-medium">Earn points by reporting issues, making suggestions, voting, and volunteering!</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-2.5 pt-3 flex justify-between items-center text-xs">
          <div>
            <span className="text-[9px] text-indigo-200 block">Your Current Rank</span>
            <span className="font-bold text-white text-xs">#1 Arjun Kumar (114 pts)</span>
          </div>
          <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-1 rounded-xl shadow-xs">
            Area Champion
          </span>
        </div>
      </div>

      {/* Rankings Directory List */}
      <div className="flex flex-col gap-3.5 mt-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Neighborhood Rankings</h3>
        
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`bg-white border rounded-2xl p-4 shadow-xs flex items-center gap-3.5 ${
              user.id === 'arjun_kumar' ? 'border-blue-300 bg-blue-50/10' : 'border-slate-200'
            }`}
          >
            {/* Rank Number Medal */}
            {getRankBadge(index)}

            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100 shadow-xs"
              referrerPolicy="no-referrer"
            />

            {/* User core info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {user.name}
                    {user.id === 'arjun_kumar' && (
                      <span className="text-[8px] bg-blue-100 text-blue-700 font-bold px-1 rounded">You</span>
                    )}
                  </h4>
                  <span className="text-[8px] text-slate-400 font-semibold">{user.area}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">{user.score}</span>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider block">Points</span>
                </div>
              </div>

              {/* Badges items Row */}
              <div className="flex flex-wrap gap-1 mt-1">
                {user.badges.map((badge, bIndex) => (
                  <span
                    key={bIndex}
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border ${getBadgeColor(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Collapsed metrics icons line */}
              <div className="grid grid-cols-4 gap-1 mt-2.5 pt-2 border-t border-slate-50 text-center text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex flex-col items-center gap-0.5">
                  <FileText size={10} className="text-rose-400" />
                  <span className="text-slate-800 mt-0.5">{user.complaintsSubmitted}</span>
                  <span className="text-[6px] text-slate-400">Issues</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <MessageSquare size={10} className="text-teal-400" />
                  <span className="text-slate-800 mt-0.5">{user.suggestionsMade}</span>
                  <span className="text-[6px] text-slate-400">Idea</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Vote size={10} className="text-purple-400" />
                  <span className="text-slate-800 mt-0.5">{user.pollsParticipated}</span>
                  <span className="text-[6px] text-slate-400">Votes</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Heart size={10} className="text-emerald-400" />
                  <span className="text-slate-800 mt-0.5">{user.volunteeredCount}</span>
                  <span className="text-[6px] text-slate-400">Drives</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
