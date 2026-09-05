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
        className="min-w-[200px] flex-1 rounded-full border border-line2 bg-surface px-4 py-2.5 text-[13px] focus:border-ink focus:outline-none"
      />
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilter(e.target.value)}
        className="rounded-full border border-line2 bg-surface px-4 py-2.5 text-[13px]"
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
