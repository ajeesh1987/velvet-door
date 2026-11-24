import type { Probe } from '../../shared/door';
import { guestKey } from '../../shared/engine';
import { ATTRS } from '../../shared/types';
import { PartIcon } from '../art/parts';
import { cn } from '../utils';

export type HistoryItem = Probe & { starter: boolean };

const Pill = ({
  item,
  fresh,
}: {
  item: HistoryItem;
  fresh: boolean;
}) => (
  <li
    className={cn(
      'flex items-center justify-center gap-1 rounded-full border-2 bg-panel px-2 py-1',
      item.admit ? 'border-good' : 'border-bad',
      fresh && 'pill-new'
    )}
    style={{ ['--vr-glow' as string]: item.admit ? '#6bbf8f' : '#d9605a' }}
    aria-label={item.admit ? 'Let in' : 'Turned away'}
  >
    {ATTRS.map((attr) => (
      <PartIcon key={attr} attr={attr} id={item.guest[attr]} size={26} />
    ))}
  </li>
);

export const ProbeColumns = ({
  items,
  latestKey,
}: {
  items: HistoryItem[];
  latestKey: string | null;
}) => {
  const columns = [
    { title: 'Let in', tone: 'text-good', admit: true },
    { title: 'Turned away', tone: 'text-bad', admit: false },
  ];
  return (
    <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
      {columns.map((col) => {
        const rows = items.filter((i) => i.admit === col.admit);
        return (
          <section key={col.title} className="flex min-h-0 flex-col gap-1.5">
            <h2 className={cn('text-[12px] font-medium', col.tone)}>
              {col.title} ({rows.length})
            </h2>
            <ul className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
              {rows.map((item) => (
                <Pill
                  key={guestKey(item.guest)}
                  item={item}
                  fresh={guestKey(item.guest) === latestKey}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
