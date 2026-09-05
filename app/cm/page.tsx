'use client';

import { useStore } from '@/app/lib/store';
import { CITIES } from '@/app/lib/seed-data';
import { computeCmAttentionCount } from '@/app/lib/stats';
import { PasteBlock } from '@/app/ui/cm/paste-block';
import { TotalsTable } from '@/app/ui/cm/totals-table';
import { CmCard } from '@/app/ui/cm/cm-card';

export default function CityManagersPage() {
  const { get } = useStore();
  const attention = computeCmAttentionCount(get);

  return (
    <div>
      <h1 className="mb-2 font-display text-[44px] leading-[1.02] text-navy">
        City managers
      </h1>
      <p className="mb-6 max-w-[800px] text-muted">
        Wekelijkse pijplijn-updates verwerken en de voortgang per city manager
        in één oogopslag.
      </p>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-3">
        <div className="rounded-m bg-navy-gradient px-5 py-4 text-bg">
          <b className="block font-display text-[30px] leading-tight text-white">
            {CITIES.length}
          </b>
          <span className="text-[11px] uppercase tracking-wide text-white/60">
            city managers
          </span>
        </div>
        <div className="rounded-m bg-navy-gradient px-5 py-4 text-bg">
          <b className="block font-display text-[30px] leading-tight text-white">
            {attention}
          </b>
          <span className="text-[11px] uppercase tracking-wide text-white/60">
            met issues of lost
          </span>
        </div>
      </div>

      <PasteBlock />
      <TotalsTable get={get} />

      {CITIES.map((city) => (
        <CmCard key={city.id} city={city} />
      ))}
    </div>
  );
}
