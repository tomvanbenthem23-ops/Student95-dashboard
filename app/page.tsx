'use client';

import { useStore } from '@/app/lib/store';
import { computeOverviewStats } from '@/app/lib/stats';
import { Editable, EditableList } from '@/app/ui/editable';
import { StatRow } from '@/app/ui/stat-card';
import { MonthCalendar } from '@/app/ui/month-calendar';
import { KeyResults } from '@/app/ui/key-results';

const TIJDLIJN_DEFAULT = [
  'Bij elke bestuurswissel (meestal rond de zomer) start iedere vereniging weer bij nul: nieuwe contactpersonen, nieuwe voorkeuren, geen lopende afspraken.',
  'Wie als eerste binnenkomt bij het nieuwe bestuur, zet de toon voor het hele jaar — dat is waarom snelheid vóór 1 september telt.',
  'Concurrerende leveranciers benaderen dezelfde besturen; een goed voorbereide bezoeklijst en routeplanning zijn het verschil.',
];
const HKB_DEFAULT = [
  'Zoek eerst uit wanneer het bestuur wisselt en wie de nieuwe contactpersoon (meestal de commissaris intern of extern) is.',
  'Plan bestuursafspraken overdag, op afspraak — geen borrel- of avondbezoeken.',
  'Studieverenigingskamers op de campus zijn vaak overdag bemand: daar kun je gewoon binnenlopen.',
  'Kom voorbereid: ken de vereniging, het type merch dat ze eerder kochten, en een concreet voorstel.',
];
const CHECKLIST_DEFAULT = [
  'Contactgegevens geverifieerd (of gemarkeerd als "verifieer")',
  'Afspraak of bezoekmoment vastgelegd',
  'Foto/video van het bezoek — creative manager op de hoogte',
  'Status en notitie bijgewerkt in het dashboard direct na het bezoek',
  'Follow-up-moment ingepland',
];

export default function OverviewPage() {
  const { get } = useStore();
  const stats = computeOverviewStats(get);

  return (
    <div>
      <div className="mb-2">
        <h1 className="mb-2 font-display text-[44px] leading-[1.02] text-navy">
          <Editable storeKey="txt_ov_title" fallback="Overzicht & strategie" />
        </h1>
        <p className="mb-6 max-w-[800px] text-muted">
          <Editable
            storeKey="txt_ov_sub"
            fallback="Alle steden in één oogopslag: voortgang, aankomende events en de strategie achter het salesplan."
            multiline
          />
        </p>
      </div>

      <StatRow
        stats={[
          { value: stats.total, labelKey: 'txt_stat_scope', labelFallback: 'verenigingen in scope' },
          { value: stats.bezocht, labelKey: 'txt_stat_bezocht', labelFallback: 'bezocht (doel: 6)' },
          { value: stats.citiesVisited, labelKey: 'txt_stat_steden', labelFallback: 'steden bezocht (doel: 4)' },
          { value: `${stats.followupPct}%`, labelKey: 'txt_stat_followup', labelFallback: 'follow-up (doel: 80%)' },
          { value: stats.dealsClosed, labelKey: 'txt_stat_deals', labelFallback: 'deals gesloten' },
        ]}
      />

      <MonthCalendar />

      <div className="mb-[22px] grid grid-cols-2 gap-[22px] max-[860px]:grid-cols-1">
        <KeyResults />
        <div className="rounded-m border border-line bg-surface p-6 shadow-s95">
          <h2 className="mb-3.5 text-[16px] text-ink">
            <Editable storeKey="txt_ov_tl_titel" fallback="Tijdlijn — waarom nu" />
          </h2>
          <EditableList
            storeKey="list_ov_tl"
            fallback={TIJDLIJN_DEFAULT}
            listClassName="ml-[18px] list-disc space-y-1.5"
          />
        </div>
      </div>

      <div className="mb-[22px] grid grid-cols-2 gap-[22px] max-[860px]:grid-cols-1">
        <div className="rounded-m border border-line bg-surface p-6 shadow-s95">
          <h2 className="mb-3.5 text-[16px] text-ink">
            <Editable storeKey="txt_ov_hkb_titel" fallback="Hoe kom je binnen" />
          </h2>
          <EditableList
            storeKey="list_ov_hkb"
            fallback={HKB_DEFAULT}
            listClassName="ml-[18px] list-disc space-y-1.5"
          />
        </div>
        <div className="rounded-m border border-line bg-surface p-6 shadow-s95">
          <h2 className="mb-3.5 text-[16px] text-ink">
            <Editable storeKey="txt_ov_chk_titel" fallback="Bezoek-checklist" />
          </h2>
          <EditableList
            storeKey="list_ov_chk"
            fallback={CHECKLIST_DEFAULT}
            listClassName="ml-[18px] list-disc space-y-1.5"
          />
        </div>
      </div>

      <p className="mt-7 border-t border-line pt-3.5 text-[12px] text-muted">
        <Editable
          storeKey="txt_disclaimer_ov"
          fallback="Data met een rood 'verifieer'-label is niet geverifieerd; bronnen zijn openbare websites. Laatste schrijver wint bij gelijktijdig bewerken."
          multiline
        />
      </p>
    </div>
  );
}
