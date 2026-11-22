import type { Attr, Shape, Temp } from './types';

export interface ValueDef {
  id: string;
  label: string;
  temp: Temp;
  shape: Shape;
}

const v = (
  id: string,
  label: string,
  temp: Temp,
  shape: Shape,
): ValueDef => ({ id, label, temp, shape });

export const VALUES: Record<Attr, ValueDef[]> = {
  headwear: [
    v('beret', 'Red beret', 'warm', 'round'),
    v('partyhat', 'Party hat', 'warm', 'pointy'),
    v('beanie', 'Blue beanie', 'cool', 'round'),
    v('wizard', 'Wizard hat', 'cool', 'pointy'),
  ],
  top: [
    v('puffer', 'Orange puffer', 'warm', 'round'),
    v('blazer', 'Red blazer', 'warm', 'pointy'),
    v('sweater', 'Blue sweater', 'cool', 'round'),
    v('poncho', 'Teal poncho', 'cool', 'pointy'),
  ],
  item: [
    v('lantern', 'Lantern', 'warm', 'round'),
    v('torch', 'Torch', 'warm', 'pointy'),
    v('snowglobe', 'Snow globe', 'cool', 'round'),
    v('kite', 'Kite', 'cool', 'pointy'),
  ],
  footwear: [
    v('rainboots', 'Rain boots', 'warm', 'round'),
    v('heels', 'Heels', 'warm', 'pointy'),
    v('sneakers', 'Sneakers', 'cool', 'round'),
    v('elfshoes', 'Elf shoes', 'cool', 'pointy'),
  ],
};
