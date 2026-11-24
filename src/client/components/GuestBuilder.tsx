import { VALUES } from '../../shared/attributes';
import { ATTRS, type Attr, type Guest } from '../../shared/types';
import { PartIcon } from '../art/parts';
import { cn } from '../utils';

const ROW_LABEL: Record<Attr, string> = {
  headwear: 'Hat',
  top: 'Top',
  item: 'Item',
  footwear: 'Shoes',
};

export const GuestBuilder = ({
  guest,
  onChange,
}: {
  guest: Guest;
  onChange: (next: Guest) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    {ATTRS.map((attr) => {
      const chosen = VALUES[attr].find((v) => v.id === guest[attr]);
      return (
        <div key={attr} className="flex items-center gap-2">
          <div className="w-[68px] shrink-0 leading-tight">
            <div className="text-[11px] text-muted">{ROW_LABEL[attr]}</div>
            <div className="truncate text-[12px] text-cream">
              {chosen?.label ?? ''}
            </div>
          </div>
          <div
            role="radiogroup"
            aria-label={ROW_LABEL[attr]}
            className="grid flex-1 grid-cols-4 gap-1.5"
          >
            {VALUES[attr].map((v) => {
              const on = guest[attr] === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={v.label}
                  title={v.label}
                  onClick={() => onChange({ ...guest, [attr]: v.id })}
                  className={cn(
                    'flex h-11 cursor-pointer items-center justify-center rounded-lg border bg-panel transition-colors',
                    on
                      ? 'border-gold bg-stage ring-1 ring-gold'
                      : 'border-white/10 hover:border-gold/50'
                  )}
                >
                  <PartIcon attr={attr} id={v.id} size={34} />
                </button>
              );
            })}
          </div>
        </div>
      );
    })}
  </div>
);
