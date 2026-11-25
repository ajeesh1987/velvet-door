import { cn } from '../utils';

const Corner = ({ className }: { className: string }) => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    className={cn('absolute', className)}
    aria-hidden="true"
  >
    <path d="M1 25V1H25" fill="none" stroke="#d4af37" strokeWidth="1.5" />
    <path d="M7 25V7H25" fill="none" stroke="#d4af37" strokeOpacity="0.8" strokeWidth="1" />
    <rect x="1" y="1" width="6" height="6" fill="#d4af37" />
  </svg>
);

/** A double gold line with stepped corners. Keeps clear of the feed's edge. */
export const DecoFrame = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <div className="absolute inset-[5px] border-[1.5px] border-gold" />
    <div className="absolute inset-[11px] border border-gold/70" />
    <div className="absolute inset-[15px] border border-gold/25" />
    <Corner className="left-[5px] top-[5px]" />
    <Corner className="right-[5px] top-[5px] rotate-90" />
    <Corner className="bottom-[5px] right-[5px] rotate-180" />
    <Corner className="bottom-[5px] left-[5px] -rotate-90" />
  </div>
);
