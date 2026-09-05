import { CITIES, STATUSES } from './seed-data';

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
