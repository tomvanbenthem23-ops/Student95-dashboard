'use client';

import { useStore } from '@/app/lib/store';
import { verKey } from '@/app/lib/associations';
import type { Vereniging } from '@/app/lib/types';

const FIELDS: { key: keyof Vereniging; label: string }[] = [
  { key: 'naam', label: 'Naam' },
  { key: 'type', label: 'Type' },
  { key: 'leden', label: 'Leden' },
  { key: 'web', label: 'Website' },
  { key: 'email', label: 'E-mail' },
  { key: 'tel', label: 'Telefoon' },
  { key: 'adres', label: 'Adres' },
  { key: 'note', label: 'Toelichting' },
];

export function VerEdit({
  cid,
  origNaam,
  merged,
}: {
  cid: string;
  origNaam: string;
  merged: Vereniging;
}) {
  const { get, set, editMode } = useStore();
  if (!editMode) return null;
  const key = verKey(cid, origNaam);
  const override = get<Partial<Vereniging>>(key, {});

  function updateField(field: keyof Vereniging, value: string) {
    set(key, { ...override, [field]: value });
  }

  return (
    <div className="edonly mt-4 border-t border-line pt-3.5">
      <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
        Gegevens aanpassen
      </h4>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-muted">
              {f.label}
            </span>
            <input
              value={(merged[f.key] as string) ?? ''}
              onChange={(e) => updateField(f.key, e.target.value)}
              className="rounded-s border border-line bg-surface2 px-2.5 py-1.5 text-xs focus:border-blue focus:bg-surface focus:outline-none"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
