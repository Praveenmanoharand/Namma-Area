import { auth } from '../firebase/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from './user.service';
import { User } from '../types';

let cachedUser: User | null = null;

// Initialize cached user from localStorage as fallback
const savedUser = localStorage.getItem('namma_user');
if (savedUser && savedUser !== 'null') {
  try {
    cachedUser = JSON.parse(savedUser);
  } catch (e) {
    console.error('Failed to parse cached user', e);
  }
}

// Timeout wrapper — rejects after `ms` milliseconds so loading never gets stuck
function withTimeout<T>(promise: Promise<T>, ms = 15000, label = 'Operation'): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(
      Object.assign(new Error(`${label} timed out. Check your internet connection and try again.`), { code: 'app/timeout' })
    ), ms)
  );
  return Promise.race([promise, timeout]);
}

// Build a minimal User from Firebase Auth data (works without Firestore)
function buildLocalUser(uid: string, data: { email?: string | null; displayName?: string | null; photoURL?: string | null }): User {
  return {
    id: uid,
    email: data.email || '',
    name: data.displayName || 'Resident',
    avatar: data.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'resident',
    area: 'Ward 4, Indiranagar, Bengaluru',
    contributorLevel: 1,
    complaintsCount: 0,
    resolvedCount: 0,
    contributionsCount: 0,
    recentActivity: [],
    mobileNumber: '',
  };
}

export function setCachedUser(user: User | null) {
  cachedUser = user;
  if (user) {
    localStorage.setItem('namma_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('namma_user');
  }
}

export function getCurrentUser(): User | null {
  return cachedUser;
}

export async function login(email: string, password: string): Promise<User> {
  // Step 1: Authenticate
  const cred = await withTimeout(
    signInWithEmailAndPassword(auth, email, password),
    15000, 'Sign in'
  );

  // Step 2: Load Firestore profile, fall back gracefully if unavailable
  try {
    const profile = await withTimeout(getUserProfile(cred.user.uid), 8000, 'Load profile');
    if (profile) {
      setCachedUser(profile);
      return profile;
    }
    // No profile — create one
    try {
      const created = await withTimeout(createUserProfile(cred.user.uid, { email }), 8000, 'Create profile');
      setCachedUser(created);
      return created;
    } catch {
      const local = buildLocalUser(cred.user.uid, { email });
      setCachedUser(local);
      return local;
    }
  } catch {
    // Firestore unavailable — use local fallback
    const local = buildLocalUser(cred.user.uid, { email });
    setCachedUser(local);
    return local;
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
  area?: string,
  mobileNumber?: string
): Promise<User> {
  // Step 1: Create Firebase Auth account
  const cred = await withTimeout(
    createUserWithEmailAndPassword(auth, email, password),
    15000, 'Registration'
  );

  // Step 2: Save to Firestore — fall back gracefully if unavailable
  try {
    const profile = await withTimeout(
      createUserProfile(cred.user.uid, {
        email,
        name,
        area: area || 'Ward 4, Indiranagar, Bengaluru',
        mobileNumber: mobileNumber || ''
      }),
      8000, 'Save profile'
    );
    setCachedUser(profile);
    return profile;
  } catch {
    // Firestore unavailable — use local fallback
    const local = buildLocalUser(cred.user.uid, { email, displayName: name });
    setCachedUser(local);
    return local;
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
    setCachedUser(null);
  } catch (err) {
    console.error('Auth Service Logout Error:', err);
    throw err;
  }
}

export async function googleSignIn(): Promise<User> {
  const provider = new GoogleAuthProvider();

  // Step 1: Sign in with Google popup (no timeout — user needs time)
  let firebaseUser;
  try {
    const cred = await signInWithPopup(auth, provider);
    firebaseUser = cred.user;
  } catch (popupErr: any) {
    const code = popupErr.code || '';
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/popup-cancelled' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      console.warn('Popup blocked, falling back to redirect...');
      await signInWithRedirect(auth, provider);
      return new Promise(() => {}); // page redirects — never resolves
    }
    throw popupErr;
  }

  // Step 2: Load/create Firestore profile — always fall back to Google auth data
  const fallbackUser = buildLocalUser(firebaseUser.uid, {
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  });

  try {
    const profile = await withTimeout(getUserProfile(firebaseUser.uid), 8000, 'Load profile');
    if (profile) {
      setCachedUser(profile);
      return profile;
    }
    // New Google user — save profile
    try {
      const newProfile = await withTimeout(
        createUserProfile(firebaseUser.uid, fallbackUser),
        8000, 'Save profile'
      );
      setCachedUser(newProfile);
      return newProfile;
    } catch {
      console.warn('Could not save Firestore profile, using Google auth data');
      setCachedUser(fallbackUser);
      return fallbackUser;
    }
  } catch {
    // Firestore unavailable — still log user in with Google data
    console.warn('Firestore unavailable, using Google auth data as fallback');
    setCachedUser(fallbackUser);
    return fallbackUser;
  }
}

// Call this on app startup to handle redirect result from signInWithRedirect
export async function handleGoogleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;

    const fallbackUser = buildLocalUser(result.user.uid, {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });

    try {
      const profile = await withTimeout(getUserProfile(result.user.uid), 8000, 'Load profile');
      if (profile) { setCachedUser(profile); return profile; }

      try {
        const newProfile = await withTimeout(createUserProfile(result.user.uid, fallbackUser), 8000, 'Save profile');
        setCachedUser(newProfile);
        return newProfile;
      } catch {
        setCachedUser(fallbackUser);
        return fallbackUser;
      }
    } catch {
      setCachedUser(fallbackUser);
      return fallbackUser;
    }
  } catch (err) {
    console.error('Google redirect result error:', err);
    return null;
  }
}
