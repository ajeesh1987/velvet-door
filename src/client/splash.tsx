import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/trpc';
import { DoorScene } from './art/scene';
import { DecoFrame } from './components/DecoFrame';
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
    <div className="bg-card relative box-border h-screen min-h-[270px] px-6 pt-4 pb-4">
      <DecoFrame />
      <div className="relative flex h-full flex-col">
        <div className="grid grid-cols-[76px_1fr_76px] items-start">
          <span
            className={cn(
              'w-fit rounded-full border px-2.5 py-px text-[12px] font-medium capitalize shadow-[0_0_8px_currentColor]',
              door
                ? BADGE[door.difficulty]
                : 'border-transparent text-transparent'
            )}
          >
            {door?.difficulty ?? 'easy'}
          </span>
          <div className="text-center">
            <h1 className="font-display bg-[linear-gradient(180deg,#f8e8ad,#d4af37_55%,#9a7420)] bg-clip-text text-[28px] leading-none font-semibold text-transparent">
              Velvet Rope
            </h1>
            <p className="text-muted mt-1 text-[12px]">
              {door
                ? `Door #${door.number} · ${door.dateLabel.split(',')[0]}`
                : ' '}
            </p>
          </div>
          <span className="text-gold-soft text-right text-[12px] leading-tight">
            {door && door.streak.count > 0
              ? `${door.streak.count}-day streak`
              : ''}
          </span>
        </div>
        <div className="min-h-0 flex-1 py-1">
          <DoorScene
            phase="idle"
            guest={null}
            cycle={0}
            framed={false}
            className="mx-auto h-full w-full overflow-visible"
          />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            className="ring-gold/60 ring-offset-card h-11 w-full max-w-[260px] cursor-pointer rounded-full bg-[linear-gradient(180deg,#ecd27a,#c19a2c)] font-medium text-[#2a0a12] ring-1 ring-offset-2 transition-[filter] hover:brightness-110"
            onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
          >
            {door?.result
              ? 'See your result'
              : played > 0
                ? 'Back to the door'
                : 'Open the door'}
          </button>
          <p className="text-muted text-[12px]">
            {door?.result
              ? door.result.status === 'passed'
                ? 'Door cracked today'
                : 'Come back tomorrow'
              : played > 0
                ? `${played} guests sent today`
                : "Crack the bouncer's secret rule"}
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
