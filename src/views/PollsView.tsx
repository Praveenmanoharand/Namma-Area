import React, { useState, useEffect } from 'react';
import { getPolls, voteInPoll, getCurrentUser, subscribeToPolls } from '../db';
import { CommunityPoll } from '../types';
import { 
  ArrowLeft, Vote, BarChart3, Calendar, Check, AlertCircle, 
  HelpCircle, MessageSquare, Flame, Award
} from 'lucide-react';
import { useRouter } from '../router';

export const PollsView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const [polls, setPolls] = useState<CommunityPoll[]>(getPolls());

  useEffect(() => {
    return subscribeToPolls(() => {
      setPolls(getPolls());
    });
  }, []);

  const handleVote = (pollId: string, optionIdx: number) => {
    if (!currentUser) {
      alert('You must be logged in to participate in polls.');
      return;
    }
    voteInPoll(pollId, optionIdx);
    setPolls(getPolls()); // Refresh poll state
  };

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
            <Vote size={16} className="text-blue-600" />
            Community Polls
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Democratic Decision Desk
          </p>
        </div>
      </div>

      {/* Citizen Score Poll Notice */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[8px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            CIVIC BONUS
          </span>
          <h4 className="font-extrabold text-white text-xs mt-1.5 leading-snug">
            Earn +5 Points Per Vote
          </h4>
          <p className="text-[9px] text-blue-100 mt-0.5 leading-relaxed font-semibold">
            Help shape your neighborhood policies. Your vote directly impacts local BBMP and MLA decisions!
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <Award size={24} className="text-amber-300 animate-pulse" />
        </div>
      </div>

      {/* Active Polls List */}
      <div className="flex flex-col gap-4">
        {polls.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
            <h4 className="font-extrabold text-slate-800 text-xs">No Active Polls</h4>
            <p className="text-[10px] text-slate-500 mt-1">Check back later for community surveys.</p>
          </div>
        ) : (
          polls.map((poll) => {
            const userVoteIndex = currentUser ? poll.userVotes[currentUser.id] : undefined;
            const hasVoted = userVoteIndex !== undefined;

            return (
              <div 
                key={poll.id}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm flex flex-col gap-3.5 hover:border-slate-300 transition-all duration-150"
              >
                {/* Category & Date Header */}
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded">
                    {poll.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    Ends {poll.endDate}
                  </span>
                </div>

                {/* Question */}
                <h3 className="font-extrabold text-slate-900 text-xs leading-snug flex items-start gap-2">
                  <HelpCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>{poll.question}</span>
                </h3>

                {/* Options / Results */}
                <div className="flex flex-col gap-2.5">
                  {poll.options.map((opt, optIdx) => {
                    const isSelected = userVoteIndex === optIdx;
                    // Calculate percentage
                    const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleVote(poll.id, optIdx)}
                        className={`w-full text-left rounded-xl border relative overflow-hidden transition-all duration-150 cursor-pointer ${
                          hasVoted
                            ? isSelected
                              ? 'border-blue-500 bg-blue-50/20'
                              : 'border-slate-100 bg-white'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Interactive vote result bar */}
                        {hasVoted && (
                          <div 
                            style={{ width: `${pct}%` }} 
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              isSelected ? 'bg-blue-100/60' : 'bg-slate-100/40'
                            }`}
                          />
                        )}

                        {/* Text and stats row */}
                        <div className="p-3 flex justify-between items-center relative z-10 text-xs">
                          <span className={`font-black flex items-center gap-2 ${
                            isSelected ? 'text-blue-700' : 'text-slate-800'
                          }`}>
                            {isSelected && <Check size={14} className="stroke-[3px] text-blue-600" />}
                            {opt.text}
                          </span>
                          
                          {hasVoted ? (
                            <span className="font-mono text-[10px] font-black text-slate-900 shrink-0">
                              {opt.votes} votes ({pct}%)
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                              Tap to Vote
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer total count */}
                <div className="flex justify-between items-center border-t border-slate-50 pt-3 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <BarChart3 size={12} className="text-slate-400" />
                    {poll.totalVotes} Total Votes
                  </span>
                  
                  {hasVoted ? (
                    <span className="text-emerald-600 font-extrabold uppercase tracking-wide flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                      <Check size={11} className="stroke-[3px]" />
                      Vote Registered
                    </span>
                  ) : (
                    <span className="text-amber-600 font-extrabold uppercase tracking-wide flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                      Pending Action
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
