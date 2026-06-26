import React, { useState, useRef } from 'react';
import { useRouter } from '../router';
import { createComplaint } from '../db';
import { MapPin, Camera, AlertCircle, Sparkles, UploadCloud, X, Check } from 'lucide-react';
import { ComplaintCategory } from '../types';
import { useLanguage } from '../LanguageContext';

export const CreateComplaintView: React.FC = () => {
  const { navigateTo } = useRouter();
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Sanitation');
  const [location, setLocation] = useState('Indiranagar');
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant states
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<{
    title: string;
    description: string;
    category: ComplaintCategory;
    severity: string;
  } | null>(null);

  const handleGenerateAiContent = async () => {
    if (!aiNotes.trim()) return;
    setAiLoading(true);
    setAiError('');
    setAiSuggestion(null);

    try {
      const response = await fetch('/api/complaint-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: aiNotes,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI feedback');
      }

      const data = await response.json();
      setAiSuggestion(data);
    } catch (err) {
      console.error(err);
      setAiError('Failed to format with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setTitle(aiSuggestion.title);
    setDescription(aiSuggestion.description);
    setCategory(aiSuggestion.category);
    setShowAiInput(false);
    setAiNotes('');
    setAiSuggestion(null);
  };


  // Category fallback images to simulate a real photo upload!
  const categoryImages: Record<ComplaintCategory, string> = {
    Sanitation: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    Roads: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    'Water Supply': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
    'Street Lights': 'https://images.unsplash.com/photo-1509143142904-0cdef01839db?auto=format&fit=crop&w=600&q=80',
    Safety: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    Other: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=600&q=80',
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) {
      setError('Please fill in all the required fields');
      return;
    }

    // Use the uploaded file preview OR fall back to the category image
    const finalImage = imagePreview || categoryImages[category];

    createComplaint(title, description, category, location, finalImage);
    navigateTo('/success');
  };

  return (
    <div id="create-complaint-view" className="flex flex-col gap-6 p-4 pb-12 font-sans">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Camera size={18} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-none">{t('reportNewIssue')}</h1>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Submit a grievance to your ward officers</p>
        </div>
      </div>

      {/* AI Complaint Assistant Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600 fill-blue-50" />
            AI Complaint Assistant
          </h3>
          <span className="text-[7px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Gemini
          </span>
        </div>
        
        <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
          Roughly type what's wrong in simple shorthand words (or mix of Tamil & English), and let Gemini format it, pick the right category, and estimate severity level!
        </p>

        {showAiInput ? (
          <div className="flex flex-col gap-2.5 mt-1">
            <textarea
              rows={2}
              placeholder="e.g., indiranagar cross road la pothole iruku heavy rain water filled dangerous for bike riders"
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-[10px] focus:border-blue-600 outline-none resize-none leading-relaxed font-semibold shadow-xs"
            />
            {aiError && (
              <p className="text-[9px] text-red-600 font-semibold">{aiError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerateAiContent}
                disabled={aiLoading || !aiNotes.trim()}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                {aiLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Formatting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>Format with AI</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAiInput(false);
                  setAiNotes('');
                  setAiSuggestion(null);
                }}
                className="px-3.5 py-2 border border-slate-200 text-slate-500 text-[10px] font-bold rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAiInput(true)}
            className="w-full bg-white border border-blue-200 text-blue-700 font-bold py-2.5 px-4 rounded-xl text-[10px] flex items-center justify-center gap-1.5 hover:bg-blue-50 cursor-pointer shadow-xs transition-all duration-150"
          >
            <Sparkles size={12} className="text-blue-600" />
            Launch AI Assistant
          </button>
        )}

        {/* AI Suggestion Results Summary */}
        {aiSuggestion && (
          <div className="bg-white border border-blue-100 rounded-xl p-3 flex flex-col gap-2 mt-1 shadow-xs animate-in slide-in-from-top-2 duration-150">
            <h4 className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Recommendation</h4>
            
            <div className="flex flex-col gap-1.5 text-[10px]">
              <p className="text-slate-800 font-bold leading-tight">
                <span className="text-slate-400 font-medium">Title:</span> {aiSuggestion.title}
              </p>
              <p className="text-slate-600 leading-relaxed font-semibold">
                <span className="text-slate-400 font-medium">Description:</span> {aiSuggestion.description}
              </p>
              <div className="flex gap-1.5 mt-1">
                <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[8px] border border-blue-100">
                  Category: {aiSuggestion.category}
                </span>
                <span className={`font-bold px-2 py-0.5 rounded text-[8px] border ${
                  aiSuggestion.severity === 'Critical'
                    ? 'bg-red-50 text-red-700 border-red-100'
                    : aiSuggestion.severity === 'Major'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  Severity: {aiSuggestion.severity}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={applyAiSuggestion}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-[10px] mt-2 flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
            >
              <Check size={12} className="stroke-[2.5px]" />
              Apply AI Recommendation to Form
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-3.5 py-2 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Category Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('category')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Sanitation', 'Roads', 'Water Supply', 'Street Lights', 'Safety', 'Other'] as ComplaintCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                id={`btn-cat-select-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setCategory(cat)}
                className={`py-2 px-1 text-[10px] font-semibold border rounded-xl text-center cursor-pointer transition-all duration-150 ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm font-bold'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Title Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('issueTitle')}</label>
          <input
            id="create-input-title"
            type="text"
            placeholder={t('issueTitlePlaceholder')}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all duration-200 font-medium"
            required
          />
        </div>

        {/* Location Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('location')}</label>
          <div className="relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="create-input-location"
              type="text"
              placeholder={t('locationPlaceholder')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-200 font-medium"
              required
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('description')}</label>
          <textarea
            id="create-input-description"
            rows={4}
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all duration-200 resize-none leading-relaxed font-medium"
            required
          ></textarea>
        </div>

        {/* File Drag & Drop + Click Upload Widget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{t('uploadImage')}</label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative border border-slate-200 rounded-2xl overflow-hidden shadow-sm aspect-video bg-slate-50">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                id="btn-remove-preview-img"
                onClick={removeImage}
                className="absolute top-2.5 right-2.5 bg-slate-900/70 hover:bg-slate-900 text-white p-1.5 rounded-full cursor-pointer focus:outline-none shadow"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-600 bg-white'
              }`}
            >
              <UploadCloud size={32} className={`${dragActive ? 'text-blue-600 animate-bounce' : 'text-slate-400'} mb-2`} />
              <span className="text-xs font-bold text-slate-700">Drag & Drop photo here</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">or click to browse from device gallery</span>
            </div>
          )}
        </div>

        {/* Important Info Alert */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start mt-2">
          <AlertCircle size={15} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
            By submitting, you declare this issue occurs in public. BBMP officials and registered contributors will track and review the progress.
          </p>
        </div>

        {/* Submit button */}
        <button
          id="create-btn-submit"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-bold text-xs shadow-lg shadow-blue-200/50 transition-all duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <Sparkles size={14} />
          {t('submitReport')}
        </button>
      </form>
    </div>
  );
};
