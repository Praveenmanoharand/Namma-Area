import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../router';
import { getComplaints, upvoteComplaint, getCurrentUser, subscribeToComplaints } from '../db';
import { MapPin, Search, ThumbsUp, MessageSquare, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { ComplaintCategory, ComplaintStatus } from '../types';
import { KeywordSearchIndex } from '../utils/searchIndex';

export const ComplaintFeedView: React.FC = () => {
  const { navigateTo } = useRouter();
  const currentUser = getCurrentUser();
  const [complaints, setComplaints] = useState(getComplaints());

  // Real-time Firestore synchronizer subscription
  useEffect(() => {
    return subscribeToComplaints(() => {
      setComplaints(getComplaints());
    });
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'All'>('All');

  // Trigger state refresh for upvotes
  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid opening details on upvote click
    const updated = upvoteComplaint(id);
    if (updated) {
      setComplaints(getComplaints());
    }
  };

  const searchIndex = useMemo(() => {
    return new KeywordSearchIndex(complaints, ['title', 'description', 'location', 'category']);
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const searched = searchIndex.search(searchTerm, complaints);
    return searched.filter((item) => {
      const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesStatus && matchesCategory;
    });
  }, [searchIndex, searchTerm, complaints, selectedStatus, selectedCategory]);

  return (
    <div id="complaint-feed-view" className="flex flex-col gap-4 p-4 pb-12">
      {/* Feed Header */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-none">Community Feed</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time local reports and repairs</p>
        </div>
        <button
          id="feed-btn-create"
          onClick={() => navigateTo('/create')}
          className="bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all duration-150 cursor-pointer"
        >
          Report Issue
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="feed-search-input"
          type="text"
          placeholder="Search by street name, keyword, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex border-b border-slate-100 select-none">
        {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((status) => (
          <button
            key={status}
            id={`tab-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedStatus(status)}
            className={`flex-1 py-2.5 text-center text-xs font-bold border-b-2 transition-all duration-150 cursor-pointer ${
              selectedStatus === status
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Category Chips scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none shrink-0">
        <button
          id="chip-cat-all"
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold shrink-0 border cursor-pointer transition-all duration-150 ${
            selectedCategory === 'All'
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
          }`}
        >
          All Categories
        </button>
        {(['Sanitation', 'Roads', 'Water Supply', 'Street Lights', 'Safety', 'Other'] as ComplaintCategory[]).map((cat) => (
          <button
            key={cat}
            id={`chip-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold shrink-0 border cursor-pointer transition-all duration-150 ${
              selectedCategory === cat
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      <div className="flex flex-col gap-4 mt-2">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <AlertCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-slate-800 text-sm font-bold">No issues found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your keyword searches or filters</p>
          </div>
        ) : (
          filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo(`/complaints/${item.id}`)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-600 transition-all duration-200 cursor-pointer"
            >
              {/* Photo & Badge */}
              <div className="relative h-44 bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  {item.category}
                </span>

                {/* Status Badge */}
                <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm text-white ${
                  item.status === 'Resolved'
                    ? 'bg-emerald-500'
                    : item.status === 'In Progress'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                
                {/* Progress bar for progress visualization */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1.5">
                    <span>Resolution Status</span>
                    <span className={
                      item.status === 'Resolved' 
                        ? 'text-emerald-600' 
                        : item.status === 'In Progress'
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }>
                      {item.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.status === 'Resolved' 
                          ? 'bg-emerald-500 w-full' 
                          : item.status === 'In Progress'
                          ? 'bg-amber-500 w-2/3'
                          : 'bg-red-400 w-1/4'
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Card Footer: Metadata and Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" />
                    {item.location}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Upvote Button */}
                    <button
                      id={`btn-upvote-${item.id}`}
                      onClick={(e) => handleUpvote(e, item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-black transition-all duration-150 cursor-pointer ${
                        item.upvotedBy.includes(currentUser?.id || 'arjun_kumar')
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      <ThumbsUp size={13} className={item.upvotedBy.includes(currentUser?.id || 'arjun_kumar') ? 'fill-blue-600 text-blue-600' : ''} />
                      <span>{item.upvotes} {item.upvotes === 1 ? 'Support' : 'Supports'}</span>
                    </button>

                    {/* Comments indicator */}
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold bg-slate-50 px-2 py-1 rounded-lg">
                      <MessageSquare size={13} />
                      {item.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
  );
};
