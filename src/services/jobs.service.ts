import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { 
  collection, doc, setDoc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { LocalJob } from '../types';
import { getCurrentUser, updateUserProfile } from './users.service';

let cachedJobs: LocalJob[] = [];
const jobsListeners = new Set<() => void>();

export function subscribeToJobs(cb: () => void) {
  jobsListeners.add(cb);
  return () => {
    jobsListeners.delete(cb);
  };
}

export function initJobsListener() {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snap) => {
    const list: LocalJob[] = [];
    snap.forEach(d => {
      list.push(d.data() as LocalJob);
    });
    cachedJobs = list;
    jobsListeners.forEach(cb => cb());
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'jobs');
  });
}

export function getJobs(): LocalJob[] {
  return cachedJobs;
}

export function getJobById(id: string): LocalJob | undefined {
  return cachedJobs.find(job => job.id === id);
}

export async function createJob(
  title: string,
  employer: string,
  location: string,
  category: LocalJob['category'],
  salary: string,
  contactNumber: string,
  description: string
): Promise<LocalJob> {
  const currentUser = getCurrentUser();
  const creatorId = currentUser ? currentUser.id : 'anonymous';

  const jobId = 'job_' + Date.now();
  const newJob: LocalJob = {
    id: jobId,
    title,
    employer,
    location: location || 'Indiranagar',
    category,
    salary,
    contactNumber,
    description,
    creatorId,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'jobs', jobId), newJob);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `jobs/${jobId}`);
  }

  // Update contributor level/history if logged in
  if (currentUser) {
    await updateUserProfile({
      contributionsCount: currentUser.contributionsCount + 8,
      recentActivity: [
        {
          id: 'act_job_' + Date.now(),
          type: 'submitted' as const,
          title: `Posted local job: ${title}`,
          subtitle: `Just now • ${location || 'Indiranagar'}`,
          timestamp: new Date().toISOString(),
        },
        ...currentUser.recentActivity,
      ],
    });
  }

  // Optimistic update
  cachedJobs.unshift(newJob);
  jobsListeners.forEach(cb => cb());

  return newJob;
}
