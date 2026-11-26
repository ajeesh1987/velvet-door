import type { Probe } from '../../shared/door';
import { guestKey } from '../../shared/engine';
import { ATTRS } from '../../shared/types';
import { PartIcon } from '../art/parts';
import { cn } from '../utils';

export type HistoryItem = Probe & { starter: boolean };

const Pill = ({ item, fresh }: { item: HistoryItem; fresh: boolean }) => (
  <li
    className={cn(
      'bg-panel flex items-center justify-center gap-1 rounded-full border-2 px-2 py-0.5',
      item.admit ? 'border-good' : 'border-bad',
      item.starter && 'border-dashed',
      fresh && 'pill-new'
    )}
    aria-label={`${item.starter ? 'Starter guest: ' : ''}${item.admit ? 'let in' : 'turned away'}`}
    title={item.starter ? 'Already on the list at the start' : undefined}
  >
    {item.starter ? (
      <span
        className="text-gold-soft text-[11px] leading-none"
        aria-hidden="true"
      >
        ★
      </span>
    ) : null}
    {ATTRS.map((attr) => (
      <PartIcon key={attr} attr={attr} id={item.guest[attr]} size={24} />
    ))}
  </li>
);

/** Two columns, newest guest on top, so the latest result is always in view. */
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
    <div className="grid min-h-[100px] flex-1 grid-cols-2 gap-2">
      {columns.map((col) => {
        const rows = items.filter((i) => i.admit === col.admit).reverse();
        return (
          <section key={col.title} className="flex min-h-0 flex-col gap-1">
            <h2 className={cn('text-[12px] font-medium', col.tone)}>
              {col.title} ({rows.filter((r) => !r.starter).length})
            </h2>
            <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
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
