import { useEffect, useState } from 'react';
import {
  GRADE_LABEL,
  formatCountdown,
  msUntilNextDoor,
  type DayResult,
} from '../../shared/result';
import { DoorScene } from '../art/scene';
import { cn } from '../utils';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-gold/25 bg-panel px-2 py-1.5 text-center">
    <div className="text-lg leading-none text-cream">{value}</div>
    <div className="mt-1 text-[11px] text-muted">{label}</div>
  </div>
);

/** The end of the day: grade, bouncer quote, the rule, streak, next door. */
export const ResultView = ({
  result,
  doorNumber,
}: {
  result: DayResult;
  doorNumber: number;
}) => {
  const won = result.status === 'passed';
  const [left, setLeft] = useState(() => msUntilNextDoor());
  useEffect(() => {
    const id = setInterval(() => setLeft(msUntilNextDoor()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto flex h-full max-w-[460px] flex-col gap-2 overflow-y-auto p-3">
      <header className="shrink-0 text-center">
        <p className="text-[12px] text-muted">Door #{doorNumber}</p>
        <h1
          className={cn(
            'font-display text-2xl leading-tight',
            won ? 'text-gold-soft' : 'text-bad'
          )}
        >
          {won ? 'Door cracked!' : 'Not tonight'}
        </h1>
        <span
          className={cn(
            'mt-1 inline-block rounded-full border px-2.5 py-px text-[12px] font-medium',
            won ? 'border-good text-good' : 'border-bad text-bad'
          )}
        >
          {GRADE_LABEL[result.grade]}
        </span>
      </header>

      <DoorScene
        phase={won ? 'admit' : 'reject'}
        guest={null}
        cycle={0}
        framed
        className="mx-auto max-h-[24vh] w-full shrink-0"
      />

      <p className="shrink-0 rounded-xl border border-gold/30 bg-panel px-3 py-2 text-center font-display text-[15px] italic text-cream">
        &ldquo;{result.quote}&rdquo;
      </p>

      <div className="grid shrink-0 grid-cols-3 gap-2">
        <Stat label="guests sent" value={String(result.probes)} />
        <Stat label="strikes" value={String(result.misses)} />
        <Stat label="day streak" value={String(result.streak)} />
      </div>

      <p className="shrink-0 text-center text-[13px] text-muted">
        The rule was: <span className="text-cream">{result.answer}</span>
      </p>
      {result.rank ? (
        <p className="shrink-0 text-center text-[13px] text-gold-soft">
          {result.rank}
          {result.best > result.streak ? ` · best ${result.best}` : ''}
        </p>
      ) : null}
      <p className="shrink-0 pb-1 text-center text-[12px] text-muted">
        Next door opens in {formatCountdown(left)}
      </p>
    </main>
  );
};
