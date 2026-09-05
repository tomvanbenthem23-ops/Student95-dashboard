import type { EventItem } from './types';

const MONTHS = [
  'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];
export const MONTH_LABELS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

/** Lenient month/year extraction from free-running Dutch date text. */
export function eventMonth(d: string): { y: number; m: number } | null {
  if (!d) return null;
  const text = d.toLowerCase();
  const yearMatch = text.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

  const words = text.match(/[a-zà-ÿ]+/g) || [];
  let monthIdx: number | null = null;
  for (const w of words) {
    const found = MONTHS.findIndex((m) => w.slice(0, 3) === m);
    if (found >= 0) {
      monthIdx = found;
      break;
    }
  }
  if (monthIdx == null) return null;

  if (year != null) return { y: year, m: monthIdx };

  const now = new Date();
  const candidates = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];
  let best = candidates[1];
  let bestDiff = Infinity;
  for (const y of candidates) {
    const diff = Math.abs(new Date(y, monthIdx, 1).getTime() - now.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      best = y;
    }
  }
  return { y: best, m: monthIdx };
}

/** First day-of-month number found in the text (a range picks the first day). */
export function eventDay(d: string): number | null {
  const withoutYear = d.replace(/\d{4}/g, ' ');
  const m = withoutYear.match(/\d{1,2}/);
  return m ? parseInt(m[0], 10) : null;
}

export function monthKey(y: number, m: number) {
  return `${y}-${m + 1}`;
}

/** Resolves an event's first-contact-moment to a concrete Date, or null if unparseable. */
export function parseContactMoment(ev: EventItem): Date | null {
  if (ev.ecmIso) {
    const iso = new Date(ev.ecmIso);
    if (!isNaN(iso.getTime())) return iso;
  }
  if (ev.ecm) {
    const my = eventMonth(ev.ecm);
    if (my) {
      const day = eventDay(ev.ecm) ?? 1;
      return new Date(my.y, my.m, day);
    }
  }
  return null;
}

/** An event needs action when its contact-moment deadline has passed and no update was logged. */
export function isDue(ev: EventItem): boolean {
  if (ev.cmu && ev.cmu.trim()) return false;
  const due = parseContactMoment(ev);
  if (!due) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() <= today.getTime();
}
