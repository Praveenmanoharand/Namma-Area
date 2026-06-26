import { 
  Notification, Suggestion, VolunteerEvent, VolunteerProfile, 
  AreaGroup, GroupPost, ImpactItem, LeaderboardUser, WardProject 
} from './types';
import { getCurrentUser } from './db';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, getDocs, onSnapshot } from 'firebase/firestore';

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    title: 'Grievance Assigned to Ward Engineer',
    description: 'Your reported issue "Street Light Not Working" has been assigned to BBMP Ward Engineer Suresh Kumar.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'complaint',
    read: false,
    relatedId: 'comp1'
  },
  {
    id: 'notif_2',
    title: 'Scheduled Power Outage Warning',
    description: 'BESCOM scheduled power maintenance in Indiranagar Sector 3 on Saturday between 10:00 AM and 2:00 PM.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    type: 'alert',
    read: false
  },
  {
    id: 'notif_3',
    title: 'New Community Poll is Live',
    description: 'Poll: "Do you support weekend vehicle restrictions on 12th Main Road?" Submit your vote today.',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    type: 'poll',
    read: true,
    relatedId: 'poll2'
  },
  {
    id: 'notif_4',
    title: 'Monsoon Flood Advisory',
    description: 'Emergency safety alert: High rain forecasts. Low-lying storm water drains are monitored. Avoid subways.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    type: 'emergency',
    read: false
  },
  {
    id: 'notif_5',
    title: 'Upcoming Tree Plantation Drive',
    description: 'Join the Namma Area green initiative on Sunday at Indiranagar Park. Refreshments provided!',
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
    type: 'announcement',
    read: false
  }
];

const SEED_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug_1',
    title: 'Children Playground in Sector 4',
    description: 'We need a dedicated, fenced play area for toddlers in the vacant municipal plot. Currently, children play on the streets which is unsafe.',
    category: 'Park Requests',
    area: 'Indiranagar',
    creatorName: 'Meera Patel',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    upvotes: 45,
    upvotedBy: ['arjun_kumar'],
    status: 'Approved',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'sug_2',
    title: 'Bus Stop Shade near Metro Station',
    description: 'Commuters wait under the scorching sun or heavy rain. Installing a steel frame passenger shelter is highly needed.',
    category: 'Bus Stop Requests',
    area: 'Indiranagar Sector 3',
    creatorName: 'Sanjay Dutt',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    upvotes: 28,
    upvotedBy: [],
    status: 'Reviewed',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'sug_3',
    title: 'Speed Breaker on 5th Cross Junction',
    description: 'Vehicles speed through the cross junction. Many minor collisions have occurred here. A standard scientific speed breaker is essential.',
    category: 'Road Improvements',
    area: 'Defence Colony',
    creatorName: 'Rohan Deshmukh',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    upvotes: 19,
    upvotedBy: [],
    status: 'Received',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const SEED_VOLUNTEER_EVENTS: VolunteerEvent[] = [
  {
    id: 've_1',
    title: '100 Tree Sapling Plantation',
    description: 'Help us green Ward 4! We aim to plant native avenue saplings along the residential lanes. Digging tools, gloves, and water will be supplied.',
    category: 'Tree Plantation',
    date: 'This Sunday, 8:00 AM',
    location: 'Central Avenue Park Lanes',
    organizer: 'Indiranagar Resident Association',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    participants: ['arjun_kumar'],
    maxParticipants: 40
  },
  {
    id: 've_2',
    title: 'Defence Colony Clean-up Drive',
    description: 'Weekly neighborhood cleaning initiative focusing on removing plastic debris and public poster scrapings from street structures.',
    category: 'Clean-up Drives',
    date: 'Next Saturday, 7:00 AM',
    location: 'Defence Colony Main Playground',
    organizer: 'Namma Area Sanitation Watch',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80',
    participants: [],
    maxParticipants: 25
  },
  {
    id: 've_3',
    title: 'Urgent Blood Donation Camp',
    description: 'Collaborating with Lions Club Blood Bank for a ward-wide emergency donation camp to replenish local surgical supplies.',
    category: 'Blood Donation Camps',
    date: 'July 5th, 9:00 AM',
    location: 'Ward 4 Community Hall',
    organizer: 'Red Cross Local Circle',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80',
    participants: [],
    maxParticipants: 100
  }
];

const SEED_VOLUNTEER_PROFILES: VolunteerProfile[] = [
  {
    id: 'vp_1',
    name: 'Priyal Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    area: 'Ward 4, Indiranagar',
    skills: ['Event Coordination', 'First Aid', 'Public Relations'],
    participationCount: 8,
    history: ['Cubbon Park Cleanup Drive', 'Monsoon De-clog Volunteer', 'Lake Restoration Initiative']
  },
  {
    id: 'vp_2',
    name: 'Suresh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    area: 'Ward 4, Defence Colony',
    skills: ['Carpentry', 'Plumbing', 'Logistics'],
    participationCount: 5,
    history: ['Tree Sapling Plantation', 'Ward Plastic Free Drive']
  },
  {
    id: 'vp_3',
    name: 'Dr. Ananya Rao',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    area: 'Ward 4, Indiranagar',
    skills: ['Medical Response', 'Blood Grouping', 'Translation'],
    participationCount: 12,
    history: ['Covid Relief Helpdesk', 'Ward Health Camp Coordinators']
  }
];

const SEED_GROUPS: AreaGroup[] = [
  {
    id: 'g_1',
    name: 'Ward 4 Residents Association',
    description: 'The official collective of Ward 4 residents for civic advocacy, municipal meetings coordination, and local event discussions.',
    category: 'residents',
    memberCount: 512,
    members: ['arjun_kumar'],
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g_2',
    name: 'Prestige Heights Apartments',
    description: 'Private community group for prestige apartment residents to coordinate internal maintenance, safety alerts, and social gatherings.',
    category: 'apartment',
    memberCount: 180,
    members: [],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g_3',
    name: 'Indiranagar Cycling Club',
    description: 'Join local cycling enthusiasts for weekend neighborhood exploration rides, environment awareness rallies, and fitness tracking.',
    category: 'interest',
    memberCount: 94,
    members: [],
    image: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g_4',
    name: 'Sector 3 Neighborhood Watch',
    description: 'Voluntary safety watch group patrolling local lanes in coordination with local police dispatch to avoid break-ins and commercial nuisance.',
    category: 'watch',
    memberCount: 42,
    members: ['arjun_kumar'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  }
];

const SEED_GROUP_POSTS: GroupPost[] = [
  {
    id: 'gp_1',
    groupId: 'g_1',
    authorName: 'Priyal Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    content: 'Hi everyone! Does anyone know if the municipal water supply schedule has changed this week? We did not get any supply this morning.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    likes: 5,
    likedBy: []
  },
  {
    id: 'gp_2',
    groupId: 'g_1',
    authorName: 'Suresh Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Yes Priyal, there is water valve replacement ongoing near 80ft Road. They announced water will be supplied tonight at 9:00 PM instead.',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    likes: 8,
    likedBy: ['arjun_kumar']
  },
  {
    id: 'gp_3',
    groupId: 'g_3',
    authorName: 'Rohan Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Amazing ride this morning! We covered 22km across residential lanes. Great weather!',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    likes: 12,
    likedBy: []
  }
];

const SEED_IMPACT_ITEMS: ImpactItem[] = [
  {
    id: 'imp_1',
    title: 'Asphalt Repair on 10th Cross Road',
    description: 'A deep pothole that caused multiple bike skids and was waterlogged during rain has been completely filled and repaved.',
    area: 'Indiranagar Ward 4',
    resolutionDate: 'June 23, 2026',
    beforeImage: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
    feedback: 'Fantastic speed of work! Repaired overnight after being raised on Namma Area.',
    officerName: 'Assistant Engineer Suresh K.'
  },
  {
    id: 'imp_2',
    title: 'Removal of Commercial Waste Dump',
    description: 'An illegal commercial garbage dumping yard near the kids primary park entrance has been cleared. Cleanliness signboards installed.',
    area: 'Defence Colony Layout',
    resolutionDate: 'June 20, 2026',
    beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=600&q=80',
    feedback: 'The terrible stench is finally gone and we can take our kids to the park safely now.',
    officerName: 'Sanitation Inspector Ramesh M.'
  }
];

const SEED_LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: 'arjun_kumar',
    name: 'Arjun Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    area: 'Indiranagar Sector 2',
    score: 114,
    complaintsSubmitted: 12,
    suggestionsMade: 4,
    pollsParticipated: 15,
    volunteeredCount: 5,
    badges: ['Active Citizen', 'Area Champion', 'Civic Leader']
  },
  {
    id: 'user_priyal',
    name: 'Priyal Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    area: 'Indiranagar Sector 4',
    score: 95,
    complaintsSubmitted: 8,
    suggestionsMade: 6,
    pollsParticipated: 11,
    volunteeredCount: 8,
    badges: ['Active Citizen', 'Area Champion']
  },
  {
    id: 'user_sanjay',
    name: 'Sanjay Dutt',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    area: 'Defence Colony',
    score: 82,
    complaintsSubmitted: 6,
    suggestionsMade: 2,
    pollsParticipated: 12,
    volunteeredCount: 4,
    badges: ['Active Citizen', 'Grievance Warrior']
  },
  {
    id: 'user_ananya',
    name: 'Dr. Ananya Rao',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    area: 'Indiranagar Sector 1',
    score: 74,
    complaintsSubmitted: 3,
    suggestionsMade: 1,
    pollsParticipated: 8,
    volunteeredCount: 12,
    badges: ['Area Champion']
  }
];

const SEED_WARD_PROJECTS: WardProject[] = [
  {
    id: 'wp_1',
    title: '12th Main Road Asphalt Resurfacing',
    description: 'Complete asphalting and white-topping of 12th Main to handle heavy traffic and ensure durable smooth lanes.',
    status: 'Ongoing',
    progress: 65,
    budget: '₹45,00,000',
    startDate: '2026-05-10',
    endDate: '2026-07-15',
    contractor: 'BBMP Grade-A Contractors Ltd.'
  },
  {
    id: 'wp_2',
    title: 'Smart Solar Streetlights Fitting',
    description: 'Replacing old sodium vapour lamps with smart energy-efficient solar street lights containing automatic daylight sensors.',
    status: 'Completed',
    progress: 100,
    budget: '₹12,00,000',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    contractor: 'BESCOM Eco-Power Ltd.'
  },
  {
    id: 'wp_3',
    title: 'Storm Water Drain Slab Strengthening',
    description: 'Replacing damaged concrete slabs over open storm drains along pre-school lanes to avoid public safety risks.',
    status: 'Ongoing',
    progress: 30,
    budget: '₹18,50,000',
    startDate: '2026-06-15',
    endDate: '2026-08-30',
    contractor: 'Civic Civil Works India'
  }
];

// Synchronization Caches
let cachedNotifications: Notification[] = [];
let cachedSuggestions: Suggestion[] = [];
let cachedVolunteerEvents: VolunteerEvent[] = [];
let cachedVolunteerProfiles: VolunteerProfile[] = [];
let cachedGroups: AreaGroup[] = [];
let cachedGroupPosts: GroupPost[] = [];
let cachedImpactItems: ImpactItem[] = [];
let cachedLeaderboard: LeaderboardUser[] = [];
let cachedWardProjects: WardProject[] = [];

// Event dispatch callbacks
const suggestionsListeners = new Set<() => void>();
const groupPostsListeners = new Set<() => void>();

export function subscribeToSuggestions(cb: () => void) {
  suggestionsListeners.add(cb);
  return () => { suggestionsListeners.delete(cb); };
}

export function subscribeToGroupPosts(cb: () => void) {
  groupPostsListeners.add(cb);
  return () => { groupPostsListeners.delete(cb); };
}

// Background Extended Seeding
async function seedExtendedFirebaseIfNeeded() {
  try {
    const seedHelper = async (colName: string, items: any[]) => {
      const snap = await getDocs(collection(db, colName));
      if (snap.empty) {
        console.log(`Seeding Extended Firestore collection: ${colName}`);
        for (const item of items) {
          await setDoc(doc(db, colName, item.id), item);
        }
      }
    };
    await seedHelper('notifications', SEED_NOTIFICATIONS);
    await seedHelper('suggestions', SEED_SUGGESTIONS);
    await seedHelper('volunteer_events', SEED_VOLUNTEER_EVENTS);
    await seedHelper('volunteer_profiles', SEED_VOLUNTEER_PROFILES);
    await seedHelper('groups', SEED_GROUPS);
    await seedHelper('group_posts', SEED_GROUP_POSTS);
    await seedHelper('impact_items', SEED_IMPACT_ITEMS);
    await seedHelper('leaderboard_users', SEED_LEADERBOARD_USERS);
    await seedHelper('ward_projects', SEED_WARD_PROJECTS);
  } catch (error) {
    console.error('Error seeding Extended Firebase:', error);
  }
}

// Setup real-time listeners for extended entities
function setupExtendedRealtimeListeners() {
  onSnapshot(collection(db, 'notifications'), (snap) => {
    const list: Notification[] = [];
    snap.forEach(doc => list.push(doc.data() as Notification));
    if (list.length > 0) {
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      cachedNotifications = list;
      localStorage.setItem('namma_notifications', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'));

  onSnapshot(collection(db, 'suggestions'), (snap) => {
    const list: Suggestion[] = [];
    snap.forEach(doc => list.push(doc.data() as Suggestion));
    if (list.length > 0) {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      cachedSuggestions = list;
      localStorage.setItem('namma_suggestions', JSON.stringify(list));
      suggestionsListeners.forEach(cb => cb());
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'suggestions'));

  onSnapshot(collection(db, 'volunteer_events'), (snap) => {
    const list: VolunteerEvent[] = [];
    snap.forEach(doc => list.push(doc.data() as VolunteerEvent));
    if (list.length > 0) {
      cachedVolunteerEvents = list;
      localStorage.setItem('namma_volunteer_events', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'volunteer_events'));

  onSnapshot(collection(db, 'volunteer_profiles'), (snap) => {
    const list: VolunteerProfile[] = [];
    snap.forEach(doc => list.push(doc.data() as VolunteerProfile));
    if (list.length > 0) {
      cachedVolunteerProfiles = list;
      localStorage.setItem('namma_volunteer_profiles', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'volunteer_profiles'));

  onSnapshot(collection(db, 'groups'), (snap) => {
    const list: AreaGroup[] = [];
    snap.forEach(doc => list.push(doc.data() as AreaGroup));
    if (list.length > 0) {
      cachedGroups = list;
      localStorage.setItem('namma_groups', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'groups'));

  onSnapshot(collection(db, 'group_posts'), (snap) => {
    const list: GroupPost[] = [];
    snap.forEach(doc => list.push(doc.data() as GroupPost));
    if (list.length > 0) {
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      cachedGroupPosts = list;
      localStorage.setItem('namma_group_posts', JSON.stringify(list));
      groupPostsListeners.forEach(cb => cb());
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'group_posts'));

  onSnapshot(collection(db, 'impact_items'), (snap) => {
    const list: ImpactItem[] = [];
    snap.forEach(doc => list.push(doc.data() as ImpactItem));
    if (list.length > 0) {
      cachedImpactItems = list;
      localStorage.setItem('namma_impact_items', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'impact_items'));

  onSnapshot(collection(db, 'leaderboard_users'), (snap) => {
    const list: LeaderboardUser[] = [];
    snap.forEach(doc => list.push(doc.data() as LeaderboardUser));
    if (list.length > 0) {
      list.sort((a, b) => b.score - a.score);
      cachedLeaderboard = list;
      localStorage.setItem('namma_leaderboard_users', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'leaderboard_users'));

  onSnapshot(collection(db, 'ward_projects'), (snap) => {
    const list: WardProject[] = [];
    snap.forEach(doc => list.push(doc.data() as WardProject));
    if (list.length > 0) {
      cachedWardProjects = list;
      localStorage.setItem('namma_ward_projects', JSON.stringify(list));
    }
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'ward_projects'));
}

export function initExtendedDB() {
  const isInitialized = localStorage.getItem('namma_extended_initialized');
  if (!isInitialized) {
    localStorage.setItem('namma_extended_initialized', 'true');
  }

  // Load from local Cache
  cachedNotifications = JSON.parse(localStorage.getItem('namma_notifications') || '[]');
  cachedSuggestions = JSON.parse(localStorage.getItem('namma_suggestions') || '[]');
  cachedVolunteerEvents = JSON.parse(localStorage.getItem('namma_volunteer_events') || '[]');
  cachedVolunteerProfiles = JSON.parse(localStorage.getItem('namma_volunteer_profiles') || '[]');
  cachedGroups = JSON.parse(localStorage.getItem('namma_groups') || '[]');
  cachedGroupPosts = JSON.parse(localStorage.getItem('namma_group_posts') || '[]');
  cachedImpactItems = JSON.parse(localStorage.getItem('namma_impact_items') || '[]');
  cachedLeaderboard = JSON.parse(localStorage.getItem('namma_leaderboard_users') || '[]');
  cachedWardProjects = JSON.parse(localStorage.getItem('namma_ward_projects') || '[]');

  if (cachedNotifications.length === 0) cachedNotifications = SEED_NOTIFICATIONS;
  if (cachedSuggestions.length === 0) cachedSuggestions = SEED_SUGGESTIONS;
  if (cachedVolunteerEvents.length === 0) cachedVolunteerEvents = SEED_VOLUNTEER_EVENTS;
  if (cachedVolunteerProfiles.length === 0) cachedVolunteerProfiles = SEED_VOLUNTEER_PROFILES;
  if (cachedGroups.length === 0) cachedGroups = SEED_GROUPS;
  if (cachedGroupPosts.length === 0) cachedGroupPosts = SEED_GROUP_POSTS;
  if (cachedImpactItems.length === 0) cachedImpactItems = SEED_IMPACT_ITEMS;
  if (cachedLeaderboard.length === 0) cachedLeaderboard = SEED_LEADERBOARD_USERS;
  if (cachedWardProjects.length === 0) cachedWardProjects = SEED_WARD_PROJECTS;

  seedExtendedFirebaseIfNeeded();
  setupExtendedRealtimeListeners();
}

// Notifications Helpers
export function getNotifications(): Notification[] {
  if (cachedNotifications.length === 0) initExtendedDB();
  return cachedNotifications;
}

export function markNotificationAsRead(id: string) {
  const notifs = getNotifications();
  const index = notifs.findIndex(n => n.id === id);
  if (index !== -1) {
    notifs[index].read = true;
    localStorage.setItem('namma_notifications', JSON.stringify(notifs));

    // Sync to Firestore
    setDoc(doc(db, 'notifications', id), notifs[index])
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`));
  }
}

export function markAllNotificationsAsRead() {
  const notifs = getNotifications();
  notifs.forEach(n => {
    n.read = true;
    setDoc(doc(db, 'notifications', n.id), n)
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `notifications/${n.id}`));
  });
  localStorage.setItem('namma_notifications', JSON.stringify(notifs));
}

export function getUnreadNotificationsCount(): number {
  return getNotifications().filter(n => !n.read).length;
}

// Suggestions Helpers
export function getSuggestions(): Suggestion[] {
  if (cachedSuggestions.length === 0) initExtendedDB();
  return cachedSuggestions;
}

export function createSuggestion(title: string, description: string, category: Suggestion['category'], area: string): Suggestion {
  const list = getSuggestions();
  const currentUser = getCurrentUser() || { name: 'Arjun Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' };

  const newItem: Suggestion = {
    id: 'sug_' + Date.now(),
    title,
    description,
    category,
    area: area || 'Indiranagar',
    creatorName: currentUser.name,
    creatorAvatar: currentUser.avatar,
    upvotes: 0,
    upvotedBy: [],
    status: 'Received',
    createdAt: new Date().toISOString()
  };

  list.unshift(newItem);
  localStorage.setItem('namma_suggestions', JSON.stringify(list));

  // Sync to Firestore
  setDoc(doc(db, 'suggestions', newItem.id), newItem)
    .catch(err => handleFirestoreError(err, OperationType.CREATE, `suggestions/${newItem.id}`));

  return newItem;
}

export function upvoteSuggestion(id: string): Suggestion | undefined {
  const list = getSuggestions();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const item = list.find(s => s.id === id);
  if (!item) return;

  const upIndex = item.upvotedBy.indexOf(currentUser.id);
  if (upIndex > -1) {
    item.upvotedBy.splice(upIndex, 1);
    item.upvotes = Math.max(0, item.upvotes - 1);
  } else {
    item.upvotedBy.push(currentUser.id);
    item.upvotes += 1;
  }

  localStorage.setItem('namma_suggestions', JSON.stringify(list));

  // Sync to Firestore
  setDoc(doc(db, 'suggestions', item.id), item)
    .catch(err => handleFirestoreError(err, OperationType.UPDATE, `suggestions/${item.id}`));

  return item;
}

// Volunteer Event Helpers
export function getVolunteerEvents(): VolunteerEvent[] {
  if (cachedVolunteerEvents.length === 0) initExtendedDB();
  return cachedVolunteerEvents;
}

export function getVolunteerProfiles(): VolunteerProfile[] {
  if (cachedVolunteerProfiles.length === 0) initExtendedDB();
  return cachedVolunteerProfiles;
}

export function joinVolunteerEvent(eventId: string): VolunteerEvent | undefined {
  const events = getVolunteerEvents();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const event = events.find(e => e.id === eventId);
  if (!event) return;

  const userIndex = event.participants.indexOf(currentUser.id);
  if (userIndex > -1) {
    event.participants.splice(userIndex, 1);
  } else {
    event.participants.push(currentUser.id);
  }

  localStorage.setItem('namma_volunteer_events', JSON.stringify(events));

  // Sync to Firestore
  setDoc(doc(db, 'volunteer_events', event.id), event)
    .catch(err => handleFirestoreError(err, OperationType.UPDATE, `volunteer_events/${event.id}`));

  return event;
}

// Groups Helpers
export function getGroups(): AreaGroup[] {
  if (cachedGroups.length === 0) initExtendedDB();
  return cachedGroups;
}

export function getGroupPosts(groupId: string): GroupPost[] {
  if (cachedGroupPosts.length === 0) initExtendedDB();
  return cachedGroupPosts.filter((p: any) => p.groupId === groupId)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function joinGroup(groupId: string): AreaGroup | undefined {
  const list = getGroups();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const group = list.find(g => g.id === groupId);
  if (!group) return;

  const userIndex = group.members.indexOf(currentUser.id);
  if (userIndex === -1) {
    group.members.push(currentUser.id);
    group.memberCount += 1;
  }

  localStorage.setItem('namma_groups', JSON.stringify(list));

  // Sync to Firestore
  setDoc(doc(db, 'groups', group.id), group)
    .catch(err => handleFirestoreError(err, OperationType.UPDATE, `groups/${group.id}`));

  return group;
}

export function leaveGroup(groupId: string): AreaGroup | undefined {
  const list = getGroups();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const group = list.find(g => g.id === groupId);
  if (!group) return;

  const userIndex = group.members.indexOf(currentUser.id);
  if (userIndex > -1) {
    group.members.splice(userIndex, 1);
    group.memberCount = Math.max(0, group.memberCount - 1);
  }

  localStorage.setItem('namma_groups', JSON.stringify(list));

  // Sync to Firestore
  setDoc(doc(db, 'groups', group.id), group)
    .catch(err => handleFirestoreError(err, OperationType.UPDATE, `groups/${group.id}`));

  return group;
}

export function createGroupPost(groupId: string, content: string): GroupPost {
  if (cachedGroupPosts.length === 0) initExtendedDB();
  const currentUser = getCurrentUser() || { name: 'Arjun Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' };

  const newPost: GroupPost = {
    id: 'gp_' + Date.now(),
    groupId,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    content,
    timestamp: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };

  cachedGroupPosts.unshift(newPost);
  localStorage.setItem('namma_group_posts', JSON.stringify(cachedGroupPosts));

  // Sync to Firestore
  setDoc(doc(db, 'group_posts', newPost.id), newPost)
    .catch(err => handleFirestoreError(err, OperationType.CREATE, `group_posts/${newPost.id}`));

  return newPost;
}

export function likeGroupPost(postId: string): GroupPost | undefined {
  if (cachedGroupPosts.length === 0) initExtendedDB();
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const post = cachedGroupPosts.find((p: any) => p.id === postId);
  if (!post) return;

  const userIndex = post.likedBy.indexOf(currentUser.id);
  if (userIndex > -1) {
    post.likedBy.splice(userIndex, 1);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(currentUser.id);
    post.likes += 1;
  }

  localStorage.setItem('namma_group_posts', JSON.stringify(cachedGroupPosts));

  // Sync to Firestore
  setDoc(doc(db, 'group_posts', post.id), post)
    .catch(err => handleFirestoreError(err, OperationType.UPDATE, `group_posts/${post.id}`));

  return post;
}

// Impact Items
export function getImpactItems(): ImpactItem[] {
  if (cachedImpactItems.length === 0) initExtendedDB();
  return cachedImpactItems;
}

// Leaderboard
export function getLeaderboard(): LeaderboardUser[] {
  if (cachedLeaderboard.length === 0) initExtendedDB();
  return cachedLeaderboard;
}

// Ward Projects
export function getWardProjects(): WardProject[] {
  if (cachedWardProjects.length === 0) initExtendedDB();
  return cachedWardProjects;
}
