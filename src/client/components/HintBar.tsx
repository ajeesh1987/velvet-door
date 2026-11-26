import { useState } from 'react';
import { HINT_AFTER } from '../../shared/hint';
import { MIN_PROBES } from '../../shared/result';
import { trpc } from '../trpc';

const line = (sent: number): string => {
  if (sent === 0) return "Send guests in and learn the bouncer's secret rule.";
  if (sent < MIN_PROBES)
    return 'Compare the columns. What do admitted guests share?';
  if (sent < HINT_AFTER)
    return 'Sure about the rule? Take the exam to prove it.';
  return 'Stuck? A hint costs nothing.';
};

/** One quiet line that changes with the player's progress. */
export const HintBar = ({ sent }: { sent: number }) => {
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    setBusy(true);
    try {
      const h = await trpc.door.hint.query();
      setHint(h.text);
    } catch {
      setHint('No hint available right now.');
    }
    setBusy(false);
  };

  return (
    <p
      className="text-muted flex min-h-[20px] shrink-0 items-center justify-center gap-2 text-center text-[12px] leading-tight"
      role="status"
    >
      {hint ?? line(sent)}
      {!hint && sent >= HINT_AFTER ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void ask()}
          className="text-gold-soft cursor-pointer underline underline-offset-2 disabled:opacity-60"
        >
          Show hint
        </button>
      ) : null}
    </p>
  );
};
