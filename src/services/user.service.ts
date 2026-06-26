import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User } from '../types';
import { getCurrentUser } from './auth.service';

export async function createUserProfile(uid: string, data: Partial<User>): Promise<User> {
  const newUser: User & { stats?: any; createdAt?: string } = {
    id: uid,
    email: data.email || '',
    name: data.name || 'Resident',
    mobileNumber: data.mobileNumber || '',
    avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: data.role || 'resident',
    area: data.area || 'Ward 4, Indiranagar, Bengaluru',
    contributorLevel: data.contributorLevel || 1,
    complaintsCount: data.complaintsCount || 0,
    resolvedCount: data.resolvedCount || 0,
    contributionsCount: data.contributionsCount || 0,
    stats: {
      complaintsCount: data.complaintsCount || 0,
      resolvedCount: data.resolvedCount || 0,
      contributionsCount: data.contributionsCount || 0
    },
    recentActivity: data.recentActivity || [
      {
        id: 'act_reg',
        type: 'participated',
        title: 'Joined Namma Area platform!',
        subtitle: 'Just now • Civic Portal',
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'users', uid), newUser);
    return newUser as User;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
    throw err;
  }
}

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function updateUserProfile(uidOrData: string | Partial<User>, maybeData?: Partial<User>): Promise<void> {
  let uid: string;
  let data: Partial<User>;

  if (typeof uidOrData === 'string') {
    uid = uidOrData;
    data = maybeData || {};
  } else {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.warn('updateUserProfile: No logged in user to update profile');
      return;
    }
    uid = currentUser.id;
    data = uidOrData;
  }

  try {
    const docRef = doc(db, 'users', uid);
    
    // Also update stats if they are updated
    const updates: any = { ...data };
    if (data.complaintsCount !== undefined || data.resolvedCount !== undefined || data.contributionsCount !== undefined) {
      const snap = await getDoc(docRef);
      const existingData = snap.exists() ? snap.data() : {};
      const existingStats = existingData.stats || {};
      
      updates.stats = {
        complaintsCount: data.complaintsCount !== undefined ? data.complaintsCount : (existingStats.complaintsCount || existingData.complaintsCount || 0),
        resolvedCount: data.resolvedCount !== undefined ? data.resolvedCount : (existingStats.resolvedCount || existingData.resolvedCount || 0),
        contributionsCount: data.contributionsCount !== undefined ? data.contributionsCount : (existingStats.contributionsCount || existingData.contributionsCount || 0)
      };
    }
    
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}

export function initUsersListener() {
  // Safe empty initializer since we load profiles onAuthStateChanged and use custom user state context
  return () => {};
}

