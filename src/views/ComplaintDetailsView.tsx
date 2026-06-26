import React, { useState } from 'react';
import { useRouter } from '../router';
import { getComplaintById, upvoteComplaint, addComment, getCurrentUser } from '../db';
import { MapPin, ThumbsUp, MessageSquare, ArrowLeft, Send, ShieldCheck, Clock } from 'lucide-react';

export const ComplaintDetailsView: React.FC = () => {
  const { path, goBack } = useRouter();
  const [commentText, setCommentText] = useState('');
  const currentUser = getCurrentUser();

  // Extract ID from path e.g. "/complaints/comp1"
  const complaintId = path.split('/')[2];
  const [complaint, setComplaint] = useState(getComplaintById(complaintId));

  if (!complaint) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-600 font-bold">Complaint not found.</p>
        <button
          onClick={goBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleUpvote = () => {
    const updated = upvoteComplaint(complaint.id);
    if (updated) {
      setComplaint(getComplaintById(complaint.id));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updated = addComment(complaint.id, commentText.trim());
    if (updated) {
      setComplaint(getComplaintById(complaint.id));
      setCommentText('');
    }
  };

  return (
    <div id="complaint-details-view" className="flex flex-col gap-5 p-4 pb-12 bg-[#f8fafc]">
      {/* Navigation Header */}
      <div className="flex items-center justify-between shrink-0 select-none">
        <button
          id="details-btn-back"
          onClick={goBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-xs font-bold cursor-pointer focus:outline-none"
        >
          <ArrowLeft size={16} />
          Back to Feed
        </button>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
          complaint.status === 'Resolved'
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : complaint.status === 'In Progress'
            ? 'bg-amber-50 text-amber-600 border border-amber-100'
            : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {complaint.status}
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div className="h-52 bg-slate-100 relative">
          <img
            src={complaint.image}
            alt={complaint.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
            {complaint.category}
          </span>
        </div>

        {/* Card Header & Description */}
        <div className="p-4">
          <div className="flex gap-2.5 items-center text-slate-400 text-[10px] font-bold">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <MapPin size={11} />
              {complaint.location}
            </span>
          </div>

          <h1 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">{complaint.title}</h1>
          
          <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {complaint.description}
          </p>

          {/* Upvote & Social Actions Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={complaint.creatorAvatar}
                alt={complaint.creatorName}
                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-slate-500 font-bold">
                Reported by {complaint.creatorName}
              </span>
            </div>

            <button
              id="details-btn-upvote"
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-black transition-all duration-150 cursor-pointer ${
                complaint.upvotedBy.includes(currentUser?.id || 'arjun_kumar')
                  ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm scale-102'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <ThumbsUp size={13} className={complaint.upvotedBy.includes(currentUser?.id || 'arjun_kumar') ? 'fill-blue-600 text-blue-600' : ''} />
              <span>{complaint.upvotes} {complaint.upvotes === 1 ? 'Support' : 'Supports'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resolution Status Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
          <Clock size={15} className="text-blue-600" />
          Resolution Status Timeline
        </h3>
        
        <div className="flex flex-col gap-4 relative pl-2 select-none">
          {[
            { label: 'Submitted', desc: 'Grievance registered in the ward system', time: 'Day 0' },
            { label: 'Under Review', desc: 'Ward officer verifying coordinates & depth', time: 'Day 1' },
            { label: 'Assigned', desc: 'Dispatched to specialized ward contractor', time: 'Day 2' },
            { label: 'In Progress', desc: 'Remediation and on-site repair work active', time: 'Day 3' },
            { label: 'Resolved', desc: 'Remediation completed & certified by inspector', time: 'Completed' },
          ].map((step, idx) => {
            const getStatusStepIndex = (status: string): number => {
              switch (status) {
                case 'Pending':
                  return 1;
                case 'In Progress':
                  return 3;
                case 'Resolved':
                  return 4;
                default:
                  return 0;
              }
            };
            const activeStep = getStatusStepIndex(complaint.status);
            const isCompleted = idx < activeStep || (complaint.status === 'Resolved' && idx <= activeStep);
            const isActive = idx === activeStep && complaint.status !== 'Resolved';
            const isUpcoming = idx > activeStep && complaint.status !== 'Resolved';
            
            return (
              <div key={idx} className="relative flex gap-4 items-start">
                {/* Connecting Line */}
                {idx < 4 && (
                  <div className={`absolute left-[11px] top-6 w-[2px] h-[calc(100%+8px)] -z-0 ${
                    idx < activeStep 
                      ? 'bg-emerald-500' 
                      : idx === activeStep && complaint.status === 'In Progress'
                      ? 'bg-emerald-500'
                      : 'bg-slate-100'
                  }`} />
                )}
                
                {/* Step Circle */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] relative z-10 border-2 ${
                  isCompleted 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                    : isActive 
                    ? 'bg-blue-50 border-blue-600 text-blue-600 animate-pulse' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className={`text-xs font-extrabold ${
                      isCompleted 
                        ? 'text-slate-800' 
                        : isActive 
                        ? 'text-blue-600 font-black' 
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : isActive 
                        ? 'bg-blue-50 text-blue-600 font-extrabold' 
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                      {isActive ? 'Active' : isCompleted ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-relaxed mt-0.5 ${
                    isUpcoming ? 'text-slate-400 font-medium' : 'text-slate-500'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Location Map Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
          <MapPin size={15} className="text-blue-600" />
          Ward Landmark Map
        </h3>
        {/* Simulated Static Map graphic */}
        <div className="h-28 bg-[#e2eafc] rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-100 shadow-inner select-none">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2563eb_1.2px,transparent_1.2px)] [background-size:16px_16px]"></div>
          {/* Mock Roads */}
          <div className="absolute top-1/2 left-0 w-full h-4 bg-white/70 border-y border-slate-300/30"></div>
          <div className="absolute left-1/3 top-0 w-4 h-full bg-white/70 border-x border-slate-300/30"></div>
          
          <div className="relative flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600/15 flex items-center justify-center animate-ping absolute"></div>
            <MapPin size={28} className="text-blue-600 fill-blue-600 relative z-10 filter drop-shadow" />
          </div>

          <span className="absolute bottom-2 right-2.5 text-[8px] bg-white/90 text-slate-500 font-bold px-1.5 py-0.5 rounded shadow">
            GPS Locked: {complaint.location}
          </span>
        </div>
      </div>

      {/* Comments & Discussion Thread */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-1">
          <MessageSquare size={15} className="text-blue-600" />
          Resolution Comments ({complaint.comments.length})
        </h3>

        {complaint.comments.length === 0 ? (
          <div className="py-4 text-center text-slate-400 text-xs">
            No comments yet. Leave a note below to coordinate.
          </div>
        ) : (
          <div className="flex flex-col gap-3 divide-y divide-slate-100">
            {complaint.comments.map((comm) => (
              <div key={comm.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                <img
                  src={comm.authorAvatar}
                  alt={comm.authorName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-extrabold text-slate-800 text-xs">{comm.authorName}</h4>
                    <span className="text-[8px] text-slate-400 font-semibold">
                      {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leave a Comment form */}
        <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2 pt-3 border-t border-slate-100">
          <input
            id="details-comment-input"
            type="text"
            placeholder="Add to the discussion..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all duration-150"
          />
          <button
            id="details-comment-submit"
            type="submit"
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 cursor-pointer shadow-sm focus:outline-none flex items-center justify-center shrink-0"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
};
