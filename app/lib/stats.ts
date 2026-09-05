import { CITIES, CMLEEG, STATUSES } from './seed-data';
import { hasAttention } from './cm-parser';
import type { CityManagerRecord } from './types';

const BEZOCHT_IDX = STATUSES.findIndex((s) => s.toLowerCase() === 'bezocht');
const FOLLOWUP_IDX = STATUSES.findIndex((s) => s.toLowerCase().includes('follow-up'));
const DEAL_IDX = STATUSES.length - 1;

export type OverviewStats = {
  total: number;
  bezocht: number;
  citiesVisited: number;
  followupPct: number;
  dealsClosed: number;
};

export function computeOverviewStats(
  get: <T>(key: string, fallback: T) => T,
): OverviewStats {
  let total = 0;
  let bezocht = 0;
  let followup = 0;
  let dealsClosed = 0;
  const citiesVisited = new Set<string>();

  for (const city of CITIES) {
    for (const v of city.verenigingen) {
      total++;
      const statusIdx = get<number>(`status_${city.id}::${v.naam}`, 0);
      if (statusIdx >= BEZOCHT_IDX) {
        bezocht++;
        citiesVisited.add(city.id);
      }
      if (statusIdx >= FOLLOWUP_IDX) followup++;
      if (statusIdx === DEAL_IDX) dealsClosed++;
    }
  }

  return {
    total,
    bezocht,
    citiesVisited: citiesVisited.size,
    followupPct: bezocht > 0 ? Math.round((followup / bezocht) * 100) : 0,
    dealsClosed,
  };
}

export type CityStats = {
  total: number;
  bezocht: number;
  bezochtPct: number;
  followupPct: number;
  dealsClosed: number;
};

export function computeCityStats(
  cid: string,
  get: <T>(key: string, fallback: T) => T,
): CityStats {
  const city = CITIES.find((c) => c.id === cid);
  const verenigingen = city?.verenigingen ?? [];
  let bezocht = 0;
  let followup = 0;
  let dealsClosed = 0;

  for (const v of verenigingen) {
    const statusIdx = get<number>(`status_${cid}::${v.naam}`, 0);
    if (statusIdx >= BEZOCHT_IDX) bezocht++;
    if (statusIdx >= FOLLOWUP_IDX) followup++;
    if (statusIdx === DEAL_IDX) dealsClosed++;
  }

  return {
    total: verenigingen.length,
    bezocht,
    bezochtPct: verenigingen.length > 0 ? Math.round((bezocht / verenigingen.length) * 100) : 0,
    followupPct: bezocht > 0 ? Math.round((followup / bezocht) * 100) : 0,
    dealsClosed,
  };
}

export function computeCmAttentionCount(get: <T>(key: string, fallback: T) => T): number {
  let count = 0;
  for (const city of CITIES) {
    const record = get<CityManagerRecord>(`cm_${city.id}`, CMLEEG);
    if (hasAttention(record.issues) || hasAttention(record.lost)) count++;
  }
  return count;
}
