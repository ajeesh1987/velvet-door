import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer';
import { Context } from './context';
import { context } from '@devvit/web/server';
import { guestSchema, dayLabel, type Probe } from '../shared/door';
import { utcDayIndex } from '../shared/streak';
import { alreadyTested, decide } from '../shared/judge';
import { loadProbes, saveProbes } from './core/door';
import { doorForDay, startersFor } from './core/schedule';

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

export const appRouter = t.router({
  door: t.router({
    today: publicProcedure.query(async () => {
      const day = utcDayIndex();
      const door = doorForDay(day);
      const starters = startersFor(door.entry.id);
      const { userId } = context;
      const probes = userId ? await loadProbes(door.number, userId) : [];
      return {
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
  }),
});

export type AppRouter = typeof appRouter;
