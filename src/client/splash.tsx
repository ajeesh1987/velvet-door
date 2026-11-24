import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/trpc';
import { DoorScene } from './art/scene';
import { trpc } from './trpc';
import { cn } from './utils';

type Door = inferRouterOutputs<AppRouter>['door']['today'];

const BADGE = {
  easy: 'border-good text-good',
  medium: 'border-gold text-gold',
  hard: 'border-bad text-bad',
} as const;

export const Splash = () => {
  const [door, setDoor] = useState<Door | null>(null);

  useEffect(() => {
    let live = true;
    trpc.door.today
      .query()
      .then((d) => {
        if (live) setDoor(d);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  const played = door ? door.probes.length : 0;

  return (
    <div className="box-border h-screen min-h-[260px] bg-card p-1.5">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border-[1.5px] border-gold bg-card">
        <div className="flex items-start justify-between gap-2 px-3 pt-2.5">
          <span
            className={cn(
              'rounded-full border px-2 py-px text-[12px] font-medium capitalize',
              door ? BADGE[door.difficulty] : 'border-transparent text-transparent'
            )}
          >
            {door?.difficulty ?? 'easy'}
          </span>
          <h1 className="font-display text-xl leading-none text-gold-soft">
            Velvet Rope
          </h1>
          <span className="min-w-[44px] text-right text-[12px] text-muted">
            {door ? `Door #${door.number}` : ''}
          </span>
        </div>
        <div className="min-h-0 flex-1 px-3 py-1">
          <DoorScene
            phase="idle"
            guest={null}
            cycle={0}
            className="mx-auto h-full w-full"
          />
        </div>
        <div className="flex flex-col items-center gap-1 px-3 pb-3">
          <button
            type="button"
            className="h-11 w-full max-w-[260px] cursor-pointer rounded-full bg-gold font-medium text-[#2a0a12] transition-colors hover:bg-gold-soft"
            onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
          >
            {played > 0 ? 'Back to the door' : 'Open the door'}
          </button>
          <p className="text-[12px] text-muted">
            {door
              ? played > 0
                ? `${door.dateLabel} · ${played} guests sent`
                : `${door.dateLabel} · crack the secret rule`
              : 'Crack the secret rule'}
          </p>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
