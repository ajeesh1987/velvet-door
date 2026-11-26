import './index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/trpc';
import type { Probe } from '../shared/door';
import { ALL_GUESTS, guestKey } from '../shared/engine';
import {
  ADMIT_QUIPS,
  pickQuip,
  REJECT_QUIPS,
  RIGHT_QUIPS,
  WRONG_QUIPS,
} from '../shared/quips';
import { MIN_PROBES, type DayResult } from '../shared/result';
import type { Guest } from '../shared/types';
import { DoorScene, type Phase } from './art/scene';
import { ExamPanel } from './components/ExamPanel';
import { GuestBuilder } from './components/GuestBuilder';
import { HelpModal } from './components/HelpModal';
import { HintBar } from './components/HintBar';
import { ProbeColumns, type HistoryItem } from './components/ProbeColumns';
import { ResultView } from './components/ResultView';
import { play, setSoundOn, soundOn } from './sound';
import { trpc } from './trpc';
import { cn } from './utils';

type Door = inferRouterOutputs<AppRouter>['door']['today'];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const randomGuest = (): Guest =>
  ALL_GUESTS[Math.floor(Math.random() * ALL_GUESTS.length)] ?? {
    headwear: 'beret',
    top: 'puffer',
    item: 'lantern',
    footwear: 'rainboots',
  };

type Exam = NonNullable<Door['exam']>;

const BADGE = {
  easy: 'border-good text-good',
  medium: 'border-gold text-gold',
  hard: 'border-bad text-bad',
} as const;

export const App = () => {
  const [door, setDoor] = useState<Door | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [extra, setExtra] = useState<Probe[]>([]);
  const [guest, setGuest] = useState<Guest>(randomGuest);
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [latest, setLatest] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<DayResult | null>(null);
  const [verdict, setVerdict] = useState<{ correct: boolean } | null>(null);
  const [fresh, setFresh] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);
  const [sound, setSound] = useState(soundOn);

  useEffect(() => {
    let live = true;
    trpc.door.today
      .query()
      .then((d) => {
        if (!live) return;
        setDoor(d);
        setExam(d.exam);
        setResult(d.result);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [attempt]);

  const history: HistoryItem[] = door
    ? [
        ...door.starters.map((p) => ({ ...p, starter: true })),
        ...door.probes.map((p) => ({ ...p, starter: false })),
        ...extra.map((p) => ({ ...p, starter: false })),
      ]
    : [];
  const sent = door ? door.probes.length + extra.length : 0;

  const send = async () => {
    if (phase !== 'idle' || !door) return;
    const key = guestKey(guest);
    if (history.some((h) => guestKey(h.guest) === key)) {
      setNote('Already tested that guest. Change something first.');
      return;
    }
    setNote(null);
    setPhase('arriving');
    try {
      const [res] = await Promise.all([
        trpc.door.probe.mutate(guest),
        wait(650),
      ]);
      setPhase(res.admit ? 'admit' : 'reject');
      play(res.admit ? 'admit' : 'reject');
      setQuip(
        pickQuip(
          res.admit ? ADMIT_QUIPS : REJECT_QUIPS,
          sent + guestKey(guest).length
        )
      );
      setExtra((prev) => [...prev, { guest, admit: res.admit }]);
      setLatest(key);
      await wait(950);
      setQuip(null);
      setCycle((c) => c + 1);
    } catch {
      setNote("Couldn't reach the door. Try again.");
    }
    setPhase('idle');
  };

  const startExam = async () => {
    if (phase !== 'idle') return;
    try {
      const view = await trpc.door.examStart.mutate();
      setExam(view);
      setNote(null);
      setCycle((c) => c + 1);
    } catch {
      setNote("Couldn't open the exam. Try again.");
    }
  };

  const answer = async (call: boolean) => {
    if (!exam || phase !== 'idle') return;
    setPhase('arriving');
    try {
      const [res] = await Promise.all([
        trpc.door.examAnswer.mutate({ call }),
        wait(650),
      ]);
      const truth = res.correct ? call : !call;
      setPhase(truth ? 'admit' : 'reject');
      setVerdict({ correct: res.correct });
      play(res.correct ? 'right' : 'wrong');
      setQuip(
        pickQuip(res.correct ? RIGHT_QUIPS : WRONG_QUIPS, exam.calls.length)
      );
      await wait(1100);
      setVerdict(null);
      setQuip(null);
      setExam((prev) =>
        prev
          ? { ...prev, calls: [...prev.calls, { call, correct: res.correct }] }
          : prev
      );
      if (res.result) {
        setFresh(true);
        setResult(res.result);
        play(
          res.result.status !== 'passed'
            ? 'fail'
            : res.result.misses === 0
              ? 'perfect'
              : 'pass'
        );
      } else setCycle((c) => c + 1);
    } catch {
      setNote("Couldn't reach the door. Try again.");
    }
    setPhase('idle');
  };

  if (result && door) {
    return (
      <ResultView
        result={result}
        doorNumber={door.number}
        subreddit={door.subreddit}
        fresh={fresh}
      />
    );
  }

  const examGuest = exam ? (exam.guests[exam.calls.length] ?? null) : null;

  if (failed) {
    return (
      <main className="mx-auto flex h-full max-w-[460px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-cream">The door is stuck. Check your connection.</p>
        <button
          type="button"
          className="bg-gold h-11 cursor-pointer rounded-full px-6 font-medium text-[#2a0a12]"
          onClick={() => {
            setFailed(false);
            setAttempt((n) => n + 1);
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-full max-w-[460px] flex-col gap-2 overflow-y-auto p-3">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-gold-soft text-xl leading-none">
              {door ? `Door #${door.number}` : 'Velvet Rope'}
            </h1>
            {door ? (
              <span
                className={cn(
                  'rounded-full border px-2 py-px text-[11px] font-medium capitalize',
                  BADGE[door.difficulty]
                )}
              >
                {door.difficulty}
              </span>
            ) : null}
          </div>
          <div className="text-muted mt-1 truncate text-[12px]">
            {door?.dateLabel ?? 'Opening the door'}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {exam ? null : (
            <div className="text-muted text-right text-[12px] leading-tight">
              <span className="text-cream text-lg">{sent}</span> sent
            </div>
          )}
          <button
            type="button"
            aria-label="Sound"
            aria-pressed={sound}
            title={sound ? 'Sound on' : 'Sound off'}
            onClick={() => {
              const next = !sound;
              setSound(next);
              setSoundOn(next);
              if (next) play('admit');
            }}
            className="border-gold/60 text-gold-soft hover:bg-stage flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
              {sound ? (
                <path
                  d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M16 9l5 6M21 9l-5 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
          <button
            type="button"
            aria-label="How to play"
            onClick={() => setHelp(true)}
            className="border-gold/60 font-display text-gold-soft hover:bg-stage flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border text-base transition-colors"
          >
            ?
          </button>
        </div>
      </header>

      <div className="relative mx-auto w-full shrink-0">
        <DoorScene
          phase={phase}
          guest={exam ? examGuest : guest}
          cycle={cycle}
          framed
          className="mx-auto max-h-[25vh] w-full"
        />
        <div
          aria-live="polite"
          className="pointer-events-none absolute top-1 right-1"
        >
          {quip ? (
            <p className="quip text-cream border-gold/50 bg-card/90 rounded-xl rounded-br-sm border px-2.5 py-1 text-[13px] shadow-lg">
              {quip}
            </p>
          ) : null}
        </div>
      </div>
      {exam ? null : <HintBar sent={sent} />}

      {exam ? (
        <ExamPanel
          total={exam.guests.length}
          calls={exam.calls}
          verdict={verdict}
          busy={phase !== 'idle'}
          onAnswer={(c) => void answer(c)}
        />
      ) : (
        <>
          <GuestBuilder guest={guest} onChange={setGuest} />

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setGuest(randomGuest())}
              aria-label="Random guest"
              title="Random guest"
              className="border-gold/60 text-gold-soft hover:bg-stage flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.6" fill="currentColor" />
                <circle cx="15.5" cy="8.5" r="1.6" fill="currentColor" />
                <circle cx="8.5" cy="15.5" r="1.6" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => void send()}
              aria-disabled={phase !== 'idle' || !door}
              className={cn(
                'h-10 flex-1 cursor-pointer rounded-full bg-[linear-gradient(180deg,#ecd27a,#c19a2c)] font-medium text-[#2a0a12] transition-[filter] hover:brightness-110',
                (phase !== 'idle' || !door) && 'opacity-60'
              )}
            >
              Send guest
            </button>
            {sent >= MIN_PROBES ? (
              <button
                type="button"
                onClick={() => void startExam()}
                className="border-gold text-gold-soft hover:bg-stage h-10 shrink-0 cursor-pointer rounded-full border-2 px-3 text-[13px] font-medium transition-colors"
              >
                Take the exam
              </button>
            ) : null}
          </div>
        </>
      )}
      {door ? null : (
        <p
          className="text-muted shrink-0 text-center text-[13px]"
          role="status"
        >
          Opening the door\u2026
        </p>
      )}
      {note ? (
        <p className="text-bad shrink-0 text-[12px]" role="status">
          {note}
        </p>
      ) : null}

      <ProbeColumns items={history} latestKey={latest} />

      {help ? <HelpModal onClose={() => setHelp(false)} /> : null}
    </main>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
