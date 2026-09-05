'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/app/lib/store';

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR']);

function sanitizeHtml(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;
  function walk(node: ChildNode): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const inner = Array.from(el.childNodes).map(walk).join('');
    if (ALLOWED_TAGS.has(el.tagName)) {
      if (el.tagName === 'BR') return '<br>';
      const tag = el.tagName.toLowerCase();
      return `<${tag}>${inner}</${tag}>`;
    }
    if (el.tagName === 'DIV' || el.tagName === 'P') return inner + '<br>';
    return inner;
  }
  return Array.from(container.childNodes).map(walk).join('');
}

function textOnly(html: string): string {
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '').trim();
  }
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || '').trim();
}

type EditableProps = {
  storeKey: string;
  fallback: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
  placeholder?: string;
  multiline?: boolean;
};

export function Editable({
  storeKey,
  fallback,
  as = 'span',
  className,
  placeholder,
  multiline = false,
}: EditableProps) {
  const { get, set, editMode } = useStore();
  const stored = get<string>(storeKey, fallback);
  const ref = useRef<HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState(stored);
  const focusedRef = useRef(false);
  const startRef = useRef(stored);

  useEffect(() => {
    if (!focusedRef.current) setDisplayValue(stored);
  }, [stored]);

  const isEmpty = textOnly(displayValue) === '';
  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-editable
      data-leeg={isEmpty ? 'true' : undefined}
      data-ph={placeholder}
      className={className}
      contentEditable={editMode}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: displayValue }}
      onFocus={() => {
        focusedRef.current = true;
        startRef.current = ref.current?.innerHTML ?? '';
      }}
      onBlur={() => {
        focusedRef.current = false;
        const html = ref.current?.innerHTML ?? '';
        setDisplayValue(html);
        if (html !== startRef.current) set(storeKey, html);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (ref.current) ref.current.innerHTML = startRef.current;
          (e.target as HTMLElement).blur();
        } else if (e.key === 'Enter' && !multiline) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      onPaste={(e: React.ClipboardEvent) => {
        e.preventDefault();
        const html =
          e.clipboardData.getData('text/html') ||
          e.clipboardData.getData('text/plain');
        const clean = sanitizeHtml(html);
        document.execCommand('insertHTML', false, clean);
      }}
    />
  );
}

type EditableListProps = {
  storeKey: string;
  fallback: string[];
  itemClassName?: string;
  listClassName?: string;
  ordered?: boolean;
};

export function EditableList({
  storeKey,
  fallback,
  itemClassName,
  listClassName,
}: EditableListProps) {
  const { get, set, editMode } = useStore();
  const items = get<string[]>(storeKey, fallback);

  function updateItem(i: number, text: string) {
    const next = items.slice();
    next[i] = text;
    set(storeKey, next);
  }
  function removeItem(i: number) {
    if (!confirm('Deze regel verwijderen?')) return;
    set(
      storeKey,
      items.filter((_, idx) => idx !== i),
    );
  }
  function addItem() {
    set(storeKey, [...items, '']);
  }

  return (
    <ul className={listClassName}>
      {items.map((text, i) => (
        <li key={i} className={itemClassName}>
          <div className="flex items-start gap-2">
            <span
              className="flex-1"
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
            </span>
            {editMode && (
              <button
                type="button"
                className="edonly text-accent text-xs px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                onClick={() => removeItem(i)}
                aria-label="Regel verwijderen"
              >
                ×
              </button>
            )}
          </div>
        </li>
      ))}
      {editMode && (
        <li className="edonly">
          <button
            type="button"
            onClick={addItem}
            className="mt-2 rounded-full border border-dashed border-line2 px-3 py-1 text-xs text-muted hover:text-ink hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            + Regel toevoegen
          </button>
        </li>
      )}
    </ul>
  );
}
