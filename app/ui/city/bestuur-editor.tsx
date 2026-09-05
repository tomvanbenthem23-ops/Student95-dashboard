'use client';

import { useStore } from '@/app/lib/store';
import { bestuurKey } from '@/app/lib/associations';
import type { BestuurLid } from '@/app/lib/types';

const EMPTY: BestuurLid = { naam: '', functie: '', tel: '', mail: '' };

export function BestuurEditor({ cid, naam }: { cid: string; naam: string }) {
  const { get, set, editMode } = useStore();
  const key = bestuurKey(cid, naam);
  const leden = get<BestuurLid[]>(key, []);

  if (!editMode && leden.length === 0) return null;

  function update(i: number, field: keyof BestuurLid, value: string) {
    const next = leden.slice();
    next[i] = { ...next[i], [field]: value };
    set(key, next);
  }
  function remove(i: number) {
    set(
      key,
      leden.filter((_, idx) => idx !== i),
    );
  }
  function add() {
    set(key, [...leden, EMPTY]);
  }

  return (
    <div className="mt-4 border-t border-line pt-3.5">
      <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
        Bestuur
      </h4>
      {leden.map((lid, i) => (
        <div
          key={i}
          className="mb-1.5 grid grid-cols-[1.2fr_1fr_1fr_1.4fr_28px] gap-1.5 max-[920px]:grid-cols-2"
        >
          <input
            value={lid.naam}
            disabled={!editMode}
            onChange={(e) => update(i, 'naam', e.target.value)}
            placeholder="Naam"
            aria-label={`Naam bestuurslid ${i + 1}`}
            className="rounded-s border border-line bg-surface2 px-2.5 py-1.5 text-xs disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-blue"
          />
          <input
            value={lid.functie}
            disabled={!editMode}
            onChange={(e) => update(i, 'functie', e.target.value)}
            placeholder="Functie"
            aria-label={`Functie bestuurslid ${i + 1}`}
            className="rounded-s border border-line bg-surface2 px-2.5 py-1.5 text-xs disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-blue"
          />
          <input
            value={lid.tel}
            disabled={!editMode}
            onChange={(e) => update(i, 'tel', e.target.value)}
            placeholder="Tel"
            aria-label={`Telefoon bestuurslid ${i + 1}`}
            className="rounded-s border border-line bg-surface2 px-2.5 py-1.5 text-xs disabled:opacity-70 focus-visible:ring-2 focus-visible:ring-blue"
          />
          <input
            value={lid.mail}
            disabled={!editMode}
            onChange={(e) => update(i, 'mail', e.target.value)}
            placeholder="Mail"
            aria-label={`E-mail bestuurslid ${i + 1}`}
            className="rounded-s border border-line bg-surface2 px-2.5 py-1.5 text-xs disabled:opacity-70 max-[920px]:col-span-2 focus-visible:ring-2 focus-visible:ring-blue"
          />
          {editMode && (
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Bestuurslid verwijderen"
              className="rounded-s border border-line text-accent hover:border-accent hover:bg-accent-lightest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {editMode && (
        <button
          type="button"
          onClick={add}
          className="mt-1 rounded-full border border-dashed border-line2 px-3 py-1 text-xs text-muted hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          + Bestuurslid toevoegen
        </button>
      )}
    </div>
  );
}
