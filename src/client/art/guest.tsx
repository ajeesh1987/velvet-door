import type { Guest } from '../../shared/types';
import { PartArt } from './parts';

const SKIN = '#e0b48a';
const LEG = '#4a3f42';

/** A guest drawn on a 120 by 200 grid. Feet land near y = 188. */
export const GuestFigure = ({ guest }: { guest: Guest }) => (
  <g>
    <rect x="44" y="120" width="12" height="40" rx="4" fill={LEG} />
    <rect x="64" y="120" width="12" height="40" rx="4" fill={LEG} />
    <g transform="translate(63 156) scale(-0.7 0.7)">
      <PartArt attr="footwear" id={guest.footwear} />
    </g>
    <g transform="translate(57 156) scale(0.7 0.7)">
      <PartArt attr="footwear" id={guest.footwear} />
    </g>
    <rect x="54" y="60" width="12" height="14" fill={SKIN} />
    <circle cx="24" cy="122" r="5" fill={SKIN} />
    <circle cx="96" cy="122" r="5" fill={SKIN} />
    <g transform="translate(30 62) scale(1.25)">
      <PartArt attr="top" id={guest.top} />
    </g>
    <circle cx="60" cy="48" r="17" fill={SKIN} />
    <circle cx="54" cy="53" r="1.8" fill="#2a1b17" />
    <circle cx="66" cy="53" r="1.8" fill="#2a1b17" />
    <path d="M55 60Q60 63 65 60" stroke="#2a1b17" strokeWidth="1.6" fill="none" />
    <g transform="translate(36 -3) scale(1)">
      <PartArt attr="headwear" id={guest.headwear} />
    </g>
    <g transform="translate(78 98) scale(0.85)">
      <PartArt attr="item" id={guest.item} />
    </g>
  </g>
);
