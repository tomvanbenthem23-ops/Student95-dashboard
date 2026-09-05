import type { BestuurLid, Vereniging } from './types';

export function verKey(cid: string, origNaam: string) {
  return `ver_${cid}::${origNaam}`;
}
export function statusKey(cid: string, origNaam: string) {
  return `status_${cid}::${origNaam}`;
}
export function noteKey(cid: string, origNaam: string) {
  return `note_${cid}::${origNaam}`;
}
export function bestuurKey(cid: string, origNaam: string) {
  return `bestuur_${cid}::${origNaam}`;
}

export function mergedVereniging(
  cid: string,
  v: Vereniging,
  get: <T>(key: string, fallback: T) => T,
): Vereniging {
  const override = get<Partial<Vereniging>>(verKey(cid, v.naam), {});
  return { ...v, ...override };
}

export function getBestuur(
  cid: string,
  origNaam: string,
  get: <T>(key: string, fallback: T) => T,
): BestuurLid[] {
  return get<BestuurLid[]>(bestuurKey(cid, origNaam), []);
}

const TYPE_FILTERS: Record<string, (type: string) => boolean> = {
  corps: (t) => t.includes('corps'),
  gezelligheid: (t) => t.includes('gezelligheid'),
  studie: (t) => t.includes('studie'),
  roeien: (t) => t.includes('roeien') || t.includes('sport'),
};

export function matchesTypeFilter(type: string, filter: string): boolean {
  if (!filter) return true;
  const test = TYPE_FILTERS[filter];
  return test ? test(type.toLowerCase()) : true;
}

export function matchesSearch(naam: string, query: string): boolean {
  if (!query.trim()) return true;
  return naam.toLowerCase().includes(query.trim().toLowerCase());
}
