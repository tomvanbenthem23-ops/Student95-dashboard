import { CITIES, CMLEEG, CMNAMEN, CMVELDEN } from '@/app/lib/seed-data';
import { dealSom, euro } from '@/app/lib/cm-parser';
import type { CityManagerRecord } from '@/app/lib/types';

export function TotalsTable({
  get,
}: {
  get: <T>(key: string, fallback: T) => T;
}) {
  const rows = CITIES.map((c) => {
    const record = get<CityManagerRecord>(`cm_${c.id}`, CMLEEG);
    const perField = CMVELDEN.map((v) => dealSom(record[v.k as keyof CityManagerRecord] as string));
    const totaal = perField.reduce((sum, s) => sum + s.bedrag, 0);
    return { cid: c.id, naam: CMNAMEN[c.id] ?? c.naam, perField, totaal };
  });

  const kolomTotalen = CMVELDEN.map((_, i) => rows.reduce((sum, r) => sum + r.perField[i].bedrag, 0));
  const eindTotaal = rows.reduce((sum, r) => sum + r.totaal, 0);

  return (
    <div className="mb-6 overflow-x-auto rounded-m border border-line bg-surface p-6 shadow-s95">
      <h3 className="mb-3.5 text-[16px] text-ink">Pijplijn per city manager</h3>
      <table className="w-full min-w-[640px] border-collapse text-[13px]">
        <thead>
          <tr className="text-left text-[10.5px] uppercase tracking-wide text-muted">
            <th className="border-b border-line2 py-2 pr-3">City manager</th>
            {CMVELDEN.map((v) => (
              <th key={v.k} className="border-b border-line2 py-2 pr-3 text-right">
                {v.label.replace(' geclosed', '')}
              </th>
            ))}
            <th className="border-b border-line2 py-2 pr-3 text-right">Totaal</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.cid}>
              <td className="border-b border-line py-2 pr-3">{r.naam}</td>
              {r.perField.map((s, i) => (
                <td key={i} className="border-b border-line py-2 pr-3 text-right whitespace-nowrap">
                  {euro(s.bedrag)}
                  <span className="block text-[10.5px] font-normal text-faint">
                    {s.aantal} deal(s)
                  </span>
                </td>
              ))}
              <td className="border-b border-line py-2 pr-3 text-right font-bold text-navy">
                {euro(r.totaal)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="border-t-2 border-line2 pt-2.5 font-bold">Alle steden</td>
            {kolomTotalen.map((t, i) => (
              <td key={i} className="border-t-2 border-line2 pt-2.5 text-right font-bold">
                {euro(t)}
              </td>
            ))}
            <td className="border-t-2 border-line2 pt-2.5 text-right font-bold text-navy">
              {euro(eindTotaal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
