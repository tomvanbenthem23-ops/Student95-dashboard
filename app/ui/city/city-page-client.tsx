'use client';

import { useMemo, useState } from 'react';
import { useStore } from '@/app/lib/store';
import { computeCityStats } from '@/app/lib/stats';
import { matchesSearch, matchesTypeFilter, mergedVereniging } from '@/app/lib/associations';
import { Editable } from '@/app/ui/editable';
import { CmTag } from '@/app/ui/header';
import type { City } from '@/app/lib/types';
import { CityStatsBlock } from './city-stats';
import { RouteBox } from './route-box';
import { EventTable } from './event-table';
import { FilterBar } from './filter-bar';
import { TierSection } from './tier-section';

export function CityPageClient({ city }: { city: City }) {
  const { get } = useStore();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const stats = computeCityStats(city.id, get);

  const filtered = useMemo(
    () =>
      city.verenigingen.filter((v) => {
        const merged = mergedVereniging(city.id, v, get);
        return matchesSearch(merged.naam, query) && matchesTypeFilter(merged.type, typeFilter);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [city, query, typeFilter, get],
  );

  const byTier = {
    A: filtered.filter((v) => v.pot === 'A'),
    B: filtered.filter((v) => v.pot === 'B'),
    C: filtered.filter((v) => v.pot === 'C'),
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-3.5">
        <h1 className="font-display text-[44px] leading-[1.02] text-navy">{city.naam}</h1>
        <CmTag cityId={city.id} />
      </div>
      <p className="mb-6 max-w-[800px] text-muted">
        <Editable storeKey={`txt_intro_${city.id}`} fallback={city.intro} multiline />
      </p>

      <CityStatsBlock stats={stats} />
      <RouteBox cid={city.id} fallback={city.route} />
      <EventTable cid={city.id} />

      <FilterBar
        query={query}
        onQuery={setQuery}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
      />

      <TierSection cid={city.id} tier="A" items={byTier.A} />
      <TierSection cid={city.id} tier="B" items={byTier.B} />
      <TierSection cid={city.id} tier="C" items={byTier.C} />

      <p className="mt-7 border-t border-line pt-3.5 text-[12px] text-muted">
        Data met een rood &quot;verifieer&quot;-label is niet geverifieerd; bronnen zijn openbare
        websites.
      </p>
    </div>
  );
}
