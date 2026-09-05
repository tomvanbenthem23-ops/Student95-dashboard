import { TIERDESC } from '@/app/lib/seed-data';
import type { Vereniging } from '@/app/lib/types';
import { VCard } from './vcard';

const TIER_TAG_CLASS: Record<string, string> = {
  A: 'bg-accent text-white',
  B: 'bg-blue text-white',
  C: 'border border-line2 bg-surface text-muted',
};

export function TierSection({
  cid,
  tier,
  items,
}: {
  cid: string;
  tier: 'A' | 'B' | 'C';
  items: Vereniging[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-8">
      <div className="mb-3.5 flex flex-wrap items-center gap-3">
        <h2 className="text-[20px]">Tier {tier}</h2>
        <span
          className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide ${TIER_TAG_CLASS[tier]}`}
        >
          Tier {tier}
        </span>
        <p className="text-[13px] text-muted">{TIERDESC[tier]}</p>
      </div>
      {items.map((v) => (
        <VCard key={v.naam} cid={cid} seed={v} />
      ))}
    </div>
  );
}
