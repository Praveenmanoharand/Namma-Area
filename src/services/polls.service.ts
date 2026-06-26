import { db, handleFirestoreError, OperationType } from '../firebase/firebase';
import { 
  collection, doc, onSnapshot, runTransaction, getDocs, query
} from 'firebase/firestore';
import { CommunityPoll } from '../types';
import { getCurrentUser, updateUserProfile } from './users.service';

let cachedPolls: CommunityPoll[] = [];
const pollsListeners = new Set<() => void>();

export function subscribeToPolls(cb: () => void) {
  pollsListeners.add(cb);
  return () => {
    pollsListeners.delete(cb);
  };
}

export function initPollsListener() {
  const q = collection(db, 'polls');
  
  return onSnapshot(q, (snap) => {
    const list: CommunityPoll[] = [];
    snap.forEach(d => {
      const p = d.data() as CommunityPoll;
      p.id = d.id;
      // In case userVotes is missing, initialize it
      if (!p.userVotes) {
        p.userVotes = {};
      }
      list.push(p);
    });
    cachedPolls = list;
    pollsListeners.forEach(cb => cb());
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, 'polls');
  });
}

export function getPolls(): CommunityPoll[] {
  return cachedPolls;
}

export async function voteInPoll(pollId: string, optionIndex: number): Promise<CommunityPoll | undefined> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be logged in to participate in polls.');
  }

  const userId = currentUser.id;
  const pollRef = doc(db, 'polls', pollId);
  const userVoteRef = doc(db, 'polls', pollId, 'votes', userId);

  let updatedPoll: CommunityPoll | undefined;

  try {
    await runTransaction(db, async (transaction) => {
      // 1. Reads first
      const pollSnap = await transaction.get(pollRef);
      if (!pollSnap.exists()) {
        throw new Error(`Poll ${pollId} does not exist.`);
      }

      const userVoteSnap = await transaction.get(userVoteRef);
      const poll = pollSnap.data() as CommunityPoll;
      poll.id = pollSnap.id;
      
      if (!poll.userVotes) poll.userVotes = {};
      
      const options = [...poll.options];
      let totalVotes = poll.totalVotes || 0;
      const userVotes = { ...poll.userVotes };

      const hasVotedBefore = userVoteSnap.exists();
      const previousVote = hasVotedBefore ? userVoteSnap.data().optionIndex : undefined;

      // 2. Compute state transition
      if (previousVote === optionIndex) {
        // Toggle off the vote
        options[optionIndex].votes = Math.max(0, (options[optionIndex].votes || 0) - 1);
        totalVotes = Math.max(0, totalVotes - 1);
        delete userVotes[userId];

        // 3. Writes
        transaction.delete(userVoteRef);
      } else {
        if (previousVote !== undefined) {
          // Change vote: decrement previous option
          options[previousVote].votes = Math.max(0, (options[previousVote].votes || 0) - 1);
        } else {
          // New vote: increment total votes
          totalVotes += 1;
        }

        // Increment new option
        options[optionIndex].votes = (options[optionIndex].votes || 0) + 1;
        userVotes[userId] = optionIndex;

        // 3. Writes
        transaction.set(userVoteRef, { optionIndex, votedAt: new Date().toISOString() });
      }

      const pollUpdate = {
        options,
        totalVotes,
        userVotes
      };

      transaction.update(pollRef, pollUpdate);
      updatedPoll = { ...poll, ...pollUpdate };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `polls/${pollId}/votes/${userId}`);
  }

  // Update contributor points
  if (currentUser) {
    await updateUserProfile({
      contributionsCount: currentUser.contributionsCount + 5,
      recentActivity: [
        {
          id: 'act_poll_' + Date.now(),
          type: 'participated' as const,
          title: `Voted in poll: ${updatedPoll?.question}`,
          subtitle: `Just now • Community Opinion`,
          timestamp: new Date().toISOString(),
        },
        ...currentUser.recentActivity,
      ],
    });
  }

  // Optimistic update of local cache
  if (updatedPoll) {
    const idx = cachedPolls.findIndex(p => p.id === pollId);
    if (idx !== -1) {
      cachedPolls[idx] = updatedPoll;
      pollsListeners.forEach(cb => cb());
    }
  }

  return updatedPoll;
}
