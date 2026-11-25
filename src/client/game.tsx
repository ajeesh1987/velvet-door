import './index.css';

import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/trpc';
import type { Probe } from '../shared/door';
import { ALL_GUESTS, guestKey } from '../shared/engine';
import type { Guest } from '../shared/types';
import { DoorScene, type Phase } from './art/scene';
import { GuestBuilder } from './components/GuestBuilder';
import { HelpModal } from './components/HelpModal';
import { ProbeColumns, type HistoryItem } from './components/ProbeColumns';
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

  useEffect(() => {
    let live = true;
    trpc.door.today
      .query()
      .then((d) => {
        if (!live) return;
        setDoor(d);
        if (d.probes.length === 0) setHelp(true);
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
      const [res] = await Promise.all([trpc.door.probe.mutate(guest), wait(650)]);
      setPhase(res.admit ? 'admit' : 'reject');
      setExtra((prev) => [...prev, { guest, admit: res.admit }]);
      setLatest(key);
      await wait(950);
      setCycle((c) => c + 1);
    } catch {
      setNote("Couldn't reach the door. Try again.");
    }
    setPhase('idle');
  };

  if (failed) {
    return (
      <main className="mx-auto flex h-full max-w-[460px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-cream">The door is stuck. Check your connection.</p>
        <button
          type="button"
          className="h-11 cursor-pointer rounded-full bg-gold px-6 font-medium text-[#2a0a12]"
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
            <h1 className="font-display text-xl leading-none text-gold-soft">
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
          <div className="mt-1 truncate text-[12px] text-muted">
            {door?.dateLabel ?? 'Opening the door'}
          </div>
        </div>
        <button
          type="button"
          aria-label="How to play"
          onClick={() => setHelp(true)}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/60 font-display text-base text-gold-soft transition-colors hover:bg-stage"
        >
          ?
        </button>
      </header>

      <DoorScene
        phase={phase}
        guest={guest}
        cycle={cycle}
        framed
        className="mx-auto max-h-[28vh] w-full shrink-0"
      />

      <GuestBuilder guest={guest} onChange={setGuest} />

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setGuest(randomGuest())}
          aria-label="Random guest"
          title="Random guest"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold/60 text-gold-soft transition-colors hover:bg-stage"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
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
        <div className="w-14 shrink-0 text-right text-[12px] leading-tight text-muted">
          <span className="text-lg text-cream">{sent}</span> sent
        </div>
      </div>
      {note ? (
        <p className="shrink-0 text-[12px] text-bad" role="status">
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
