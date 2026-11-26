export interface DoorStats {
  /** Players who finished the door, solved or thrown out. */
  players: number;
  /** Players who passed the exam. */
  cracked: number;
  /** Guests sent, summed over all players. */
  probes: number;
}

export const EMPTY_STATS: DoorStats = { players: 0, cracked: 0, probes: 0 };

/** The app's comment on a new daily post. Null when nobody played. */
export const recapText = (args: {
  doorNumber: number;
  answer: string;
  stats: DoorStats;
}): string | null => {
  const { doorNumber, answer, stats } = args;
  if (stats.players <= 0) return null;
  const pct = Math.round((stats.cracked / stats.players) * 100);
  const avg = (stats.probes / stats.players).toFixed(1);
  const who =
    stats.players === 1
      ? '1 player tried it'
      : `${stats.players} players tried it`;
  return [
    `**Yesterday's door (#${doorNumber})**`,
    `The rule was: ${answer}`,
    `${who}. ${pct}% cracked it, with an average of ${avg} guests sent.`,
    'What was your best wrong theory? Tell us below, and keep today’s rule a secret.',
  ].join('\n\n');
};
