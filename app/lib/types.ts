export type Status = string;

export type Vereniging = {
  naam: string;
  type: string;
  leden: string;
  pot: 'A' | 'B' | 'C';
  web?: string;
  email?: string;
  tel?: string;
  adres?: string;
  adresCheck?: boolean;
  zoek?: string;
  note?: string;
  stad?: string;
};

export type City = {
  id: string;
  naam: string;
  intro: string;
  route: string;
  verenigingen: Vereniging[];
};

export type EventItem = {
  d: string;
  ev: string;
  type: string;
  cp: string;
  ver: string;
  ecm: string;
  ecmIso: string | null;
  cmu: string;
};

export type CityManagerField = { k: string; label: string };

export type CityManagerRecord = {
  af: string;
  aan: string;
  maand: string;
  proj: string;
  issues: string;
  lost: string;
  upd: string;
};

export type BestuurLid = {
  naam: string;
  functie: string;
  tel: string;
  mail: string;
};

export type SeedData = {
  statuses: string[];
  tierDescriptions: Record<'A' | 'B' | 'C', string>;
  cities: City[];
  events: Record<string, EventItem[]>;
  eventTitles: Record<string, string>;
  eventNotes: Record<string, string[]>;
  keyResults: string[];
  cityManagers: Record<string, string>;
  cityManagerFields: CityManagerField[];
  cityManagerEmptyRecord: CityManagerRecord;
};
