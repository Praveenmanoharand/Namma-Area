import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { 
  collection, doc, setDoc, getDocs, addDoc, updateDoc, onSnapshot, query, orderBy, getDoc
} from 'firebase/firestore';
import { Complaint, Comment, ComplaintCategory } from '../types';
import { getCurrentUser, updateUserProfile } from './users.service';

let cachedComplaints: Complaint[] = [];
const complaintsListeners = new Set<() => void>();

// Real-time synchronization
export function subscribeToComplaints(cb: () => void) {
  complaintsListeners.add(cb);
  return () => {
    complaintsListeners.delete(cb);
  };
}

// Set up real-time listener for complaints
export function initComplaintsListener() {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, async (snap) => {
    const list: Complaint[] = [];
    
    // Fetch complaints
    for (const d of snap.docs) {
      const complaintData = d.data() as Complaint;
      complaintData.id = d.id;
      
      // Fetch comments from subcollection as the source of truth
      try {
        const commentsSnap = await getDocs(query(collection(db, 'complaints', d.id, 'comments'), orderBy('createdAt', 'asc')));
        const commentsList: Comment[] = [];
        commentsSnap.forEach(commentDoc => {
          commentsList.push({ id: commentDoc.id, ...commentDoc.data() } as Comment);
        });
        complaintData.comments = commentsList;
      } catch (err) {
        console.error(`Error loading comments for complaint ${d.id}:`, err);
        if (!complaintData.comments) {
          complaintData.comments = [];
        }
      }
      
      list.push(complaintData);
    }
    
    cachedComplaints = list;
    complaintsListeners.forEach(cb => cb());
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'complaints');
  });
}

export function getComplaints(): Complaint[] {
  return cachedComplaints;
}

export function getComplaintById(id: string): Complaint | undefined {
  return cachedComplaints.find(c => c.id === id);
}

export async function createComplaint(
  title: string,
  description: string,
  category: ComplaintCategory,
  location: string,
  image: string
): Promise<Complaint> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to report a complaint.');
  }

  const complaintId = 'comp_' + Date.now();
  const newComplaint: Omit<Complaint, 'comments'> = {
    id: complaintId,
    title,
    description,
    category,
    status: 'Pending',
    location: location || 'Indiranagar',
    upvotes: 0,
    upvotedBy: [],
    creatorId: currentUser.id,
    creatorName: currentUser.name,
    creatorAvatar: currentUser.avatar,
    createdAt: new Date().toISOString(),
    image: image || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
  };

  // Add doc with specified ID
  try {
    await setDoc(doc(db, 'complaints', complaintId), newComplaint);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `complaints/${complaintId}`);
  }

  // Update user profile counts
  const updatedActivity = [
    {
      id: 'act_' + Date.now(),
      type: 'submitted' as const,
      title: `Submitted issue: ${title}`,
      subtitle: `Just now • ${location || 'Indiranagar'}`,
      timestamp: new Date().toISOString(),
      complaintId: complaintId,
    },
    ...currentUser.recentActivity,
  ];

  await updateUserProfile({
    complaintsCount: currentUser.complaintsCount + 1,
    contributionsCount: currentUser.contributionsCount + 5,
    recentActivity: updatedActivity,
  });

  const finalComplaint: Complaint = { ...newComplaint, comments: [] };
  
  // Optimistic update
  cachedComplaints.unshift(finalComplaint);
  complaintsListeners.forEach(cb => cb());

  return finalComplaint;
}

export async function upvoteComplaint(id: string): Promise<Complaint | undefined> {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const complaintDocRef = doc(db, 'complaints', id);
  const docSnap = await getDoc(complaintDocRef);
  if (!docSnap.exists()) return;

  const complaint = docSnap.data() as Complaint;
  const upvotedBy = complaint.upvotedBy || [];
  const upvotedIndex = upvotedBy.indexOf(currentUser.id);
  
  let newUpvotes = complaint.upvotes || 0;
  if (upvotedIndex > -1) {
    upvotedBy.splice(upvotedIndex, 1);
    newUpvotes = Math.max(0, newUpvotes - 1);
  } else {
    upvotedBy.push(currentUser.id);
    newUpvotes += 1;
  }

  try {
    await updateDoc(complaintDocRef, {
      upvotedBy,
      upvotes: newUpvotes
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `complaints/${id}`);
  }

  // Retrieve full comments to return the accurate Complaint object
  const commentsSnap = await getDocs(query(collection(db, 'complaints', id, 'comments'), orderBy('createdAt', 'asc')));
  const commentsList: Comment[] = [];
  commentsSnap.forEach(commentDoc => {
    commentsList.push({ id: commentDoc.id, ...commentDoc.data() } as Comment);
  });

  const updatedComplaint: Complaint = {
    ...complaint,
    id,
    upvotedBy,
    upvotes: newUpvotes,
    comments: commentsList
  };

  // Update in local cache
  const cachedIdx = cachedComplaints.findIndex(c => c.id === id);
  if (cachedIdx !== -1) {
    cachedComplaints[cachedIdx] = updatedComplaint;
    complaintsListeners.forEach(cb => cb());
  }

  return updatedComplaint;
}

export async function addComment(complaintId: string, content: string): Promise<Complaint | undefined> {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const complaintDocRef = doc(db, 'complaints', complaintId);
  const docSnap = await getDoc(complaintDocRef);
  if (!docSnap.exists()) return;

  const complaint = docSnap.data() as Complaint;

  const commentId = 'comm_' + Date.now();
  const newComment: Comment = {
    id: commentId,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    content,
    createdAt: new Date().toISOString(),
  };

  // Write to subcollection complaints/{complaintId}/comments
  try {
    await setDoc(doc(db, 'complaints', complaintId, 'comments', commentId), {
      authorId: currentUser.id,
      authorName: newComment.authorName,
      authorAvatar: newComment.authorAvatar,
      content: newComment.content,
      createdAt: newComment.createdAt
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `complaints/${complaintId}/comments/${commentId}`);
  }

  // Update user profile for contributions
  await updateUserProfile({
    contributionsCount: currentUser.contributionsCount + 2,
    recentActivity: [
      {
        id: 'act_' + Date.now(),
        type: 'commented' as const,
        title: `Commented on: ${complaint.title}`,
        subtitle: `Just now • Community Action`,
        timestamp: new Date().toISOString(),
        complaintId: complaintId,
      },
      ...currentUser.recentActivity,
    ],
  });

  // Fetch updated comments
  const commentsSnap = await getDocs(query(collection(db, 'complaints', complaintId, 'comments'), orderBy('createdAt', 'asc')));
  const commentsList: Comment[] = [];
  commentsSnap.forEach(commentDoc => {
    commentsList.push({ id: commentDoc.id, ...commentDoc.data() } as Comment);
  });

  const updatedComplaint: Complaint = {
    ...complaint,
    id: complaintId,
    comments: commentsList
  };

  // Update local cache
  const cachedIdx = cachedComplaints.findIndex(c => c.id === complaintId);
  if (cachedIdx !== -1) {
    cachedComplaints[cachedIdx] = updatedComplaint;
    complaintsListeners.forEach(cb => cb());
  }

  return updatedComplaint;
}
