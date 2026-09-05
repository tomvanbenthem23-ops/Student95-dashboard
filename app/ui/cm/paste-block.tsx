'use client';

import { useState } from 'react';
import { useStore } from '@/app/lib/store';
import { CMLEEG, CMNAMEN, CMVELDEN, CITIES } from '@/app/lib/seed-data';
import { parseCMUpdate, resolveCityManager } from '@/app/lib/cm-parser';
import type { CityManagerRecord } from '@/app/lib/types';

const FIELD_LABELS: Record<string, string> = Object.fromEntries(
  CMVELDEN.map((v) => [v.k, v.label]),
);

const PLACEHOLDER = `*Naam*
Afgelopen week geclosed: ...
Aankomende week geclosed: ...
Aankomende maand geclosed: ...
Projecten: ...
- issues: -
- lost: -`;

export function PasteBlock() {
  const { get, set } = useStore();
  const [text, setText] = useState('');
  const [manualCid, setManualCid] = useState('');
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  function verwerk() {
    const parsed = parseCMUpdate(text);
    const cid = manualCid || (parsed.naam ? resolveCityManager(parsed.naam, CMNAMEN) : null);

    if (!cid) {
      setMessage({
        error: true,
        text: parsed.naam
          ? `Kon de naam "${parsed.naam}" niet koppelen aan een city manager. Kies er eentje in de keuzelijst.`
          : 'Geen naam gevonden (verwacht *Naam* bovenaan). Kies een city manager in de keuzelijst.',
      });
      return;
    }

    const fieldEntries = Object.entries(parsed.fields);
    if (fieldEntries.length === 0) {
      setMessage({ error: true, text: 'Geen herkenbare velden gevonden in de tekst.' });
      return;
    }

    const cmName = CMNAMEN[cid] ?? cid;
    const preview = fieldEntries
      .map(([k, v]) => `${FIELD_LABELS[k] ?? k}: ${v || '(leeg)'}`)
      .join('\n');
    if (!confirm(`Update verwerken voor ${cmName}?\n\n${preview}`)) return;

    const key = `cm_${cid}`;
    const current = get<CityManagerRecord>(key, CMLEEG);
    const next: CityManagerRecord = {
      ...current,
      ...parsed.fields,
      upd: new Date().toLocaleDateString('nl-NL'),
    };
    set(key, next);
    setText('');
    setManualCid('');
    setMessage({ text: `Bijgewerkt: ${cmName} (${fieldEntries.length} veld(en)).` });
  }

  return (
    <div className="mb-6 rounded-m border border-line bg-surface p-6 shadow-s95">
      <h3 className="mb-3 text-[16px] text-ink">Wekelijkse update verwerken</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={6}
        className="w-full rounded-m border border-line2 bg-surface2 px-3.5 py-3 text-[13px] leading-relaxed focus:border-blue focus:bg-surface focus:outline-none"
      />
      <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
        <select
          value={manualCid}
          onChange={(e) => setManualCid(e.target.value)}
          className="rounded-full border border-line2 bg-surface px-3.5 py-2 text-[12.5px] font-medium"
        >
          <option value="">City manager automatisch herkennen</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {CMNAMEN[c.id] ?? c.naam} ({c.naam})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={verwerk}
          className="rounded-full bg-navy px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-navy-2"
        >
          Update verwerken
        </button>
        {message && (
          <span
            className={`text-[12.5px] font-medium ${message.error ? 'text-accent-dark' : 'text-navy'}`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
