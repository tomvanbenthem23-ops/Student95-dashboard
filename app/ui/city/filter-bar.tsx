'use client';

const OPTIONS = [
  { value: '', label: 'Alle typen' },
  { value: 'corps', label: 'Corps' },
  { value: 'gezelligheid', label: 'Gezelligheid' },
  { value: 'studie', label: 'Studie' },
  { value: 'roeien', label: 'Roeien / sport' },
];

export function FilterBar({
  query,
  onQuery,
  typeFilter,
  onTypeFilter,
}: {
  query: string;
  onQuery: (v: string) => void;
  typeFilter: string;
  onTypeFilter: (v: string) => void;
}) {
  return (
    <div className="mb-2 flex flex-wrap gap-2.5">
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Zoek vereniging…"
        aria-label="Zoek vereniging"
        className="min-w-[200px] flex-1 rounded-full border border-line2 bg-surface px-4 py-2.5 text-[13px] focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
      />
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
        aria-label="Filter op type"
        className="rounded-full border border-line2 bg-surface px-4 py-2.5 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
