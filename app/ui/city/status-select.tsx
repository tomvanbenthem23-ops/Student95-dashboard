'use client';

import { STATUSES } from '@/app/lib/seed-data';
import { useStore } from '@/app/lib/store';
import { statusKey } from '@/app/lib/associations';

const STAGE_CLASS = [
  'border-line2 bg-surface',
  'border-blue-lightest bg-[#f7f9fe]',
  'border-blue-light bg-[#f2f5fe]',
  'border-blue bg-blue-lightest font-semibold',
  'border-blue-dark bg-blue-lightest font-semibold',
  'border-ink bg-ink text-white font-semibold',
];

export function StatusSelect({ cid, naam }: { cid: string; naam: string }) {
  const { get, set } = useStore();
  const idx = get<number>(statusKey(cid, naam), 0);

  return (
    <select
      value={idx}
      onChange={(e) => set(statusKey(cid, naam), Number(e.target.value))}
      aria-label={`Status voor ${naam}`}
      className={`w-full rounded-s border px-2.5 py-2 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue ${STAGE_CLASS[idx] ?? STAGE_CLASS[0]}`}
    >
      {STATUSES.map((s, i) => (
        <option key={i} value={i}>
          {s}
        </option>
      ))}
    </select>
  );
}
