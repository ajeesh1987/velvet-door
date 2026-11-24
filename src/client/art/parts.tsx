import type { ReactNode } from 'react';
import type { Attr } from '../../shared/types';

const C = {
  red: '#d4452f',
  redD: '#8f2a1f',
  orange: '#e8913a',
  orangeD: '#b8661f',
  yellow: '#f2c14e',
  gold: '#d4af37',
  goldL: '#fbe7a1',
  blue: '#3b7fc4',
  blueD: '#2a5f9a',
  blueL: '#9cc4ef',
  teal: '#2aa39a',
  tealD: '#1f6f69',
  indigo: '#5b52c4',
  indigoD: '#3d3694',
  brown: '#8b5a2b',
  brownD: '#5e3b1a',
  cream: '#efe3cf',
  ice: '#cfe8f8',
  white: '#ffffff',
};

/** Every part is drawn on a 48 by 48 grid. */
const ART: Record<Attr, Record<string, ReactNode>> = {
  headwear: {
    beret: (
      <>
        <ellipse cx="24" cy="26" rx="19" ry="10" fill={C.red} />
        <rect x="22" y="14" width="4" height="6" rx="2" fill={C.red} />
        <rect x="7" y="31" width="34" height="6" rx="3" fill={C.redD} />
      </>
    ),
    partyhat: (
      <>
        <polygon points="24,5 9,41 39,41" fill={C.orange} />
        <path d="M16 27H32M12 35H36" stroke={C.yellow} strokeWidth="3" />
        <circle cx="24" cy="5" r="4" fill={C.yellow} />
      </>
    ),
    beanie: (
      <>
        <path d="M8 38Q8 12 24 12Q40 12 40 38Z" fill={C.blue} />
        <rect x="6" y="33" width="36" height="9" rx="4" fill={C.blueD} />
        <circle cx="24" cy="10" r="5" fill={C.blueL} />
      </>
    ),
    wizard: (
      <>
        <polygon points="24,3 12,38 36,38" fill={C.indigo} />
        <ellipse cx="24" cy="40" rx="21" ry="5" fill={C.indigoD} />
        <circle cx="22" cy="25" r="3" fill={C.goldL} />
      </>
    ),
  },
  top: {
    puffer: (
      <>
        <ellipse cx="8" cy="24" rx="6" ry="11" fill={C.orange} />
        <ellipse cx="40" cy="24" rx="6" ry="11" fill={C.orange} />
        <rect x="10" y="8" width="28" height="36" rx="11" fill={C.orange} />
        <path d="M12 20H36M12 28H36M12 36H36" stroke={C.orangeD} strokeWidth="2" />
        <rect x="18" y="6" width="12" height="5" rx="2.5" fill={C.orangeD} />
      </>
    ),
    blazer: (
      <>
        <polygon points="10,10 3,40 11,41 15,16" fill={C.red} />
        <polygon points="38,10 45,40 37,41 33,16" fill={C.red} />
        <polygon points="12,8 36,8 38,44 10,44" fill={C.red} />
        <polygon points="19,8 29,8 24,27" fill={C.cream} />
        <polygon points="12,8 19,8 24,27 15,22" fill={C.redD} />
        <polygon points="36,8 29,8 24,27 33,22" fill={C.redD} />
        <circle cx="24" cy="34" r="1.8" fill={C.gold} />
        <circle cx="24" cy="40" r="1.8" fill={C.gold} />
      </>
    ),
    sweater: (
      <>
        <ellipse cx="8" cy="24" rx="6" ry="11" fill={C.blue} />
        <ellipse cx="40" cy="24" rx="6" ry="11" fill={C.blue} />
        <rect x="10" y="8" width="28" height="36" rx="10" fill={C.blue} />
        <rect x="10" y="38" width="28" height="6" rx="3" fill={C.blueD} />
        <rect x="17" y="6" width="14" height="6" rx="3" fill={C.blueD} />
        <path d="M16 22q4 4 8 0t8 0" stroke={C.blueL} strokeWidth="2" fill="none" />
      </>
    ),
    poncho: (
      <>
        <polygon points="24,6 45,38 33,34 24,45 15,34 3,38" fill={C.teal} />
        <polygon points="24,18 35,34 24,31 13,34" fill={C.tealD} />
        <ellipse cx="24" cy="9" rx="7" ry="3.5" fill={C.tealD} />
      </>
    ),
  },
  item: {
    lantern: (
      <>
        <path d="M17 15Q24 3 31 15" stroke={C.brown} strokeWidth="2.5" fill="none" />
        <rect x="16" y="14" width="16" height="5" rx="2" fill={C.brown} />
        <circle cx="24" cy="29" r="12" fill={C.yellow} />
        <circle cx="24" cy="29" r="6" fill={C.goldL} />
        <rect x="18" y="40" width="12" height="4" rx="2" fill={C.brown} />
      </>
    ),
    torch: (
      <>
        <rect x="21" y="24" width="6" height="20" rx="2" fill={C.brown} />
        <path d="M24 3Q35 15 31 25H17Q13 15 24 3Z" fill={C.orange} />
        <path d="M24 12Q30 19 28 25H20Q18 19 24 12Z" fill={C.yellow} />
        <rect x="19" y="23" width="10" height="4" rx="1" fill={C.brownD} />
      </>
    ),
    snowglobe: (
      <>
        <circle cx="24" cy="22" r="15" fill={C.ice} stroke={C.blue} strokeWidth="2" />
        <rect x="13" y="36" width="22" height="8" rx="3" fill={C.blueD} />
        <path d="M12 30Q24 24 36 30Q34 36 24 37Q14 36 12 30Z" fill={C.white} />
        <circle cx="19" cy="17" r="1.6" fill={C.white} />
        <circle cx="29" cy="21" r="1.6" fill={C.white} />
        <circle cx="25" cy="13" r="1.6" fill={C.white} />
      </>
    ),
    kite: (
      <>
        <polygon points="24,3 39,19 24,37 9,19" fill={C.indigo} />
        <path d="M24 3V37M9 19H39" stroke={C.blueL} strokeWidth="1.5" />
        <path d="M24 37Q16 40 22 43Q30 45 24 47" stroke={C.blueL} strokeWidth="2" fill="none" />
      </>
    ),
  },
  footwear: {
    rainboots: (
      <>
        <path d="M14 6H30V30Q30 34 37 35Q43 37 43 41V44H11V6Z" fill={C.yellow} />
        <rect x="11" y="6" width="19" height="6" rx="2" fill={C.orange} />
        <rect x="11" y="41" width="32" height="4" rx="2" fill={C.redD} />
      </>
    ),
    heels: (
      <>
        <path d="M45 38L23 30L21 14H10V34L26 40Z" fill={C.red} />
        <polygon points="13,34 10,34 11,45 14,45" fill={C.redD} />
      </>
    ),
    sneakers: (
      <>
        <path d="M6 36Q6 22 16 22L24 25Q40 27 43 36V40H6Z" fill={C.blue} />
        <path d="M34 28Q42 30 43 36H32Z" fill={C.blueD} />
        <rect x="5" y="39" width="39" height="5" rx="2.5" fill={C.cream} />
        <path d="M17 24L20 29M21 25L24 30" stroke={C.cream} strokeWidth="2" />
      </>
    ),
    elfshoes: (
      <>
        <path d="M6 40V24Q6 19 12 19H22Q32 19 37 28L44 14Q47 30 45 40Z" fill={C.indigo} />
        <path d="M6 36H45" stroke={C.indigoD} strokeWidth="3" />
        <circle cx="44" cy="13" r="3" fill={C.gold} />
      </>
    ),
  },
};

export const PartArt = ({ attr, id }: { attr: Attr; id: string }) => (
  <>{ART[attr][id] ?? null}</>
);

export const PartIcon = ({
  attr,
  id,
  size,
}: {
  attr: Attr;
  id: string;
  size: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    aria-hidden="true"
    className="shrink-0"
  >
    <PartArt attr={attr} id={id} />
  </svg>
);
