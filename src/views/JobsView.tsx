import React, { useState, useEffect } from 'react';
import { getJobs, createJob, getCurrentUser, subscribeToJobs } from '../db';
import { LocalJob } from '../types';
import { 
  Search, Filter, MapPin, Phone, Plus, List, Briefcase, 
  ArrowLeft, Check, AlertCircle, Sparkles, Building, Coins, PhoneCall
} from 'lucide-react';
import { useRouter } from '../router';

export const JobsView: React.FC = () => {
  const { goBack } = useRouter();
  const currentUser = getCurrentUser();
  const [jobs, setJobs] = useState<LocalJob[]>(getJobs());

  useEffect(() => {
    return subscribeToJobs(() => {
      setJobs(getJobs());
    });
  }, []);
  const [activeTab, setActiveTab] = useState<'feed' | 'post'>('feed');
  
  // Feed states
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<LocalJob | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formEmployer, setFormEmployer] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCategory, setFormCategory] = useState<LocalJob['category']>('Other');
  const [formSalary, setFormSalary] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Simulate contact call state
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formEmployer || !formLocation || !formSalary || !formContact) {
      alert('Please fill out all required fields.');
      return;
    }

    createJob(
      formTitle,
      formEmployer,
      formLocation,
      formCategory,
      formSalary,
      formContact,
      formDesc
    );

    setJobs(getJobs());
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setActiveTab('feed');
      // Reset form
      setFormTitle('');
      setFormEmployer('');
      setFormLocation('');
      setFormSalary('');
      setFormContact('');
      setFormDesc('');
    }, 1500);
  };

  const categories: string[] = [
    'All', 'Electrician', 'Plumber', 'Driver', 'Delivery', 'Housekeeping', 'Part Time', 'Other'
  ];

  // Filtering
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.employer.toLowerCase().includes(search.toLowerCase()) ||
                          job.location.toLowerCase().includes(search.toLowerCase()) ||
                          job.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'All' ? true : job.category === catFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 flex flex-col gap-5 min-h-screen pb-24 relative">
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
            <Briefcase size={16} className="text-blue-600" />
            Namma Local Jobs
          </h2>
          <p className="text-[10px] text-slate-500 font-semibold leading-none mt-1">
            Ward 4 Employment Board
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => { setActiveTab('feed'); setSelectedJob(null); }}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'feed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <List size={14} />
          View Listings
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'post' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Plus size={14} />
          Post Local Job (+8 pts)
        </button>
      </div>

      {activeTab === 'feed' ? (
        <>
          {/* Detailed Job Overlay */}
          {selectedJob && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
                
                {/* Job Header Info */}
                <div className="bg-blue-600 p-5 text-white relative">
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="absolute top-4 right-4 bg-white/15 backdrop-blur text-white p-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  <span className="text-[8px] bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {selectedJob.category}
                  </span>
                  <h3 className="font-extrabold text-white text-sm leading-tight mt-2">{selectedJob.title}</h3>
                  <p className="text-[10px] text-blue-100 font-bold mt-1 flex items-center gap-1">
                    <Building size={12} />
                    {selectedJob.employer}
                  </p>
                </div>

                <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
                  {/* Location and Salary */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">Job Location</span>
                      <p className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-blue-600 shrink-0" />
                        {selectedJob.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">Salary Package</span>
                      <p className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1 mt-0.5">
                        <Coins size={12} className="shrink-0" />
                        {selectedJob.salary}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Description</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {selectedJob.description || 'No description provided. Please contact employer for details.'}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Phone size={11} className="stroke-[2.5px]" />
                        Call Employer Now
                      </h4>
                      <p className="text-xs font-black text-slate-900 truncate">{selectedJob.contactNumber}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedJob(null);
                        setActiveCall(`${selectedJob.employer} (${selectedJob.contactNumber})`);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] uppercase flex items-center gap-1 shadow-md shadow-emerald-100 cursor-pointer transition-all duration-150"
                    >
                      <PhoneCall size={12} />
                      Call Tap
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2">
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 cursor-pointer transition-all duration-150"
                  >
                    Close Job Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search bar and Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search electrician, driver, part time..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Category:</span>
              <div className="flex gap-1.5 ml-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatFilter(cat)}
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all cursor-pointer ${
                      catFilter === cat 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Feed List */}
          <div className="flex flex-col gap-3.5">
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
                <h4 className="font-extrabold text-slate-800 text-xs">No Jobs Posted</h4>
                <p className="text-[10px] text-slate-500 mt-1">Check back later or post a new listing.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all duration-150 cursor-pointer select-none"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[8px] bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {job.category}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-600">{job.salary}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-950 text-xs mt-2.5 leading-snug">{job.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                      <Building size={11} className="text-slate-400" />
                      {job.employer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                      <MapPin size={11} />
                      {job.location}
                    </span>
                    <span className="text-[9px] font-black text-blue-600 hover:underline flex items-center gap-0.5">
                      Apply details
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Post Job Form */
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 mb-1">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Post Vacancy Form
            </h3>
            <p className="text-[9px] text-slate-500 leading-normal mt-0.5">
              Advertise vacancies in our local ward community and gain points.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check size={24} className="stroke-[3px]" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Job Vacancy Registered!</h4>
              <p className="text-[10px] text-slate-500">Your bulletin points have been logged.</p>
            </div>
          ) : (
            <>
              {/* Job Title */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Electrician for Apartment Maintenance"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Employer / Company Name */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Employer / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formEmployer}
                  onChange={(e) => setFormEmployer(e.target.value)}
                  placeholder="e.g. Prestige Heights Society, Self Employed"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Job Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as LocalJob['category'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Driver">Driver</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Salary & Location */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Salary / Compensation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="e.g. ₹15k - 20k/mo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                    Job Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Domlur Main Road"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Employer Contact Number *
                </label>
                <input
                  type="text"
                  required
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="e.g. 9845012345"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                  Job Brief & Requirements
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe shift timings, roles, specific requirements, certificates..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 cursor-pointer mt-2 transition-all duration-150"
              >
                Post Local Job Listing
              </button>
            </>
          )}
        </form>
      )}

      {/* Floating Active Call Simulator Toast */}
      {activeCall && (
        <div className="fixed bottom-24 left-4 right-4 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl z-50 flex items-center justify-between border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse">
              <Phone size={18} className="text-white animate-bounce" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block animate-pulse">
                Simulating Call...
              </span>
              <p className="text-xs font-bold text-slate-200">Connecting to {activeCall}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveCall(null)}
            className="text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 cursor-pointer"
          >
            End
          </button>
        </div>
      )}
    </div>
  );
};
