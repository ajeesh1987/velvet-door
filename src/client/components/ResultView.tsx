import { useEffect, useState } from 'react';
import {
  GRADE_LABEL,
  formatCountdown,
  msUntilNextDoor,
  type DayResult,
} from '../../shared/result';
import { DoorScene } from '../art/scene';
import { trpc } from '../trpc';
import { cn } from '../utils';

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="border-gold/25 bg-panel rounded-lg border px-2 py-1.5 text-center">
    <div className="text-cream text-lg leading-none">{value}</div>
    <div className="text-muted mt-1 text-[11px]">{label}</div>
  </div>
);

type ShareState =
  | { step: 'idle' }
  | { step: 'loading' }
  | { step: 'preview'; text: string }
  | { step: 'posting'; text: string }
  | { step: 'done' }
  | { step: 'error'; text: string | null };

/** Opt-in sharing: the player sees the exact comment before it is posted. */
const SharePanel = ({ onActive }: { onActive: (on: boolean) => void }) => {
  const [state, setState] = useState<ShareState>({ step: 'idle' });
  const active = state.step === 'preview' || state.step === 'posting';
  useEffect(() => {
    onActive(active);
  }, [active, onActive]);

  const open = async () => {
    setState({ step: 'loading' });
    try {
      const p = await trpc.door.sharePreview.query();
      setState(p.posted ? { step: 'done' } : { step: 'preview', text: p.text });
    } catch {
      setState({ step: 'error', text: null });
    }
  };

  const post = async (text: string) => {
    setState({ step: 'posting', text });
    try {
      await trpc.door.share.mutate();
      setState({ step: 'done' });
    } catch {
      setState({ step: 'error', text });
    }
  };

  if (state.step === 'done') {
    return (
      <p
        className="border-good/40 bg-good/10 text-good shrink-0 rounded-xl border px-3 py-2 text-center text-[13px]"
        role="status"
      >
        Posted to the thread. See how everyone else did in the comments.
      </p>
    );
  }
  if (state.step === 'preview' || state.step === 'posting') {
    const busy = state.step === 'posting';
    return (
      <section className="border-gold/40 bg-panel shrink-0 rounded-xl border p-2.5">
        <p className="text-muted mb-1 text-[11px] tracking-wide uppercase">
          This comment will be posted as you
        </p>
        <pre className="bg-card text-cream rounded-lg p-2 font-sans text-[13px] leading-snug whitespace-pre-wrap">
          {state.text}
        </pre>
        <p className="text-muted mt-1 text-[11px]">
          No spoilers: it never shows the rule or the exam guests.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => setState({ step: 'idle' })}
            className="border-gold/50 text-gold-soft hover:bg-stage h-10 cursor-pointer rounded-full border text-[13px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void post(state.text)}
            className="h-10 cursor-pointer rounded-full bg-[linear-gradient(180deg,#ecd27a,#c19a2c)] text-[13px] font-medium text-[#2a0a12] hover:brightness-110 disabled:opacity-60"
          >
            {busy ? 'Posting...' : 'Post comment'}
          </button>
        </div>
      </section>
    );
  }
  return (
    <div className="shrink-0">
      <button
        type="button"
        disabled={state.step === 'loading'}
        onClick={() => void open()}
        className="ring-gold/60 ring-offset-card h-11 w-full cursor-pointer rounded-full bg-[linear-gradient(180deg,#ecd27a,#c19a2c)] font-medium text-[#2a0a12] ring-1 ring-offset-2 transition-[filter] hover:brightness-110 disabled:opacity-60"
      >
        Share my result
      </button>
      {state.step === 'error' ? (
        <p className="text-bad mt-1 text-center text-[12px]" role="status">
          Couldn&apos;t post that. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
};

/** A quiet, optional next step: join the community for tomorrow's door. */
const JoinButton = ({ subreddit }: { subreddit: string }) => {
  const [step, setStep] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const join = async () => {
    setStep('busy');
    try {
      await trpc.door.subscribe.mutate();
      setStep('done');
    } catch {
      setStep('error');
    }
  };
  if (step === 'done') {
    return (
      <p className="text-good shrink-0 text-center text-[13px]" role="status">
        You&apos;re on the list. See you tomorrow.
      </p>
    );
  }
  return (
    <button
      type="button"
      disabled={step === 'busy'}
      onClick={() => void join()}
      className="text-gold-soft shrink-0 cursor-pointer text-center text-[13px] underline underline-offset-2 disabled:opacity-60"
    >
      {step === 'error'
        ? "Couldn't join. Try again?"
        : `Join r/${subreddit} for tomorrow's door`}
    </button>
  );
};

/** The end of the day: grade, bouncer quote, the rule, streak, next door. */
export const ResultView = ({
  result,
  doorNumber,
  subreddit,
}: {
  result: DayResult;
  doorNumber: number;
  subreddit: string | null;
}) => {
  const won = result.status === 'passed';
  const [sharing, setSharing] = useState(false);
  const [left, setLeft] = useState(() => msUntilNextDoor());
  useEffect(() => {
    const id = setInterval(() => setLeft(msUntilNextDoor()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto flex h-full max-w-[460px] flex-col gap-2 overflow-y-auto p-3">
      <header className="shrink-0 text-center">
        <p className="text-muted text-[12px]">Door #{doorNumber}</p>
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

      {sharing ? null : (
        <>
          <DoorScene
            phase={won ? 'admit' : 'reject'}
            guest={null}
            cycle={0}
            framed
            className="mx-auto max-h-[24vh] w-full shrink-0"
          />

          <p className="border-gold/30 bg-panel font-display text-cream shrink-0 rounded-xl border px-3 py-2 text-center text-[15px] italic">
            &ldquo;{result.quote}&rdquo;
          </p>

          <div className="grid shrink-0 grid-cols-3 gap-2">
            <Stat label="guests sent" value={String(result.probes)} />
            <Stat label="strikes" value={String(result.misses)} />
            <Stat label="day streak" value={String(result.streak)} />
          </div>

          <p className="text-muted shrink-0 text-center text-[13px]">
            The rule was: <span className="text-cream">{result.answer}</span>
          </p>
          {result.rank ? (
            <p className="text-gold-soft shrink-0 text-center text-[13px]">
              {result.rank}
              {result.best > result.streak ? ` · best ${result.best}` : ''}
            </p>
          ) : null}
        </>
      )}
      <SharePanel onActive={setSharing} />
      {sharing || !subreddit ? null : <JoinButton subreddit={subreddit} />}
      <p className="text-muted shrink-0 pb-1 text-center text-[12px]">
        Next door opens in {formatCountdown(left)}
      </p>
    </main>
  );
};
