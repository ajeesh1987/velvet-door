import { evalRule, guestKey } from './engine';
import type { Probe } from './door';
import type { Guest, Rule } from './types';

/** Has this guest already been tested (starters included)? */
export const alreadyTested = (
  known: readonly Probe[],
  guest: Guest
): Probe | undefined => known.find((p) => guestKey(p.guest) === guestKey(guest));

/** The bouncer's decision. Only the server ever calls this. */
export const decide = (rule: Rule, guest: Guest): boolean =>
  evalRule(rule, guest);
