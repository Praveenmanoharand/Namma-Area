import React, { useState, useEffect } from 'react';
import { useRouter } from '../router';
import { register } from '../db';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Mail, Compass, Sparkles, Phone, Lock } from 'lucide-react';
import { detectLocation, GeocodedLocation } from '../utils/geocoder';
import { TN_DISTRICTS_UNIQUE, buildAreaString } from '../data/tamilnadu-wards';

export const RegisterView: React.FC = () => {
  const { navigateTo } = useRouter();
  const { googleSignIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [area, setArea] = useState(() => {
    return localStorage.getItem('namma_preferred_location') || 'Ward 108 • Anna Nagar West';
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfigWarning, setShowConfigWarning] = useState(false);

  // Guided Location Detection states
  const [locationStep, setLocationStep] = useState<'idle' | 'detecting' | 'confirmed' | 'unidentified' | 'denied' | 'manual'>('idle');
  const [detectedLoc, setDetectedLoc] = useState<GeocodedLocation | null>(null);
  const [simulateUnidentified, setSimulateUnidentified] = useState(false);
  const [selectedWardManual, setSelectedWardManual] = useState('Ward 15 - Anna Nagar');
  const [manualDistrict, setManualDistrict] = useState('Chennai');
  const [manualWard, setManualWard] = useState('Ward 15 - Anna Nagar');

  // Trigger manual ward update when unidentified detected district changes
  useEffect(() => {
    if (detectedLoc && !detectedLoc.ward) {
      const list = TN_DISTRICTS_UNIQUE.find(d => d.name === detectedLoc.district)?.wards || [];
      if (list.length > 0) {
        setSelectedWardManual(list[0]);
      }
    }
  }, [detectedLoc?.district]);

  const handleDetectLocation = async () => {
    try {
      setLocationStep('detecting');
      const loc = await detectLocation(simulateUnidentified);
      setDetectedLoc(loc);
      if (loc.ward) {
        setLocationStep('confirmed');
      } else {
        setLocationStep('unidentified');
      }
    } catch (err) {
      console.error('Location detection failed:', err);
      setLocationStep('denied');
    }
  };

  const handleUseLocation = () => {
    if (!detectedLoc) return;
    const finalWard = detectedLoc.ward || selectedWardManual;
    // Format: Ward X • Area Name
    const cleanArea = `${finalWard} • ${detectedLoc.area}`;
    setArea(cleanArea);
    localStorage.setItem('namma_preferred_location', cleanArea);
    setLocationStep('idle');
  };

  const handleSaveManualLocation = () => {
    // Format: Ward X • Area Name
    const cleanArea = `${manualWard} • ${manualDistrict}`;
    setArea(cleanArea);
    localStorage.setItem('namma_preferred_location', cleanArea);
    setLocationStep('idle');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      setShowConfigWarning(false);
      await googleSignIn();
      navigateTo('/dashboard');
    } catch (err: any) {
      console.error('GOOGLE SIGN-IN ERROR:', err);
      const code = err.code || '';
      const msg = err.message || '';
      // Always show raw error for debugging
      setError(`Error [${code || 'no-code'}]: ${msg || 'No message. Check browser console (F12).'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(email, password, name, area, mobileNumber);
      navigateTo('/dashboard');
    } catch (err: any) {
      console.error(err);
      const code = err.code || '';
      const msg = err.message || '';
      if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        setError('Email/Password sign-up is not enabled. Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (code === 'app/timeout') {
        setError('Request timed out. Check your internet connection and try again.');
      } else {
        setError(`Registration failed: ${msg || code || 'Unknown error. Check browser console for details.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-view" className="flex-1 flex flex-col justify-center px-6 py-8 bg-white overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6 shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 border border-blue-100 shadow-sm">
          <MapPin size={30} className="text-blue-600 fill-blue-600" />
        </div>
        <h2 className="text-xl font-black text-slate-950 tracking-tight">Namma Area</h2>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Register Account</p>
      </div>

      <div className="text-center mb-5 shrink-0">
        <h1 className="text-lg font-bold text-slate-900">Join Your Community</h1>
        <p className="text-xs text-slate-500 mt-1">Empower your ward by raising issues and tracking updates</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5 shrink-0">
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-3.5 py-2 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        {showConfigWarning && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div>
                <h4 className="font-bold text-xs text-amber-950">Google Sign-In Not Configured</h4>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Google authentication is not yet enabled in your Firebase project. To resolve this:
                </p>
              </div>
            </div>
            <ol className="list-decimal list-inside pl-1 text-slate-700 space-y-1 mt-0.5 leading-relaxed">
              <li>Go to your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold underline text-blue-600 hover:text-blue-700">Firebase Console</a>.</li>
              <li>Navigate to <strong>Build &gt; Authentication</strong>.</li>
              <li>Click on the <strong>Sign-in method</strong> tab.</li>
              <li>Add <strong>Google</strong> as a Sign-In Provider and enable it.</li>
            </ol>
            <div className="pt-2 border-t border-amber-200/50 flex justify-between items-center gap-2">
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Quick Testing Fallback:</span>
              <button 
                type="button" 
                onClick={() => {
                  setName('Test Resident');
                  setEmail('test@example.com');
                  setPassword('password123');
                  setShowConfigWarning(false);
                }}
                className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Autofill Test Account
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="register-input-name"
              type="text"
              placeholder="e.g. Arjun Kumar"
              value={name}
              disabled={loading}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="register-input-email"
              type="email"
              placeholder="e.g. arjun@nammaarea.in"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Password (min 6 chars)</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="register-input-password"
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="register-input-mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              value={mobileNumber}
              disabled={loading}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Guided Location Detection Experience */}
        <div className="flex flex-col gap-1 border border-slate-200 bg-slate-50/50 rounded-2xl p-4.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Your Residential Ward
          </label>

          {locationStep === 'idle' && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                id="btn-detect-location"
                onClick={handleDetectLocation}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Compass size={14} className="animate-pulse" />
                📍 Detect My Area Automatically
              </button>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed text-center">
                Automatically detect your district and ward using your current location.
              </p>
              <div className="flex justify-between items-center mt-1 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setLocationStep('manual')}
                  className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-none"
                >
                  Select manually instead
                </button>
                {/* Developer override for testing unidentified ward */}
                <label className="flex items-center gap-1.5 cursor-pointer text-[9px] text-slate-400 font-bold">
                  <input
                    type="checkbox"
                    checked={simulateUnidentified}
                    onChange={(e) => setSimulateUnidentified(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                  />
                  Test Unidentified
                </label>
              </div>
            </div>
          )}

          {locationStep === 'detecting' && (
            <div className="flex flex-col items-center justify-center py-5 gap-3.5">
              <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center">
                <Compass size={16} className="text-blue-600 animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="text-xs font-bold text-slate-800">📡 Detecting your location...</h4>
                <p className="text-[9px] text-slate-400 font-medium mt-1">Please allow location access if prompted</p>
              </div>
            </div>
          )}

          {(locationStep === 'confirmed' || locationStep === 'unidentified') && detectedLoc && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs border-b border-slate-100 pb-2">
                <span className="text-sm">📍</span>
                <span>We found your location</span>
                {locationStep === 'confirmed' && (
                  <span className="ml-auto bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase border border-emerald-200">
                    Auto Detected
                  </span>
                )}
              </div>

              {/* Location Data Table */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-white border border-slate-100 rounded-xl p-3 text-[10px]">
                <div className="font-bold text-slate-400 uppercase tracking-wider">State</div>
                <div className="font-extrabold text-slate-800 text-right">{detectedLoc.state}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">District</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-50 pt-1.5">{detectedLoc.district}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Local Body</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-50 pt-1.5">{detectedLoc.localBody}</div>

                {detectedLoc.zone && (
                  <>
                    <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Zone</div>
                    <div className="font-extrabold text-slate-800 text-right border-t border-slate-50 pt-1.5">{detectedLoc.zone}</div>
                  </>
                )}

                {detectedLoc.ward ? (
                  <>
                    <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Ward</div>
                    <div className="font-extrabold text-blue-600 text-right border-t border-slate-50 pt-1.5 font-sans">{detectedLoc.ward}</div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Ward</div>
                    <div className="font-extrabold text-slate-800 text-right border-t border-slate-50 pt-1.5">
                      <select
                        value={selectedWardManual}
                        onChange={(e) => setSelectedWardManual(e.target.value)}
                        className="text-[10px] font-bold text-blue-600 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-600"
                      >
                        {TN_DISTRICTS_UNIQUE.find(d => d.name === detectedLoc.district)?.wards.map(w => (
                          <option key={w} value={w}>{w}</option>
                        )) || <option value="">No wards found</option>}
                      </select>
                    </div>
                  </>
                )}

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Area</div>
                <div className="font-extrabold text-slate-800 text-right border-t border-slate-50 pt-1.5">{detectedLoc.area}</div>

                <div className="font-bold text-slate-400 uppercase tracking-wider border-t border-slate-50 pt-1.5">Accuracy</div>
                <div className="font-extrabold text-emerald-600 text-right border-t border-slate-50 pt-1.5">{detectedLoc.accuracy}</div>
              </div>

              {locationStep === 'unidentified' && (
                <div className="text-center bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-2.5 text-[10px] font-semibold">
                  ⚠️ We couldn't determine your Ward automatically. Please select it manually above.
                </div>
              )}

              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setLocationStep('manual')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  ✏ Change Manually
                </button>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                >
                  ✔ Use This Location
                </button>
              </div>
            </div>
          )}

          {locationStep === 'denied' && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 py-2">
              <div className="flex items-start gap-2.5 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <span className="text-base mt-0.5">⚠️</span>
                <div>
                  <h4 className="font-bold text-xs text-amber-950">Location access is disabled.</h4>
                  <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                    You can continue by selecting your District and Ward manually.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 mt-1">
                <button
                  type="button"
                  onClick={() => setLocationStep('manual')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Select Manually
                </button>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors cursor-pointer text-center"
                >
                  Enable Location
                </button>
              </div>
            </div>
          )}

          {locationStep === 'manual' && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">District</label>
                <select
                  value={manualDistrict}
                  onChange={(e) => {
                    setManualDistrict(e.target.value);
                    const list = TN_DISTRICTS_UNIQUE.find(d => d.name === e.target.value)?.wards || [];
                    if (list.length > 0) setManualWard(list[0]);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-200 cursor-pointer font-semibold"
                >
                  {TN_DISTRICTS_UNIQUE.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Ward & Area</label>
                <select
                  value={manualWard}
                  onChange={(e) => setManualWard(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:border-blue-600 outline-none transition-all duration-200 cursor-pointer font-semibold"
                >
                  {(TN_DISTRICTS_UNIQUE.find(d => d.name === manualDistrict)?.wards || []).map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mt-1 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setLocationStep('idle')}
                  className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1"
                >
                  📍 Detect Automatically
                </button>
                <button
                  type="button"
                  onClick={handleSaveManualLocation}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Apply Selection
                </button>
              </div>
            </div>
          )}

          {/* Current Selection Summary */}
          {area && (
            <div className="mt-3 pt-2.5 border-t border-slate-150 flex items-center justify-between text-[10px] font-semibold text-slate-600">
              <span>Selected Location:</span>
              <span className="text-blue-600 font-extrabold">{area}</span>
            </div>
          )}
        </div>

        <button
          id="register-btn-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-lg shadow-blue-200/50 transition-all duration-150 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles size={14} />
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider text-[10px]">Or continue with</span>
          </div>
        </div>

        <button
          id="register-btn-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 py-2.5 px-4 rounded-xl font-bold text-xs border border-slate-200 shadow-xs transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </form>

      <div className="mt-6 text-center shrink-0">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            id="register-btn-login"
            onClick={() => navigateTo('/login')}
            className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer focus:outline-none"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
};

