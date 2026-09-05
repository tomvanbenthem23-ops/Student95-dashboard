export type ParsedDeal = { naam: string; soort: string | null; waarde: number | null };

/** Splits a free-text deal list on commas outside parentheses, and always after a closing paren. */
export function splitDeals(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of text || '') {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    current += ch;
    if (depth === 0 && (ch === ')' || ch === ',')) {
      parts.push(current);
      current = '';
    }
  }
  if (current.trim()) parts.push(current);
  return parts
    .map((p) => p.replace(/^[\s.,]+|[\s.,]+$/g, '').trim())
    .filter(Boolean);
}

/** Parses "Naam (Type-Waarde k)" e.g. "Naam (B-1.5k)" -> {naam, soort:'B', waarde:1.5} (in thousands euro). */
export function parseDeal(raw: string): ParsedDeal {
  const m = raw.match(/^(.*?)\(([A-Za-z]+)-?(\d+(?:[.,]\d+)?)\s*k?\)\s*$/i);
  if (!m) return { naam: raw.trim(), soort: null, waarde: null };
  return {
    naam: m[1].trim(),
    soort: m[2].toUpperCase(),
    waarde: parseFloat(m[3].replace(',', '.')),
  };
}

export function dealSom(text: string): { aantal: number; bedrag: number } {
  const deals = splitDeals(text);
  let bedrag = 0;
  for (const d of deals) {
    const parsed = parseDeal(d);
    if (parsed.waarde != null) bedrag += parsed.waarde;
  }
  return { aantal: deals.length, bedrag };
}

export function euro(nThousands: number): string {
  return `€ ${nThousands.toLocaleString('nl-NL', { maximumFractionDigits: 1 })}k`;
}

const INVISIBLE = /[⁠​‌‍﻿]/g;

export type CMFieldKey = 'af' | 'aan' | 'maand' | 'proj' | 'issues' | 'lost';

const LABEL_PATTERNS: [CMFieldKey, RegExp][] = [
  ['aan', /^aankom\w*\s*week/i],
  ['maand', /^aankom\w*\s*maand/i],
  ['af', /^afgelopen/i],
  ['proj', /^project/i],
  ['issues', /^issues?/i],
  ['lost', /^lost/i],
];

export function parseCMUpdate(raw: string): {
  naam: string | null;
  fields: Partial<Record<CMFieldKey, string>>;
} {
  const text = raw.replace(INVISIBLE, '');
  const nameMatch = text.match(/\*([^*]+)\*/);
  const naam = nameMatch ? nameMatch[1].trim() : null;
  const fields: Partial<Record<CMFieldKey, string>> = {};

  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/^[\s\-•*]+/, '').trim();
    if (!line) continue;
    for (const [key, pattern] of LABEL_PATTERNS) {
      if (pattern.test(line)) {
        const idx = line.indexOf(':');
        fields[key] = idx >= 0 ? line.slice(idx + 1).trim() : '';
        break;
      }
    }
  }
  return { naam, fields };
}

export function resolveCityManager(
  naam: string,
  cmNamen: Record<string, string>,
): string | null {
  const query = naam.trim().toLowerCase();
  if (!query) return null;
  for (const [cid, fullName] of Object.entries(cmNamen)) {
    const firstName = fullName.split(' ')[0].toLowerCase();
    if (firstName === query || fullName.toLowerCase() === query) return cid;
  }
  return null;
}

export function hasAttention(value: string): boolean {
  const v = (value || '').trim();
  return v !== '' && v !== '-';
}
