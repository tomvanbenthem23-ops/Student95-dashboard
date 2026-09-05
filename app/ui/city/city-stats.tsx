import type { CityStats } from '@/app/lib/stats';

function ProgressBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 h-2.5 overflow-hidden rounded-full bg-[#dbe2f6]">
        <div
          className="h-full rounded-full bg-navy transition-all"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className="text-[12px] text-muted">
        <b className="text-navy">{pct}%</b> {label}
      </p>
    </div>
  );
}

export function CityStatsBlock({ stats }: { stats: CityStats }) {
  return (
    <div className="mb-6">
      <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-3">
        <div className="rounded-m bg-navy-gradient px-5 py-4 text-bg">
          <b className="block font-display text-[30px] leading-tight text-white">
            {stats.total}
          </b>
          <span className="text-[11px] uppercase tracking-wide text-white/60">
            verenigingen
          </span>
        </div>
        <div className="rounded-m bg-navy-gradient px-5 py-4 text-bg">
          <b className="block font-display text-[30px] leading-tight text-white">
            {stats.bezocht}
          </b>
          <span className="text-[11px] uppercase tracking-wide text-white/60">bezocht</span>
        </div>
        <div className="rounded-m bg-navy-gradient px-5 py-4 text-bg">
          <b className="block font-display text-[30px] leading-tight text-white">
            {stats.dealsClosed}
          </b>
          <span className="text-[11px] uppercase tracking-wide text-white/60">
            deals gesloten
          </span>
        </div>
      </div>
      <ProgressBar label="bezocht" pct={stats.bezochtPct} />
      <ProgressBar label="van bezochte verenigingen heeft een follow-up" pct={stats.followupPct} />
    </div>
  );
}
