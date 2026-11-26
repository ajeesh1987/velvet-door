export const ADMIT_QUIPS = [
  'Welcome in.',
  'Right this way.',
  "You're on the list.",
  'Go on through.',
  'Enjoy your night.',
];
export const REJECT_QUIPS = [
  'Not tonight.',
  'Not on the list.',
  'Nope.',
  'Try the next club.',
  'Move along.',
];
export const RIGHT_QUIPS = ['Good eye.', 'Spot on.', 'You know my door.'];
export const WRONG_QUIPS = ['Not quite.', 'Careful now.', 'Wrong call.'];

/** Deterministic pick so the same step always shows the same line. */
export const pickQuip = (lines: string[], seed: number): string =>
  lines[Math.abs(Math.trunc(seed)) % lines.length] ?? '';
