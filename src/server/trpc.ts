import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { transformer } from '../shared/transformer';
import { Context } from './context';
import { context } from '@devvit/web/server';
import { guestSchema, dayLabel, type Probe } from '../shared/door';
import { utcDayIndex } from '../shared/streak';
import { alreadyTested, decide } from '../shared/judge';
import { loadProbes, saveProbes } from './core/door';
import { doorForDay, startersFor, type Door } from './core/schedule';
import {
  examGuestsFor,
  finishExam,
  loadCalls,
  loadResult,
  saveCalls,
} from './core/exam';
import { MIN_PROBES, examStatus } from '../shared/result';
import type { Guest } from '../shared/types';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

const examView = (door: Door, calls: boolean[] | null) => {
  if (!calls) return null;
  const guests: Guest[] = examGuestsFor(door.entry.id);
  return {
    guests,
    calls: calls.map((call, i) => {
      const g = guests[i];
      return { call, correct: g ? decide(door.entry.rule, g) === call : false };
    }),
  };
};

const missesOf = (view: NonNullable<ReturnType<typeof examView>>) =>
  view.calls.filter((c) => !c.correct).length;

export const appRouter = t.router({
  door: t.router({
    today: publicProcedure.query(async () => {
      const day = utcDayIndex();
      const door = doorForDay(day);
      const starters = startersFor(door.entry.id);
      const { userId } = context;
      const probes = userId ? await loadProbes(door.number, userId) : [];
      const result = userId ? await loadResult(door.number, userId) : null;
      const calls = userId ? await loadCalls(door.number, userId) : null;
      return {
        exam: result ? null : examView(door, calls),
        result,
        number: door.number,
        dateLabel: dayLabel(day),
        difficulty: door.difficulty,
        starters: [
          { guest: starters.admit, admit: true },
          { guest: starters.reject, admit: false },
        ] satisfies Probe[],
        probes,
      };
    }),
    probe: publicProcedure.input(guestSchema).mutation(async ({ input }) => {
      const door = doorForDay(utcDayIndex());
      const starters = startersFor(door.entry.id);
      const { userId } = context;
      const mine = userId ? await loadProbes(door.number, userId) : [];
      const known: Probe[] = [
        { guest: starters.admit, admit: true },
        { guest: starters.reject, admit: false },
        ...mine,
      ];
      const seen = alreadyTested(known, input);
      if (seen) return { admit: seen.admit, duplicate: true as const };

      const admit = decide(door.entry.rule, input);
      if (userId) {
        await saveProbes(door.number, userId, [...mine, { guest: input, admit }]);
      }
      return { admit, duplicate: false as const };
    }),
    examStart: publicProcedure.mutation(async () => {
      const { userId } = context;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
      const door = doorForDay(utcDayIndex());
      if (await loadResult(door.number, userId)) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'done' });
      }
      const probes = await loadProbes(door.number, userId);
      const existing = await loadCalls(door.number, userId);
      if (!existing && probes.length < MIN_PROBES) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'too early' });
      }
      const calls = existing ?? [];
      if (!existing) await saveCalls(door.number, userId, calls);
      return examView(door, calls)!;
    }),
    examAnswer: publicProcedure
      .input(z.object({ call: z.boolean() }))
      .mutation(async ({ input }) => {
        const { userId } = context;
        if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
        const door = doorForDay(utcDayIndex());
        if (await loadResult(door.number, userId)) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'done' });
        }
        const calls = await loadCalls(door.number, userId);
        if (!calls) throw new TRPCError({ code: 'BAD_REQUEST', message: 'no exam' });
        const guests = examGuestsFor(door.entry.id);
        const guest = guests[calls.length];
        if (!guest) throw new TRPCError({ code: 'BAD_REQUEST', message: 'no guest' });

        const truth = decide(door.entry.rule, guest);
        const next = [...calls, input.call];
        await saveCalls(door.number, userId, next);
        const view = examView(door, next)!;
        const misses = missesOf(view);
        const status = examStatus(next.length, misses, guests.length);
        const correct = truth === input.call;
        if (status === 'active') return { correct, status, result: null };

        const probes = (await loadProbes(door.number, userId)).length;
        const result = await finishExam({ door, userId, status, misses, probes });
        return { correct, status, result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
