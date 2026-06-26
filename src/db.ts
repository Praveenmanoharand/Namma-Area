import { 
  User, Complaint, Comment, Announcement, Opportunity, ComplaintCategory,
  LostFoundItem, LocalJob, CommunityPoll, EmergencyContact 
} from './types';
import { db, handleFirestoreError, OperationType } from './firebase/firebase';
import { collection, doc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';

// Re-export services
export { 
  getCurrentUser, 
  login, 
  register, 
  logout, 
  googleSignIn,
  updateUserProfile,
  initUsersListener
} from './services/users.service';

export {
  getComplaints,
  getComplaintById,
  createComplaint,
  upvoteComplaint,
  addComment,
  subscribeToComplaints,
  initComplaintsListener
} from './services/complaints.service';

export {
  getJobs,
  getJobById,
  createJob,
  subscribeToJobs,
  initJobsListener
} from './services/jobs.service';

export {
  getPolls,
  voteInPoll,
  subscribeToPolls,
  initPollsListener
} from './services/polls.service';

export {
  getLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  subscribeToLostFound,
  initLostFoundListener
} from './services/lostfound.service';

// Import local functions to use in initDB
import { initUsersListener } from './services/users.service';
import { initComplaintsListener, getComplaints } from './services/complaints.service';
import { initJobsListener } from './services/jobs.service';
import { initPollsListener, getPolls } from './services/polls.service';
import { initLostFoundListener } from './services/lostfound.service';

// Seed Announcements
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Park Cleanup Drive: This Sunday',
    description: 'Join your neighbors for our monthly cleanliness drive at Cubbon Park. Tools and refreshments provided.',
    category: 'Community Drive',
    date: 'Sunday, 9:00 AM',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80',
    actionText: 'Register to help',
  },
  {
    id: 'ann2',
    title: 'New Metro Station Update',
    description: 'Construction on Phase 2B is reaching final stages. Traffic diversions to be removed by next month.',
    category: 'Project Update',
    date: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=600&q=80',
    actionText: 'Read full report',
  },
];

// Seed Opportunities
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp1',
    title: 'Evening Literacy Volunteer',
    organization: 'Community Library',
    type: 'Volunteer',
    duration: '2 hrs/week',
  },
  {
    id: 'opp2',
    title: 'Area Maintenance Lead',
    organization: 'Municipal Office',
    type: 'Full-time',
    duration: 'Full-time',
  },
  {
    id: 'opp3',
    title: 'Neighborhood Watch Captain',
    organization: 'Sector 4',
    type: 'Volunteer',
    duration: 'Volunteer',
  },
];

const SEED_EMERGENCY: EmergencyContact[] = [
  { id: 'em1', name: 'Ward Police Helpline', number: '112', category: 'Police', description: 'Emergency response, crime reporting & evening patrol dispatch' },
  { id: 'em2', name: 'Namma Ambulance Service', number: '108', category: 'Ambulance', description: 'Arogya Kavacha state trauma and cardiac emergency response' },
  { id: 'em3', name: 'Fire & Rescue Station', number: '101', category: 'Fire Service', description: 'State fire station control and safety rescue' },
  { id: 'em4', name: 'BBMP Municipal Helpline', number: '080-22221188', category: 'Municipality', description: 'Grievances, waterlogging, or fallen trees support' },
  { id: 'em5', name: 'BESCOM Power Support', number: '1912', category: 'Electricity Board', description: 'Power supply cuts, transformer sparks, or electric wire failure' },
  { id: 'em6', name: 'BWSSB Water Desk', number: '1916', category: 'Water Board', description: 'Water sewage overflow, pipe leakages, or water supply disruption' }
];

let cachedEmergency: EmergencyContact[] = [];

// Real-time listener for emergency contacts
function initEmergencyListener() {
  return onSnapshot(collection(db, 'emergency_contacts'), (snap) => {
    const list: EmergencyContact[] = [];
    snap.forEach(d => {
      list.push(d.data() as EmergencyContact);
    });
    cachedEmergency = list;
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'emergency_contacts');
  });
}

export function getEmergencyContacts(): EmergencyContact[] {
  if (cachedEmergency.length === 0) {
    return SEED_EMERGENCY;
  }
  return cachedEmergency;
}

// Background Firestore Seeding for Emergency Contacts
async function seedEmergencyIfNeeded() {
  try {
    const snap = await getDocs(collection(db, 'emergency_contacts'));
    if (snap.empty) {
      console.log('Seeding Firestore collection: emergency_contacts');
      for (const item of SEED_EMERGENCY) {
        await setDoc(doc(db, 'emergency_contacts', item.id), item);
      }
    }
  } catch (error) {
    console.error('Error seeding emergency contacts:', error);
  }
}

// Global DB Initializer
let listenersInitialized = false;

export function initDB() {
  if (listenersInitialized) return;
  listenersInitialized = true;

  // Run async seeding for emergency contacts
  seedEmergencyIfNeeded();

  // Initialize all modular service listeners
  initUsersListener();
  initComplaintsListener();
  initJobsListener();
  initPollsListener();
  initLostFoundListener();
  initEmergencyListener();
}

// Citizen Score & Rank calculator helper
export function getCitizenScoreAndRank(userId: string) {
  const complaints = getComplaints();
  const submittedCount = complaints.filter(c => c.creatorId === userId).length;
  const supportedCount = complaints.filter(c => c.upvotedBy.includes(userId)).length;
  
  const polls = getPolls();
  const pollsVotedCount = polls.filter(p => p.userVotes && p.userVotes[userId] !== undefined).length;
  
  const registeredAnnouncements = JSON.parse(localStorage.getItem('registered_announcements') || '[]');
  const volunteerCount = registeredAnnouncements.length;
  
  const score = (submittedCount * 10) + (supportedCount * 2) + (pollsVotedCount * 5) + (volunteerCount * 15) + 14; 
  
  let rank = 12;
  let title = 'Bronze Resident';
  if (score >= 100) {
    rank = 1;
    title = 'Namma Hero (Diamond)';
  } else if (score >= 60) {
    rank = 3;
    title = 'Area Leader (Gold)';
  } else if (score >= 35) {
    rank = 5;
    title = 'Civic Champion (Silver)';
  } else if (score >= 15) {
    rank = 8;
    title = 'Active Resident (Bronze)';
  }

  return { score, rank, title };
}
