import { MAX_MISSES } from '../../shared/result';
import { cn } from '../utils';

export interface ExamCall {
  call: boolean;
  correct: boolean;
}

/** Progress dots, strikes and the two calls for the exam. */
export const ExamPanel = ({
  total,
  calls,
  verdict,
  busy,
  onAnswer,
}: {
  total: number;
  calls: ExamCall[];
  verdict: { correct: boolean } | null;
  busy: boolean;
  onAnswer: (call: boolean) => void;
}) => {
  const shown: ExamCall[] = verdict
    ? [...calls, { call: false, correct: verdict.correct }]
    : calls;
  const misses = shown.filter((c) => !c.correct).length;
  const n = Math.min(calls.length + 1, total);
  return (
    <section className="border-gold/40 bg-panel shrink-0 rounded-xl border p-2.5">
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-1.5"
          aria-label={`Guest ${n} of ${total}`}
        >
          {Array.from({ length: total }, (_, i) => {
            const c = calls[i];
            return (
              <span
                key={i}
                className={cn(
                  'h-2.5 w-2.5 rounded-full border',
                  c
                    ? c.correct
                      ? 'border-good bg-good'
                      : 'border-bad bg-bad'
                    : i === shown.length
                      ? 'border-gold bg-gold/30'
                      : 'border-muted/40'
                )}
              />
            );
          })}
        </div>
        <div
          className="text-muted flex items-center gap-1 text-[12px]"
          aria-label={`${misses} strikes`}
        >
          Strikes
          {Array.from({ length: MAX_MISSES + 1 }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-2.5 w-2.5 rounded-sm border',
                i < misses ? 'border-bad bg-bad' : 'border-muted/50'
              )}
            />
          ))}
        </div>
      </div>
      <p
        className="text-cream mt-2 min-h-[20px] text-center text-[13px]"
        role="status"
      >
        {verdict
          ? verdict.correct
            ? 'Correct!'
            : 'Strike! That was the wrong call.'
          : `Guest ${n} of ${total}: would he let this one in?`}
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onAnswer(true)}
          className="border-good bg-good/15 text-good hover:bg-good/25 h-11 cursor-pointer rounded-full border-2 font-medium transition-colors disabled:opacity-50"
        >
          Let in
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onAnswer(false)}
          className="border-bad bg-bad/15 text-bad hover:bg-bad/25 h-11 cursor-pointer rounded-full border-2 font-medium transition-colors disabled:opacity-50"
        >
          Turn away
        </button>
      </div>
    </section>
  );
};
