/** Streak logic: pure functions, no Reddit or Redis imports. */

export interface StreakState {
  /** Consecutive days finished, as of lastDay. */
  count: number;
  /** Highest streak ever reached. */
  best: number;
  /** UTC day index of the last finished day, or null if never. */
  lastDay: number | null;
}

export const EMPTY_STREAK: StreakState = { count: 0, best: 0, lastDay: null };

const DAY_MS = 86_400_000;

/** Days since 1970-01-01, in UTC. Everyone shares this clock. */
export const utcDayIndex = (d: Date = new Date()): number =>
  Math.floor(d.getTime() / DAY_MS);

export interface FinishResult {
  state: StreakState;
  /** False when the day was already counted (or the clock went backwards). */
  changed: boolean;
}

/** Record that the player finished `day` (solved it or struck out). */
export function recordFinish(prev: StreakState, day: number): FinishResult {
  if (prev.lastDay !== null && day <= prev.lastDay) {
    return { state: prev, changed: false };
  }
  const continues = prev.lastDay !== null && day === prev.lastDay + 1;
  const count = continues ? prev.count + 1 : 1;
  const best = Math.max(prev.best, count);
  return { state: { count, best, lastDay: day }, changed: true };
}

/** The streak to show today: it is broken if yesterday was missed. */
export function currentStreak(state: StreakState, today: number): number {
  if (state.lastDay === null) return 0;
  return state.lastDay >= today - 1 ? state.count : 0;
}

export interface Rank {
  min: number;
  name: string;
}

/** Highest first. Rename freely: ranks are just labels. */
export const RANKS: Rank[] = [
  { min: 14, name: 'Club Owner' },
  { min: 7, name: 'Head Bouncer' },
  { min: 3, name: 'Doorman' },
  { min: 1, name: 'Guest list' },
];

export function rankFor(streak: number): Rank | null {
  return RANKS.find((r) => streak >= r.min) ?? null;
}

/** Flair text, e.g. "Doorman - 3 day streak". Reddit caps flair at 64 chars. */
export function flairText(streak: number): string | null {
  const rank = rankFor(streak);
  if (!rank) return null;
  const unit = streak === 1 ? 'day' : 'days';
  return `${rank.name} - ${streak} ${unit}`;
}
