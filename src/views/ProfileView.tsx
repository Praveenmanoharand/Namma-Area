import React, { useState, useEffect } from 'react';
import { useRouter } from '../router';
import { getCurrentUser, logout, updateUserProfile, getCitizenScoreAndRank } from '../db';
import { MapPin, Award, CheckCircle2, Megaphone, ArrowRight, LogOut, ChevronRight, Settings, ShieldAlert, HeartHandshake, HelpCircle } from 'lucide-react';
import { TN_DISTRICTS_UNIQUE } from '../data/tamilnadu-wards';

export const ProfileView: React.FC = () => {
  const { navigateTo } = useRouter();
  const currentUser = getCurrentUser();

  // If no user is logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      navigateTo('/login');
    }
  }, [currentUser, navigateTo]);

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editMobile, setEditMobile] = useState(currentUser?.mobileNumber || '');
  const [editArea, setEditArea] = useState(currentUser?.area || 'Ward 108 • Anna Nagar West');

  const [editDistrict, setEditDistrict] = useState('Chennai');
  const [editWard, setEditWard] = useState('Ward 15 - Anna Nagar');

  // Keep state updated if current user changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setEditName(currentUser.name);
      setEditEmail(currentUser.email);
      setEditMobile(currentUser.mobileNumber || '');
      setEditArea(currentUser.area);

      const areaStr = currentUser.area;
      if (areaStr.includes('•')) {
        const parts = areaStr.split('•');
        setEditWard(parts[0]?.trim() || 'Ward 15 - Anna Nagar');
        setEditDistrict(parts[1]?.trim() || 'Chennai');
      } else if (areaStr.includes(',')) {
        const parts = areaStr.split(',');
        setEditWard(parts[0]?.trim() || 'Ward 4');
        setEditDistrict(parts[2]?.trim() || 'Chennai');
      }
    }
  }, [currentUser?.id, currentUser?.area]);

  const handleLogout = () => {
    logout();
    navigateTo('/login');
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editEmail) return;

    const finalArea = `${editWard} • ${editDistrict}`;
    updateUserProfile({
      name: editName,
      email: editEmail,
      mobileNumber: editMobile,
      area: finalArea,
    });

    // Save preference
    localStorage.setItem('namma_preferred_location', finalArea);

    // Refresh state
    const updated = getCurrentUser();
    setUser(updated);
    setIsEditing(false);
  };

  if (!currentUser) {
    return null;
  }

  if (isEditing) {
    return (
      <div id="profile-edit-view" className="flex flex-col gap-6 p-4 pb-12 bg-[#f8fafc]">
        {/* Top Header Label */}
        <div className="flex items-center gap-2 mb-1 shrink-0 select-none">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Settings size={18} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">Edit Profile</h1>
            <p className="text-xs text-slate-500 mt-1">Update your civic profile information</p>
          </div>
        </div>

        <form onSubmit={handleSaveChanges} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center mb-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] text-slate-400 mt-2 font-medium">Avatar managed via CivicLink</span>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
            <input
              id="edit-profile-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
            <input
              id="edit-profile-email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
            <input
              id="edit-profile-mobile"
              type="tel"
              value={editMobile}
              onChange={(e) => setEditMobile(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all duration-200"
              placeholder="e.g. 9876543210"
            />
          </div>

          {/* Location Editing */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-3">
            <h4 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Residential Location</h4>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">District</label>
              <select
                id="edit-profile-district"
                value={editDistrict}
                onChange={(e) => {
                  setEditDistrict(e.target.value);
                  const list = TN_DISTRICTS_UNIQUE.find(d => d.name === e.target.value)?.wards || [];
                  if (list.length > 0) setEditWard(list[0]);
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 outline-none transition-all duration-200 cursor-pointer"
              >
                {TN_DISTRICTS_UNIQUE.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ward & Area</label>
              <select
                id="edit-profile-ward"
                value={editWard}
                onChange={(e) => setEditWard(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 outline-none transition-all duration-200 cursor-pointer"
              >
                {(TN_DISTRICTS_UNIQUE.find(d => d.name === editDistrict)?.wards || []).map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              id="edit-profile-btn-cancel"
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              id="edit-profile-btn-save"
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-blue-200/50 transition-all duration-150 cursor-pointer text-center"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div id="profile-view" className="flex flex-col gap-6 p-4 pb-12 bg-[#f8fafc]">
      {/* Top Header Label */}
      <div className="flex items-center gap-2 mb-1 shrink-0 select-none">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Settings size={18} />
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-none">CivicLink Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Ward residency & member status</p>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-sm"
            referrerPolicy="no-referrer"
          />
          {/* Edit overlay icon */}
          <button 
            id="profile-btn-edit-avatar"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white cursor-pointer shadow focus:outline-none"
            onClick={() => setIsEditing(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
        </div>

        <h2 className="text-lg font-extrabold text-slate-950 mt-3.5 tracking-tight">{user?.name}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Indiranagar Resident</p>

        {/* Level Indicator Badge */}
        <span className="inline-flex items-center gap-1 mt-3 bg-blue-50 text-blue-600 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-blue-100">
          Level {user?.contributorLevel || 4} Contributor
        </span>

        {/* Ward Information */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-500 bg-slate-50 border border-slate-100 py-2 px-4 rounded-xl w-full">
          <MapPin size={14} className="text-blue-600 fill-blue-50 shrink-0" />
          <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-600">
            {user?.area || 'Ward 4, Indiranagar, Bengaluru'}
          </span>
        </div>

        {/* Edit Profile Button */}
        <button
          id="profile-btn-edit"
          onClick={() => setIsEditing(true)}
          className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer shadow-sm text-center"
        >
          Edit Profile
        </button>
      </div>
      
      {/* Residential Location Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 font-sans animate-in fade-in duration-300">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <MapPin size={15} className="text-blue-600" />
          Residential Location
        </h3>
        
        {/* Location Info Table */}
        {(() => {
          // Parse location fields
          const areaStr = user?.area || 'Ward 108 • Anna Nagar West';
          let wardVal = 'Ward 108';
          let areaVal = 'Anna Nagar West';
          let districtVal = 'Chennai';
          let stateVal = 'Tamil Nadu';
          let localBodyVal = 'Greater Chennai Corporation';

          if (areaStr.includes('•')) {
            const parts = areaStr.split('•');
            wardVal = parts[0]?.trim() || 'Ward 108';
            const areaPart = parts[1]?.trim() || 'Anna Nagar West';
            if (areaPart.includes(',')) {
              const subparts = areaPart.split(',');
              areaVal = subparts[0]?.trim() || 'Anna Nagar West';
              districtVal = subparts[1]?.trim() || 'Chennai';
            } else {
              areaVal = areaPart;
              districtVal = 'Chennai';
            }
          } else if (areaStr.includes(',')) {
            const parts = areaStr.split(',');
            wardVal = parts[0]?.trim() || 'Ward 4';
            areaVal = parts[1]?.trim() || 'Indiranagar';
            districtVal = parts[2]?.trim() || 'Bengaluru';
            stateVal = parts[3]?.trim() || 'Karnataka';
            localBodyVal = districtVal.includes('Bengaluru') ? 'BBMP' : 'Greater Chennai Corporation';
          }

          return (
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-y-2 text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="font-bold text-slate-400 uppercase tracking-wider">State</div>
                <div className="font-extrabold text-slate-800 text-right">{stateVal}</div>
                
                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-1.5">District</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-100 pt-1.5">{districtVal}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-1.5">Local Body</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-100 pt-1.5">{localBodyVal}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-1.5">Ward</div>
                <div className="font-extrabold text-blue-600 text-right border-t border-slate-100 pt-1.5">{wardVal}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-1.5">Area</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-100 pt-1.5">{areaVal}</div>
              </div>

              <button
                type="button"
                id="btn-edit-residential-location"
                onClick={() => setIsEditing(true)}
                className="mt-1 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Edit Location
              </button>
            </div>
          );
        })()}
      </div>

      {/* Stats Cards Stack (Matching Image 4 Layout) */}
      <div className="flex flex-col gap-3">
        {/* Complaints Submitted */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaints Submitted</span>
            <span className="text-3xl font-extrabold text-blue-600 tracking-tight mt-1 block">
              {user?.complaintsCount || 0}
            </span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Megaphone size={20} />
          </div>
        </div>

        {/* Complaints Resolved with internal indicator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaints Resolved</span>
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1 block">
                {user?.resolvedCount || 0}
              </span>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>
          {/* Progress Indicator */}
          <div className="mt-3.5">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ 
                  width: user?.complaintsCount && user.complaintsCount > 0 
                    ? `${(user.resolvedCount / user.complaintsCount) * 100}%` 
                    : '100%' 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Contributions */}
        {(() => {
          const scoreInfo = getCitizenScoreAndRank(user?.id || 'arjun_kumar');
          return (
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-md flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="flex gap-3.5 items-center relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center border border-white/25">
                  <Award size={18} className="text-yellow-200" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider block">Civic Standing</span>
                  <span className="text-lg font-black block leading-none mt-1">{scoreInfo.score} Points</span>
                  <span className="text-[10px] text-orange-50 font-bold block mt-1">{scoreInfo.title}</span>
                </div>
              </div>
              <div className="text-right relative z-10">
                <span className="text-[9px] uppercase font-bold text-amber-100 tracking-wider block">Ward Rank</span>
                <span className="text-lg font-black block leading-none mt-1">#{scoreInfo.rank}</span>
                <span className="text-[8px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                  Top 3%
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
          <HeartHandshake size={15} className="text-blue-600" />
          Recent Activity
        </h3>

        <div className="flex flex-col gap-4">
          {user?.recentActivity && user.recentActivity.length > 0 ? (
            user.recentActivity.map((activity, idx) => (
              <div 
                key={activity.id || idx} 
                onClick={() => activity.complaintId && navigateTo(`/complaints/${activity.complaintId}`)}
                className={`flex gap-3.5 items-start p-1.5 rounded-xl transition-all duration-150 ${
                  activity.complaintId ? 'cursor-pointer hover:bg-slate-50' : ''
                }`}
              >
                <div className={`p-1.5 rounded-full mt-0.5 shrink-0 ${
                  activity.type === 'resolved' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : activity.type === 'participated'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {activity.type === 'resolved' ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <Megaphone size={13} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{activity.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activity.subtitle}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 py-2 text-center">
              No recent neighborhood activities to display.
            </div>
          )}
        </div>
      </div>

      {/* Account Settings List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
          <Settings size={15} className="text-blue-600" />
          Account Settings
        </h3>

        <div className="flex flex-col divide-y divide-slate-100 font-sans">
          {[
            { id: 'set-profile', label: 'Edit Profile' },
            { id: 'set-password', label: 'Change Password' },
            { id: 'set-notifs', label: 'Notification Preferences' },
            { id: 'set-privacy', label: 'Privacy & Data' },
          ].map((item) => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => {
                if (item.id === 'set-profile') {
                  setIsEditing(true);
                } else {
                  navigateTo('/login');
                }
              }}
              className="py-3 flex justify-between items-center text-left hover:bg-slate-50 rounded-lg px-1 transition-colors cursor-pointer w-full focus:outline-none"
            >
              <span className="text-xs font-bold text-slate-700">{item.label}</span>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Resident Support Blue Card Banner */}
      <div className="bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-20 h-20 bg-blue-700 rounded-full translate-x-5 translate-y-5 opacity-40"></div>
        <span className="text-[9px] font-extrabold text-blue-200 uppercase tracking-widest block mb-1">Resident Support</span>
        <h3 className="font-extrabold text-sm leading-snug">Need assistance with local ward procedures?</h3>
        <button
          id="btn-view-ward-faq"
          onClick={() => navigateTo('/dashboard')}
          className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer shadow-sm text-center"
        >
          View Ward FAQ
        </button>
      </div>

      {/* Logout button */}
      <button
        id="btn-logout"
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-2xl font-extrabold text-xs shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border border-red-100"
      >
        <LogOut size={15} />
        Logout
      </button>
    </div>
  );
};
