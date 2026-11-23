import { redis, reddit } from '@devvit/web/server';
import {
  EMPTY_STREAK,
  flairText,
  recordFinish,
  type StreakState,
} from '../../shared/streak';

const streakKey = (userId: string) => `streak:${userId}`;

export async function loadStreak(userId: string): Promise<StreakState> {
  const h = await redis.hGetAll(streakKey(userId));
  if (!h.count) return EMPTY_STREAK;
  return {
    count: Number(h.count),
    best: Number(h.best ?? h.count),
    lastDay: h.lastDay === undefined ? null : Number(h.lastDay),
  };
}

export async function saveStreak(
  userId: string,
  s: StreakState
): Promise<void> {
  await redis.hSet(streakKey(userId), {
    count: String(s.count),
    best: String(s.best),
    lastDay: s.lastDay === null ? '' : String(s.lastDay),
  });
}

export interface FinishOutcome {
  state: StreakState;
  changed: boolean;
  flair: string | null;
}

/**
 * Call when a player finishes a day (solved or struck out).
 * Updates Redis, and sets flair only if the streak actually changed.
 */
export async function finishDay(args: {
  userId: string;
  username: string;
  subredditName: string;
  day: number;
}): Promise<FinishOutcome> {
  const { userId, username, subredditName, day } = args;
  const prev = await loadStreak(userId);
  const { state, changed } = recordFinish(prev, day);
  if (!changed) return { state, changed, flair: null };

  await saveStreak(userId, state);
  const text = flairText(state.count);
  if (text) {
    await reddit.setUserFlair({ subredditName, username, text });
  }
  return { state, changed, flair: text };
}

export async function resetStreak(userId: string): Promise<void> {
  await redis.del(streakKey(userId));
}
