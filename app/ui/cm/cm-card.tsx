'use client';

import { useStore } from '@/app/lib/store';
import { CMLEEG, CMVELDEN } from '@/app/lib/seed-data';
import { hasAttention } from '@/app/lib/cm-parser';
import type { City, CityManagerRecord } from '@/app/lib/types';

export function CmCard({ city }: { city: City }) {
  const { get, set } = useStore();
  const key = `cm_${city.id}`;
  const record = get<CityManagerRecord>(key, CMLEEG);
  const attention = hasAttention(record.issues) || hasAttention(record.lost);

  function update(field: keyof CityManagerRecord, value: string) {
    set(key, { ...record, [field]: value });
  }

  return (
    <div
      className={`mb-3.5 rounded-m border border-l-4 border-line bg-surface p-6 shadow-s95 ${
        attention ? 'border-l-accent' : 'border-l-blue'
      }`}
    >
      <div className="mb-3.5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[20px] leading-tight text-navy">
            {city.naam}
          </h2>
        </div>
        {record.upd && (
          <span className="text-[11px] text-muted">Laatst bijgewerkt: {record.upd}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-[700px]:grid-cols-1">
        {CMVELDEN.map((v) => (
          <div key={v.k}>
            <div className="mb-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">
              {v.label}
            </div>
            <textarea
              value={(record[v.k as keyof CityManagerRecord] as string) ?? ''}
              onChange={(e) => update(v.k as keyof CityManagerRecord, e.target.value)}
              rows={2}
              aria-label={`${v.label} — ${city.naam}`}
              className="w-full rounded-s border border-line bg-surface2 px-2.5 py-2 text-[13px] focus:border-blue focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            />
          </div>
        ))}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5 max-[700px]:grid-cols-1">
        <div>
          <div className="mb-0.5 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
            Issues
            {hasAttention(record.issues) && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[9.5px] font-bold uppercase text-white">
                let op
              </span>
            )}
          </div>
          <textarea
            value={record.issues ?? ''}
            onChange={(e) => update('issues', e.target.value)}
            rows={2}
            aria-label={`Issues — ${city.naam}`}
            className="w-full rounded-s border border-line bg-surface2 px-2.5 py-2 text-[13px] focus:border-blue focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          />
        </div>
        <div>
          <div className="mb-0.5 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
            Lost
            {hasAttention(record.lost) && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[9.5px] font-bold uppercase text-white">
                let op
              </span>
            )}
          </div>
          <textarea
            value={record.lost ?? ''}
            onChange={(e) => update('lost', e.target.value)}
            rows={2}
            aria-label={`Lost — ${city.naam}`}
            className="w-full rounded-s border border-line bg-surface2 px-2.5 py-2 text-[13px] focus:border-blue focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          />
        </div>
      </div>
    </div>
  );
}
