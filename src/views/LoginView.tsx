import React, { useState } from 'react';
import { useRouter } from '../router';
import { login } from '../db';
import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, LogIn, ArrowRight, Lock } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { navigateTo } = useRouter();
  const { googleSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfigWarning, setShowConfigWarning] = useState(false);

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
      setError(`Error [${code || 'no-code'}]: ${msg || 'No message. Check browser console (F12).'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password');
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
      await login(email, password);
      navigateTo('/dashboard');
    } catch (err: any) {
      console.error(err);
      const code = err.code || '';
      const msg = err.message || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        msg.includes('invalid-credential') ||
        msg.includes('user-not-found') ||
        msg.includes('wrong-password')
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a few minutes and try again.');
      } else if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
        setError('Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.');
      } else if (code === 'app/timeout') {
        setError('Sign-in timed out. Check your internet connection and try again.');
      } else {
        setError(`Sign-in failed: ${msg || code || 'Unknown error. Check browser console for details.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-view" className="flex-1 flex flex-col justify-center px-6 py-12 bg-white">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
          <MapPin size={36} className="text-blue-600 fill-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-950 tracking-tight">Namma Area</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Civic Community Platform</p>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-xs text-slate-500 mt-1">Sign in to report issues and check your ward updates</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-3.5 py-2 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        {showConfigWarning && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div>
                <h4 className="font-bold text-[13px] text-amber-950">Google Sign-In Not Configured</h4>
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
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Quick Testing Fallback:</span>
              <button 
                type="button" 
                onClick={() => {
                  setEmail('test@example.com');
                  setPassword('password123');
                  setShowConfigWarning(false);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Autofill Test Account
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="login-input-email"
              type="email"
              placeholder="e.g. arjun@nammaarea.in"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="login-input-password"
              type="password"
              placeholder="••••••••"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-200 disabled:opacity-60"
            />
          </div>
        </div>

        <button
          id="login-btn-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200/50 transition-all duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogIn size={16} />
          {loading ? 'Signing In...' : 'Sign In'}
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
          id="login-btn-google"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 py-3 px-4 rounded-xl font-bold text-sm border border-slate-200 shadow-xs transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500">
          New to Namma Area?{' '}
          <button
            id="login-btn-register"
            onClick={() => navigateTo('/register')}
            className="text-blue-600 font-bold hover:underline bg-transparent border-none cursor-pointer"
          >
            Create an Account <ArrowRight size={12} className="inline ml-0.5" />
          </button>
        </p>
      </div>
    </div>
  );
};

