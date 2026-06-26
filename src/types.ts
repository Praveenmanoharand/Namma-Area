/**
 * Types and interfaces for the Namma Area platform.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  mobileNumber?: string;
  avatar: string;
  role: 'resident' | 'official';
  area: string;
  contributorLevel: number;
  complaintsCount: number;
  resolvedCount: number;
  contributionsCount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'resolved' | 'participated' | 'submitted' | 'commented';
  title: string;
  subtitle: string;
  timestamp: string;
  complaintId?: string;
}

export type ComplaintCategory = 'Sanitation' | 'Roads' | 'Water Supply' | 'Street Lights' | 'Safety' | 'Other';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  location: string;
  upvotes: number;
  upvotedBy: string[]; // List of user IDs who upvoted
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  createdAt: string;
  image: string;
  comments: Comment[];
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: 'Community Drive' | 'Project Update' | 'Government Update' | 'Water Supply' | 'Electricity Maintenance' | 'Road Work' | 'Community Event';
  date: string;
  image: string;
  actionText: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  duration: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  name: string;
  category: 'Electronics' | 'Documents' | 'Wallets & Bags' | 'Keys' | 'Pets' | 'Vehicles' | 'Other';
  description: string;
  location: string;
  date: string;
  image: string;
  contactInfo: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  createdAt: string;
}

export interface LocalJob {
  id: string;
  title: string;
  employer: string;
  location: string;
  category: 'Electrician' | 'Plumber' | 'Driver' | 'Delivery' | 'Housekeeping' | 'Part Time' | 'Other';
  salary: string;
  contactNumber: string;
  description: string;
  creatorId: string;
  createdAt: string;
}

export interface CommunityPoll {
  id: string;
  question: string;
  options: {
    text: string;
    votes: number;
  }[];
  userVotes: { [userId: string]: number }; // Maps userId -> optionIndex
  totalVotes: number;
  endDate: string;
  category: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'Police' | 'Ambulance' | 'Fire Service' | 'Municipality' | 'Electricity Board' | 'Water Board';
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'complaint' | 'alert' | 'announcement' | 'poll' | 'emergency';
  read: boolean;
  relatedId?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: 'Park Requests' | 'Road Improvements' | 'Public Facility Requests' | 'Bus Stop Requests' | 'General Suggestions';
  area: string;
  creatorName: string;
  creatorAvatar: string;
  upvotes: number;
  upvotedBy: string[];
  status: 'Received' | 'Reviewed' | 'Approved';
  createdAt: string;
}

export interface VolunteerEvent {
  id: string;
  title: string;
  description: string;
  category: 'Tree Plantation' | 'Clean-up Drives' | 'Blood Donation Camps' | 'Community Events' | 'Disaster Relief';
  date: string;
  location: string;
  organizer: string;
  image: string;
  participants: string[];
  maxParticipants?: number;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  avatar: string;
  area: string;
  skills: string[];
  participationCount: number;
  history: string[];
}

export interface AreaGroup {
  id: string;
  name: string;
  description: string;
  category: 'residents' | 'apartment' | 'interest' | 'watch';
  memberCount: number;
  members: string[];
  image: string;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

export interface ImpactItem {
  id: string;
  title: string;
  description: string;
  area: string;
  resolutionDate: string;
  beforeImage: string;
  afterImage: string;
  feedback: string;
  officerName: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  area: string;
  score: number;
  complaintsSubmitted: number;
  suggestionsMade: number;
  pollsParticipated: number;
  volunteeredCount: number;
  badges: string[];
}

export interface WardProject {
  id: string;
  title: string;
  description: string;
  status: 'Ongoing' | 'Completed' | 'Planned';
  progress: number;
  budget: string;
  startDate: string;
  endDate: string;
  contractor: string;
}

