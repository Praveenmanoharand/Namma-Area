import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { 
  collection, doc, setDoc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { LostFoundItem } from '../types';
import { getCurrentUser, updateUserProfile } from './users.service';

let cachedLostFound: LostFoundItem[] = [];
const lostFoundListeners = new Set<() => void>();

export function subscribeToLostFound(cb: () => void) {
  lostFoundListeners.add(cb);
  return () => {
    lostFoundListeners.delete(cb);
  };
}

export function initLostFoundListener() {
  const q = query(collection(db, 'lost_found'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snap) => {
    const list: LostFoundItem[] = [];
    snap.forEach(d => {
      list.push(d.data() as LostFoundItem);
    });
    cachedLostFound = list;
    lostFoundListeners.forEach(cb => cb());
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'lost_found');
  });
}

export function getLostFoundItems(): LostFoundItem[] {
  return cachedLostFound;
}

export function getLostFoundItemById(id: string): LostFoundItem | undefined {
  return cachedLostFound.find(item => item.id === id);
}

export async function createLostFoundItem(
  type: 'lost' | 'found',
  name: string,
  category: LostFoundItem['category'],
  description: string,
  location: string,
  date: string,
  image: string,
  contactInfo: string
): Promise<LostFoundItem> {
  const currentUser = getCurrentUser();
  const creatorId = currentUser ? currentUser.id : 'anonymous';
  const creatorName = currentUser ? currentUser.name : 'Anonymous Resident';
  const creatorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  const itemId = 'lf_' + Date.now();
  const newItem: LostFoundItem = {
    id: itemId,
    type,
    name,
    category,
    description,
    location: location || 'Indiranagar',
    date: date || new Date().toISOString().split('T')[0],
    image: image || (type === 'lost' 
      ? 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=400&q=80' 
      : 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80'),
    contactInfo,
    creatorId,
    creatorName,
    creatorAvatar,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'lost_found', itemId), newItem);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `lost_found/${itemId}`);
  }

  // Update contributor level/history if logged in
  if (currentUser) {
    await updateUserProfile({
      contributionsCount: currentUser.contributionsCount + 10,
      recentActivity: [
        {
          id: 'act_lf_' + Date.now(),
          type: 'submitted' as const,
          title: `Reported ${type} item: ${name}`,
          subtitle: `Just now • ${location || 'Indiranagar'}`,
          timestamp: new Date().toISOString(),
        },
        ...currentUser.recentActivity,
      ],
    });
  }

  // Optimistic update
  cachedLostFound.unshift(newItem);
  lostFoundListeners.forEach(cb => cb());

  return newItem;
}
