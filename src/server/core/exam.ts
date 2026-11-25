import { context, reddit, redis } from '@devvit/web/server';
import { z } from 'zod';
import { RULE_META } from '../../shared/bank.generated';
import {
  gradeOf,
  quoteFor,
  type DayResult,
  type ExamStatus,
} from '../../shared/result';
import { rankFor, utcDayIndex } from '../../shared/streak';
import type { Door } from './schedule';
import { finishDay, loadStreak } from './streak';

const callsKey = (n: number, u: string) => `exam:${n}:${u}`;
const resultKey = (n: number, u: string) => `result:${n}:${u}`;

const callsSchema = z.array(z.boolean());

export const examGuestsFor = (id: string) => {
  const meta = RULE_META[id];
  if (!meta) throw new Error(`no metadata for ${id}`);
  return meta.exam;
};

/** The player's calls so far, or null if the exam has not started. */
export const loadCalls = async (
  n: number,
  userId: string
): Promise<boolean[] | null> => {
  const raw = await redis.get(callsKey(n, userId));
  if (!raw) return null;
  try {
    return callsSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveCalls = async (
  n: number,
  userId: string,
  calls: boolean[]
): Promise<void> => {
  await redis.set(callsKey(n, userId), JSON.stringify(calls));
};

export const loadResult = async (
  n: number,
  userId: string
): Promise<DayResult | null> => {
  const raw = await redis.get(resultKey(n, userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DayResult;
  } catch {
    return null;
  }
};

/** Close out the day: streak, flair, and a saved result card. */
export const finishExam = async (args: {
  door: Door;
  userId: string;
  status: Exclude<ExamStatus, 'active'>;
  misses: number;
  probes: number;
}): Promise<DayResult> => {
  const { door, userId, status, misses, probes } = args;
  let streak = await loadStreak(userId);
  try {
    const username = await reddit.getCurrentUsername();
    const { subredditName } = context;
    if (username && subredditName) {
      const out = await finishDay({
        userId,
        username,
        subredditName,
        day: utcDayIndex(),
      });
      streak = out.state;
    }
  } catch (error) {
    console.error(`finishDay failed: ${error}`);
  }
  const botProbes = RULE_META[door.entry.id]?.botProbes ?? 99;
  const grade = gradeOf({ status, misses, probes, botProbes });
  const result: DayResult = {
    status,
    grade,
    misses,
    probes,
    answer: door.entry.answer,
    quote: quoteFor(grade, door.number),
    streak: streak.count,
    best: streak.best,
    rank: rankFor(streak.count)?.name ?? null,
  };
  await redis.set(resultKey(door.number, userId), JSON.stringify(result));
  return result;
};
