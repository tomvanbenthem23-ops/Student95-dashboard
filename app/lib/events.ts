import { EVENTS } from './seed-data';
import type { EventItem } from './types';

export function getEventsForCity(
  cid: string,
  get: <T>(key: string, fallback: T) => T,
): EventItem[] {
  return get<EventItem[]>(`events_${cid}`, EVENTS[cid] ?? []);
}

export type FlatEvent = { cid: string; i: number; e: EventItem };

export function allEventsFlat(get: <T>(key: string, fallback: T) => T): FlatEvent[] {
  const out: FlatEvent[] = [];
  for (const cid of Object.keys(EVENTS)) {
    getEventsForCity(cid, get).forEach((e, i) => out.push({ cid, i, e }));
  }
  return out;
}
