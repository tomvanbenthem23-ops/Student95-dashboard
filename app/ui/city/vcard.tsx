'use client';

import { useStore } from '@/app/lib/store';
import { mergedVereniging, noteKey } from '@/app/lib/associations';
import type { Vereniging } from '@/app/lib/types';
import { StatusSelect } from './status-select';
import { BestuurEditor } from './bestuur-editor';
import { VerEdit } from './ver-edit';

const BORDER_BY_TIER: Record<string, string> = {
  A: 'border-l-accent',
  B: 'border-l-blue',
  C: 'border-l-faint',
};

export function VCard({ cid, seed }: { cid: string; seed: Vereniging }) {
  const { get, set } = useStore();
  const merged = mergedVereniging(cid, seed, get);
  const nKey = noteKey(cid, seed.naam);
  const note = get<string>(nKey, '');

  const websiteHref = merged.web
    ? merged.web.startsWith('http')
      ? merged.web
      : `https://${merged.web}`
    : merged.zoek
      ? `https://www.google.com/search?q=${encodeURIComponent(merged.zoek)}`
      : null;

  return (
    <div
      className={`mb-3 rounded-m border border-l-4 border-line bg-surface p-5 shadow-s95 ${BORDER_BY_TIER[merged.pot] ?? ''}`}
    >
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)_200px] items-start gap-4 max-[920px]:grid-cols-1">
        <div>
          <h3 className="text-[16px] font-bold">{merged.naam}</h3>
          <div className="my-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-blue-lightest bg-[#f2f5fe] px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-blue">
              {merged.type}
            </span>
            {merged.stad && (
              <span className="rounded-full border border-[#fedad3] bg-accent-lightest px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-dark">
                {merged.stad}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted">
            {merged.leden} leden
            {merged.note ? ` — ${merged.note}` : ''}
          </p>
        </div>

        <div className="text-[13px]">
          {websiteHref && (
            <div className="mb-1">
              <span className="inline-block w-[60px] align-top text-[11px] uppercase tracking-wide text-muted">
                Site
              </span>
              <a href={websiteHref} target="_blank" rel="noreferrer">
                {merged.web ?? 'zoek op Google'}
              </a>
            </div>
          )}
          {merged.email && (
            <div className="mb-1">
              <span className="inline-block w-[60px] align-top text-[11px] uppercase tracking-wide text-muted">
                E-mail
              </span>
              <a href={`mailto:${merged.email}`}>{merged.email}</a>
            </div>
          )}
          {merged.tel && (
            <div className="mb-1">
              <span className="inline-block w-[60px] align-top text-[11px] uppercase tracking-wide text-muted">
                Tel
              </span>
              {merged.tel}
            </div>
          )}
          {merged.adres && (
            <div className="mb-1">
              <span className="inline-block w-[60px] align-top text-[11px] uppercase tracking-wide text-muted">
                Adres
              </span>
              {merged.adres}
              {merged.adresCheck && (
                <span className="ml-1.5 text-[11px] font-semibold text-accent">
                  verifieer
                </span>
              )}
              <br />
              <a
                className="text-[11px]"
                href={`https://maps.google.com/?q=${encodeURIComponent(merged.adres)}`}
                target="_blank"
                rel="noreferrer"
              >
                open in Google Maps
              </a>
            </div>
          )}
        </div>

        <div>
          <StatusSelect cid={cid} naam={seed.naam} />
          <textarea
            value={note}
            onChange={(e) => set(nKey, e.target.value)}
            placeholder="Notitie…"
            aria-label={`Notitie voor ${merged.naam}`}
            rows={2}
            className="mt-2 w-full rounded-s border border-line bg-surface2 px-2.5 py-2 text-xs focus:border-ink focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          />
        </div>
      </div>

      <BestuurEditor cid={cid} naam={seed.naam} />
      <VerEdit cid={cid} origNaam={seed.naam} merged={merged} />
    </div>
  );
}
