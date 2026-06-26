import React, { useState } from 'react';
import { useRouter } from '../router';
import { 
  getGroups, joinGroup, leaveGroup, getGroupPosts, createGroupPost, likeGroupPost 
} from '../db_extended';
import { AreaGroup, GroupPost } from '../types';
import { 
  ChevronLeft, Users, Plus, Check, Heart, ThumbsUp, Send, MessageSquare, Megaphone, Info
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const GroupsView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();

  const [groups, setGroups] = useState<AreaGroup[]>(getGroups());
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Feed of selected group
  const [feedPosts, setFeedPosts] = useState<GroupPost[]>([]);
  const [newPostText, setNewPostText] = useState('');

  const activeGroup = groups.find(g => g.id === selectedGroupId);

  const handleGroupSelect = (id: string) => {
    setSelectedGroupId(id);
    setFeedPosts(getGroupPosts(id));
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
    setGroups(getGroups()); // Refresh membership states
  };

  const handleToggleMembership = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const isMember = group.members.includes('arjun_kumar');
    if (isMember) {
      leaveGroup(groupId);
    } else {
      joinGroup(groupId);
    }
    setGroups(getGroups());
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !newPostText.trim()) return;

    createGroupPost(selectedGroupId, newPostText);
    setFeedPosts(getGroupPosts(selectedGroupId));
    setNewPostText('');
  };

  const handleLikePost = (postId: string) => {
    likeGroupPost(postId);
    if (selectedGroupId) {
      setFeedPosts(getGroupPosts(selectedGroupId));
    }
  };

  return (
    <div id="groups-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
      
      {/* 1. MAIN GROUPS LIST SCREEN */}
      {!selectedGroupId ? (
        <div className="flex flex-col gap-5">
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
              Area Groups
            </h1>
            <div className="w-12"></div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5 flex gap-2.5 items-start border border-slate-100">
            <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
              Join resident groups, apartment communities, or interest clubs to coordinate neighborhood activities, share tips, or discuss civic problems in dedicated feeds.
            </p>
          </div>

          {/* Group directory cards */}
          <div className="flex flex-col gap-4 mt-1">
            {groups.map((group) => {
              const isMember = group.members.includes('arjun_kumar');
              return (
                <div
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col"
                >
                  {/* Photo cover banner */}
                  <div className="w-full h-24 relative">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover brightness-95"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 right-3 text-[8px] bg-white text-slate-800 font-bold px-2 py-0.5 rounded-md shadow-sm border border-slate-100 uppercase tracking-wider">
                      {group.category}
                    </span>
                  </div>

                  {/* Text area */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{group.name}</h4>
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{group.memberCount} Members</span>
                      </div>

                      {/* Join / Leave button */}
                      <button
                        onClick={(e) => handleToggleMembership(group.id, e)}
                        className={`py-1.5 px-3.5 rounded-lg text-[8px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isMember
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {isMember ? (
                          <>
                            <Check size={10} className="stroke-[3px]" />
                            <span>Joined</span>
                          </>
                        ) : (
                          <>
                            <Plus size={10} className="stroke-[3px]" />
                            <span>Join</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold pr-1">
                      {group.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. SPECIFIC SELECTED GROUP FEED SCREEN */
        <div className="flex flex-col gap-4">
          {/* Sub Header bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <button 
              onClick={handleBackToGroups}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft size={16} className="stroke-[2.5px]" />
              <span>Back</span>
            </button>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate max-w-44">
              {activeGroup?.name}
            </span>
            <div className="w-12"></div>
          </div>

          {/* Group details hero box */}
          {activeGroup && (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex flex-col gap-2 relative overflow-hidden shadow-md">
              <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
              <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider font-bold inline-block self-start">
                Group Hub • {activeGroup.category}
              </span>
              <h3 className="text-xs font-bold tracking-tight leading-tight">{activeGroup.name}</h3>
              <p className="text-[9px] text-slate-300 font-medium leading-relaxed mt-0.5">{activeGroup.description}</p>
              
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/10 text-[9px] text-indigo-200">
                <span>{activeGroup.memberCount} Members enrolled</span>
                <button
                  onClick={(e) => handleToggleMembership(activeGroup.id, e)}
                  className="bg-white/10 text-white hover:bg-white/20 font-bold px-2.5 py-1.5 rounded-lg text-[8px]"
                >
                  {activeGroup.members.includes('arjun_kumar') ? 'Leave Group' : 'Join Group'}
                </button>
              </div>
            </div>
          )}

          {/* Post Message Form (Only if joined) */}
          {activeGroup?.members.includes('arjun_kumar') ? (
            <form onSubmit={handlePostSubmit} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex flex-col gap-2.5">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Start a discussion</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share what is happening..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-150 font-semibold"
                  required
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  <Send size={14} className="stroke-[2px]" />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
              <p className="text-[9px] text-slate-400 font-bold">You are in read-only mode.</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Join the group to participate in discussions and submit posts.</p>
            </div>
          )}

          {/* Group Feed posts list */}
          <div className="flex flex-col gap-3.5 mt-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={13} />
              Recent Feed
            </h4>

            {feedPosts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-[10px] font-medium">
                No active discussion posts in this feed yet.
              </div>
            ) : (
              feedPosts.map((post) => {
                const isLiked = post.likedBy.includes('arjun_kumar');
                return (
                  <div
                    key={post.id}
                    className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex gap-3.5"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-800">{post.authorName}</span>
                        <span className="text-[8px] text-slate-400 font-medium">
                          {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 text-[8px] font-bold transition-all ${
                            isLiked ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <ThumbsUp size={11} className={isLiked ? 'fill-rose-600 stroke-rose-600' : ''} />
                          <span>{post.likes} Likes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
