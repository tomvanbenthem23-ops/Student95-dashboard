'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/app/lib/store';
import { allEventsFlat, type FlatEvent } from '@/app/lib/events';
import { eventDay, eventMonth, isDue, MONTH_LABELS, monthKey } from '@/app/lib/date';
import { CITIES, EVENT_TITLES } from '@/app/lib/seed-data';

function cityLabel(cid: string) {
  return EVENT_TITLES[cid] ?? CITIES.find((c) => c.id === cid)?.naam ?? cid;
}

export function MonthCalendar() {
  const { get } = useStore();
  const now = new Date();
  const [cur, setCur] = useState({ y: now.getFullYear(), m: now.getMonth() });

  const flat = allEventsFlat(get);

  const withMonth = useMemo(
    () =>
      flat.map((f) => ({
        ...f,
        my: eventMonth(f.e.d),
        day: eventDay(f.e.d),
      })),
    [flat],
  );

  const withoutMonth = withMonth.filter((f) => !f.my);

  const counts = new Map<string, number>();
  for (const f of withMonth) {
    if (!f.my) continue;
    const k = monthKey(f.my.y, f.my.m);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const monthOptions = Array.from(counts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { numeric: true }),
  );

  const rows = withMonth
    .filter((f) => f.my && f.my.y === cur.y && f.my.m === cur.m)
    .sort((a, b) => (a.day ?? 99) - (b.day ?? 99));

  function shift(delta: number) {
    const d = new Date(cur.y, cur.m + delta, 1);
    setCur({ y: d.getFullYear(), m: d.getMonth() });
  }

  const isNow = cur.y === now.getFullYear() && cur.m === now.getMonth();
  const curKey = monthKey(cur.y, cur.m);

  return (
    <div className="mb-6 rounded-m border border-line bg-surface p-6 shadow-s95">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-line2 text-navy hover:border-blue hover:bg-[#f2f5fe] hover:text-blue"
        >
          ‹
        </button>
        <h3 className="mx-1 font-display text-[21px] text-navy">
          {MONTH_LABELS[cur.m]} {cur.y}
        </h3>
        <button
          type="button"
          onClick={() => shift(1)}
          className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-line2 text-navy hover:border-blue hover:bg-[#f2f5fe] hover:text-blue"
        >
          ›
        </button>
        {!isNow && (
          <button
            type="button"
            onClick={() => setCur({ y: now.getFullYear(), m: now.getMonth() })}
            className="rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            Vandaag
          </button>
        )}
        <select
          value={curKey}
          onChange={(e) => {
            const [y, m] = e.target.value.split('-').map(Number);
            setCur({ y, m: m - 1 });
          }}
          className="rounded-full border border-line2 bg-surface px-3 py-1.5 text-[12.5px] font-medium"
        >
          {!counts.has(curKey) && <option value={curKey}>{MONTH_LABELS[cur.m]} {cur.y}</option>}
          {monthOptions.map(([k, n]) => {
            const [y, m] = k.split('-').map(Number);
            return (
              <option key={k} value={k}>
                {MONTH_LABELS[m - 1]} {y} ({n})
              </option>
            );
          })}
        </select>
        <span className="ml-auto text-[12px] text-muted max-[980px]:ml-0 max-[980px]:w-full">
          <b className="text-navy">{rows.length}</b> event(s) deze maand
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-[13.5px] text-muted">Geen events in deze maand.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wide text-muted">
                <th className="border-b border-line2 py-1.5 pl-2.5 pr-2.5">Datum</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Evenement</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Type</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Vereniging</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Contactpersoon</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Eerste contactmoment</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">CM update</th>
                <th className="border-b border-line2 py-1.5 pr-2.5">Stad</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <EventRow key={`${r.cid}-${r.i}`} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {withoutMonth.length > 0 && (
        <div className="mt-5 border-t border-line2 pt-3.5">
          <h4 className="mb-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
            Zonder maand
          </h4>
          <table className="w-full border-collapse text-[13px]">
            <tbody>
              {withoutMonth.map((r) => (
                <EventRow key={`${r.cid}-${r.i}`} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EventRow({ row }: { row: FlatEvent & { day: number | null } }) {
  const { e, cid } = row;
  const due = isDue(e);
  return (
    <tr className={due ? 'bg-navy-lightest' : undefined}>
      <td
        className={`border-b border-line py-2 pl-2.5 pr-2.5 align-top ${due ? 'shadow-[inset_3px_0_0_var(--navy)]' : ''}`}
      >
        {e.d}
      </td>
      <td className="border-b border-line py-2 pr-2.5 align-top">
        {e.ev}
        {due && (
          <span className="ml-1.5 inline-block rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            actie
          </span>
        )}
      </td>
      <td className="border-b border-line py-2 pr-2.5 align-top text-muted">{e.type}</td>
      <td className="border-b border-line py-2 pr-2.5 align-top">{e.ver}</td>
      <td className="border-b border-line py-2 pr-2.5 align-top">{e.cp}</td>
      <td className="border-b border-line py-2 pr-2.5 align-top">{e.ecm}</td>
      <td className="border-b border-line py-2 pr-2.5 align-top">{e.cmu}</td>
      <td className="border-b border-line py-2 pr-2.5 align-top">
        {cid === 'overig' ? (
          <span className="text-[11px] font-bold uppercase text-muted">Landelijk</span>
        ) : (
          <Link
            href={`/stad/${cid}`}
            className="text-[11px] font-bold uppercase tracking-wide text-blue"
          >
            {cityLabel(cid)}
          </Link>
        )}
      </td>
    </tr>
  );
}
