import React, { useState } from 'react';
import { useRouter } from '../router';
import { getSuggestions, createSuggestion, upvoteSuggestion } from '../db_extended';
import { Suggestion } from '../types';
import { 
  ChevronLeft, Inbox, Lightbulb, Plus, ThumbsUp, MapPin, Tag, MessageSquare, AlertCircle, Sparkles
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const SuggestionsView: React.FC = () => {
  const { goBack } = useRouter();
  const { t } = useLanguage();
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>(getSuggestions());
  const [showForm, setShowForm] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Suggestion['category']>('General Suggestions');
  const [area, setArea] = useState('Indiranagar');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpvote = (id: string) => {
    upvoteSuggestion(id);
    setSuggestions(getSuggestions());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !area) {
      setError('Please fill in all required fields.');
      return;
    }

    createSuggestion(title, description, category, area);
    setSuggestions(getSuggestions());
    setSuccess(true);
    
    // Clear form
    setTitle('');
    setDescription('');
    setCategory('General Suggestions');
    
    setTimeout(() => {
      setSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Reviewed': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Park Requests': return 'text-emerald-600 bg-emerald-50';
      case 'Road Improvements': return 'text-amber-600 bg-amber-50';
      case 'Public Facility Requests': return 'text-indigo-600 bg-indigo-50';
      case 'Bus Stop Requests': return 'text-sky-600 bg-sky-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div id="suggestions-view" className="flex flex-col gap-5 p-4 pb-12 font-sans select-none animate-in fade-in duration-200">
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
          <Lightbulb size={14} className="text-blue-600 fill-blue-50" />
          Public Suggestion Box
        </h1>
        <div className="w-12"></div>
      </div>

      {/* Hero Banner Description */}
      {!showForm && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Crowdsource Neighborhood Projects</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-medium">
              Have an idea for a park, public library, better footpaths, or solar installations? Submit your suggestion and gather supporting upvotes from fellow residents! Approved ideas will be reviewed in the monthly ward budget meeting.
            </p>
          </div>
          <button
            onClick={() => {
              setError('');
              setShowForm(true);
            }}
            className="self-start text-[10px] bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-200 cursor-pointer hover:bg-blue-700 transition-all duration-150"
          >
            <Plus size={14} className="stroke-[2.5px]" />
            Submit New Suggestion
          </button>
        </div>
      )}

      {/* Create Suggestion Form Modal Card */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md flex flex-col gap-4 animate-in slide-in-from-top-4 duration-250">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              New Community Suggestion
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {success ? (
            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-6 rounded-2xl border border-emerald-100 text-center flex flex-col items-center justify-center gap-2">
              <ThumbsUp size={28} className="text-emerald-500 animate-bounce" />
              Suggestion Submitted Successfully!
              <p className="text-[9px] text-emerald-500 mt-1 font-semibold">Your idea is now open for public upvoting.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-[10px] font-bold p-2.5 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Suggestion Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Waste Recycling Bin in Block 2"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-150 font-semibold"
                  required
                />
              </div>

              {/* Category selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Suggestion['category'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:border-blue-600 outline-none transition-all duration-150 font-semibold"
                >
                  <option value="Park Requests">Park Requests</option>
                  <option value="Road Improvements">Road Improvements</option>
                  <option value="Public Facility Requests">Public Facility Requests</option>
                  <option value="Bus Stop Requests">Bus Stop Requests</option>
                  <option value="General Suggestions">General Suggestions</option>
                </select>
              </div>

              {/* Area */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Neighborhood Area *</label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., Indiranagar Sector 4"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-150 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Description & Impact *</label>
                <textarea
                  rows={4}
                  placeholder="Why is this suggestion important? How will it benefit our neighborhood community?"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-150 resize-none leading-relaxed font-semibold"
                  required
                ></textarea>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs transition-all duration-150 cursor-pointer mt-1"
              >
                Lodge Suggestion
              </button>
            </form>
          )}
        </div>
      )}

      {/* Suggestions Feed Directory */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Live Suggestion Feed</h3>
        
        {suggestions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
            No suggestions submitted yet. Be the first to lodge one!
          </div>
        ) : (
          suggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3"
            >
              {/* Creator details and status badge */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={sug.creatorAvatar}
                    alt={sug.creatorName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-800">{sug.creatorName}</h5>
                    <div className="flex items-center gap-1 text-[8px] text-slate-400 mt-0.5">
                      <MapPin size={8} />
                      <span>{sug.area}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${getStatusColor(sug.status)}`}>
                  {sug.status}
                </span>
              </div>

              {/* Content block */}
              <div>
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md inline-block mb-1.5 ${getCategoryColor(sug.category)}`}>
                  {sug.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{sug.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                  {sug.description}
                </p>
              </div>

              {/* Footer interactive buttons */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-50">
                <span className="text-[8px] text-slate-400 font-semibold">
                  {new Date(sug.createdAt).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleUpvote(sug.id)}
                  className={`flex items-center gap-1.5 py-1 px-3.5 rounded-lg text-[9px] font-bold border transition-all duration-100 cursor-pointer ${
                    sug.upvotedBy.includes('arjun_kumar')
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <ThumbsUp size={11} className={sug.upvotedBy.includes('arjun_kumar') ? 'fill-blue-600' : ''} />
                  <span>{sug.upvotes} Upvotes</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
