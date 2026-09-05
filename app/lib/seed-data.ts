import raw from './seed-data.json';
import type { SeedData } from './types';

export const SEED = raw as unknown as SeedData;

export const STATUSES = SEED.statuses;
export const TIERDESC = SEED.tierDescriptions;
export const CITIES = SEED.cities;
export const EVENTS = SEED.events;
export const EVENT_TITLES = SEED.eventTitles;
export const EVENT_NOTES = SEED.eventNotes;
export const KRS = SEED.keyResults;
export const CMNAMEN = SEED.cityManagers;
export const CMVELDEN = SEED.cityManagerFields;
export const CMLEEG = SEED.cityManagerEmptyRecord;

export function cityById(cid: string) {
  return CITIES.find((c) => c.id === cid);
}
