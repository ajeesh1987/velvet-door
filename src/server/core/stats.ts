import { redis } from '@devvit/web/server';
import { EMPTY_STATS, type DoorStats } from '../../shared/recap';

const statsKey = (n: number) => `stats:${n}`;

/** Count one finished player. Call once per player per door. */
export const recordResult = async (
  n: number,
  r: { passed: boolean; probes: number }
): Promise<void> => {
  await Promise.all([
    redis.hIncrBy(statsKey(n), 'players', 1),
    redis.hIncrBy(statsKey(n), 'cracked', r.passed ? 1 : 0),
    redis.hIncrBy(statsKey(n), 'probes', r.probes),
  ]);
};

export const loadStats = async (n: number): Promise<DoorStats> => {
  const h = await redis.hGetAll(statsKey(n));
  if (!h.players) return EMPTY_STATS;
  return {
    players: Number(h.players),
    cracked: Number(h.cracked ?? 0),
    probes: Number(h.probes ?? 0),
  };
};
