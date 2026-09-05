'use client';

import { useStore } from '@/app/lib/store';
import { getEventsForCity } from '@/app/lib/events';
import { isDue } from '@/app/lib/date';
import type { EventItem } from '@/app/lib/types';

const EMPTY: EventItem = { d: '', ev: '', type: '', cp: '', ver: '', ecm: '', ecmIso: null, cmu: '' };

function EventInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className="w-full resize-none rounded-s border border-transparent bg-transparent px-1.5 py-1 text-[13px] leading-snug hover:border-line focus:border-ink focus:bg-surface2 focus:outline-none"
      onInput={(e) => {
        const el = e.currentTarget;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      }}
    />
  );
}

export function EventTable({ cid }: { cid: string }) {
  const { get, set } = useStore();
  const key = `events_${cid}`;
  const events = getEventsForCity(cid, get);

  function update(i: number, field: keyof EventItem, value: string) {
    const next = events.slice();
    next[i] = { ...next[i], [field]: value };
    set(key, next);
  }
  function remove(i: number) {
    if (!confirm('Dit event verwijderen?')) return;
    set(
      key,
      events.filter((_, idx) => idx !== i),
    );
  }
  function add() {
    set(key, [...events, EMPTY]);
  }

  return (
    <div className="my-[22px] rounded-m border border-line bg-surface p-6 shadow-s95">
      <h3 className="mb-3.5 text-[16px] text-ink">Eventkalender</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-[13px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wide text-muted">
              <th className="border-b border-line2 py-1.5 pl-1.5 pr-2">Datum</th>
              <th className="border-b border-line2 py-1.5 pr-2">Evenement</th>
              <th className="border-b border-line2 py-1.5 pr-2">Type</th>
              <th className="border-b border-line2 py-1.5 pr-2">Vereniging</th>
              <th className="border-b border-line2 py-1.5 pr-2">Contactpersoon</th>
              <th className="border-b border-line2 py-1.5 pr-2">Eerste contactmoment</th>
              <th className="border-b border-line2 py-1.5 pr-2">CM update</th>
              <th className="border-b border-line2 py-1.5 pr-2" />
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => {
              const due = isDue(e);
              return (
                <tr key={i} className={due ? 'bg-navy-lightest' : undefined}>
                  <td className={`border-b border-line py-1 pl-1.5 align-top ${due ? 'shadow-[inset_3px_0_0_var(--navy)]' : ''}`}>
                    <EventInput value={e.d} onChange={(v) => update(i, 'd', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.ev} onChange={(v) => update(i, 'ev', v)} />
                    {due && (
                      <span className="ml-1 inline-block rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        actie
                      </span>
                    )}
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.type} onChange={(v) => update(i, 'type', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.ver} onChange={(v) => update(i, 'ver', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.cp} onChange={(v) => update(i, 'cp', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.ecm} onChange={(v) => update(i, 'ecm', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <EventInput value={e.cmu} onChange={(v) => update(i, 'cmu', v)} />
                  </td>
                  <td className="border-b border-line py-1 align-top">
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      aria-label="Event verwijderen"
                      className="rounded-s px-1.5 text-[15px] text-faint hover:bg-accent-lightest hover:text-accent"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-full border border-dashed border-line2 px-3 py-1 text-xs text-muted hover:border-ink hover:text-ink"
      >
        + Event toevoegen
      </button>
    </div>
  );
}
