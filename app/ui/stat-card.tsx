import { Editable } from './editable';

export function StatRow({
  stats,
}: {
  stats: { value: number | string; labelKey: string; labelFallback: string }[];
}) {
  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-3">
      {stats.map((s) => (
        <div
          key={s.labelKey}
          className="rounded-m bg-navy-gradient px-5 py-4 text-bg"
        >
          <b className="block font-display text-[30px] leading-tight text-white">
            {s.value}
          </b>
          <Editable
            as="span"
            storeKey={s.labelKey}
            fallback={s.labelFallback}
            className="text-[11px] uppercase tracking-wide text-white/60"
          />
        </div>
      ))}
    </div>
  );
}
