import { redis } from '@devvit/web/server';
import { z } from 'zod';
import { guestSchema, type Probe } from '../../shared/door';

const probesSchema = z.array(z.object({ guest: guestSchema, admit: z.boolean() }));

const runKey = (doorNumber: number, userId: string) =>
  `run:${doorNumber}:${userId}`;

export const loadProbes = async (
  doorNumber: number,
  userId: string
): Promise<Probe[]> => {
  const raw = await redis.get(runKey(doorNumber, userId));
  if (!raw) return [];
  try {
    return probesSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
};

export const saveProbes = async (
  doorNumber: number,
  userId: string,
  probes: Probe[]
): Promise<void> => {
  await redis.set(runKey(doorNumber, userId), JSON.stringify(probes));
};
