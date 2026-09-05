'use client';

import { KRS } from '@/app/lib/seed-data';
import { useStore } from '@/app/lib/store';

export function KeyResults() {
  const { get, set, editMode } = useStore();
  const items = get<string[]>('list_krs', KRS);

  function checked(i: number) {
    return get<boolean>(`kr_${i}`, false);
  }
  function toggle(i: number) {
    set(`kr_${i}`, !checked(i));
  }
  function updateItem(i: number, text: string) {
    const next = items.slice();
    next[i] = text;
    set('list_krs', next);
  }
  function removeItem(i: number) {
    if (!confirm('Dit key result verwijderen?')) return;
    const next = items.filter((_, idx) => idx !== i);
    set('list_krs', next);
    // shift the checked-flags so they stay aligned with their key result
    for (let j = i; j < items.length; j++) {
      set(`kr_${j}`, checked(j + 1));
    }
  }
  function addItem() {
    set('list_krs', [...items, '']);
  }

  return (
    <div className="rounded-m border border-line bg-surface p-6 shadow-s95">
      <h2 className="mb-3.5 text-[16px] text-ink">Key results (Objective 2)</h2>
      {items.map((text, i) => (
        <div
          key={i}
          className="flex items-start gap-3 border-b border-line py-3 last:border-none"
        >
          <input
            type="checkbox"
            id={`kr-${i}`}
            checked={checked(i)}
            onChange={() => toggle(i)}
            className="mt-1 h-4 w-4 accent-blue"
          />
          <label
            htmlFor={`kr-${i}`}
            className={`flex-1 ${checked(i) ? 'text-muted line-through' : ''}`}
            data-editable
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent ?? '';
              if (val !== text) updateItem(i, val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLElement).blur();
              }
            }}
          >
            {text}
          </label>
          {editMode && (
            <button
              type="button"
              className="edonly ml-auto self-start text-xs text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
              onClick={() => removeItem(i)}
              aria-label="Key result verwijderen"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {editMode && (
        <button
          type="button"
          onClick={addItem}
          className="edonly mt-3 rounded-full border border-dashed border-line2 px-3 py-1 text-xs text-muted hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        >
          + Regel toevoegen
        </button>
      )}
    </div>
  );
}
