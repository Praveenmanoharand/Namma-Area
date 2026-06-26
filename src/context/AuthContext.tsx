import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { User } from '../types';
import { getUserProfile } from '../services/user.service';
import { setCachedUser, logout as serviceLogout, googleSignIn as serviceGoogleSignIn, getCurrentUser } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          // Load profile with a 4-second timeout to prevent hangs when offline or slow
          const profilePromise = getUserProfile(fUser.uid);
          const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
          const profile = await Promise.race([profilePromise, timeoutPromise]);
          
          if (profile) {
            setUser(profile);
            setCachedUser(profile);
          } else {
            // Profile not found or timed out in Firestore — use cached or build minimal user
            const cached = getCurrentUser();
            const fallback: User = cached || {
              id: fUser.uid,
              email: fUser.email || '',
              name: fUser.displayName || 'Resident',
              avatar: fUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              role: 'resident',
              area: 'Ward 4, Indiranagar, Bengaluru',
              contributorLevel: 1,
              complaintsCount: 0,
              resolvedCount: 0,
              contributionsCount: 0,
              recentActivity: [],
              mobileNumber: '',
            };
            setUser(fallback);
            setCachedUser(fallback);
          }
        } catch (err) {
          // Firestore unavailable — fall back to Firebase auth data so user stays logged in
          console.warn('Firestore profile fetch failed, using Firebase auth data as fallback:', err);
          const cached = getCurrentUser();
          const fallback: User = cached || {
            id: fUser.uid,
            email: fUser.email || '',
            name: fUser.displayName || 'Resident',
            avatar: fUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            role: 'resident',
            area: 'Ward 4, Indiranagar, Bengaluru',
            contributorLevel: 1,
            complaintsCount: 0,
            resolvedCount: 0,
            contributionsCount: 0,
            recentActivity: [],
            mobileNumber: '',
          };
          setUser(fallback);
          setCachedUser(fallback);
        }
      } else {
        setUser(null);
        setCachedUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await serviceLogout();
    setUser(null);
    setFirebaseUser(null);
  };

  const googleSignIn = async () => {
    const profile = await serviceGoogleSignIn();
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, logout, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
