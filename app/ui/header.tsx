'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CITIES, CMNAMEN } from '@/app/lib/seed-data';
import { useStore, type ConnStatus } from '@/app/lib/store';
import { Editable } from './editable';

const CONN_LABEL: Record<ConnStatus, string> = {
  off: 'Lokaal (geen server)',
  connect: 'Verbinden…',
  poll: 'Gedeeld',
  sync: 'Opslaan…',
  err: 'Verbindingsfout',
};

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { connStatus, connMessage, editMode, toggleEdit } = useStore();

  const navItems = [
    { href: '/', label: 'Overzicht' },
    { href: '/cm', label: 'City managers' },
    ...CITIES.map((c) => ({ href: `/stad/${c.id}`, label: c.naam })),
  ];

  async function logout() {
    await fetch('/api/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-blue/20 bg-[rgba(230,236,251,.92)] px-8 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2 font-display text-[23px] uppercase leading-none">
        Student
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-blue text-[14px] normal-case text-blue">
          95
        </span>
        <small className="block w-full font-sans text-[11px] font-medium normal-case tracking-wide text-muted">
          Salesplan verenigingen · Q3–Q4 2026
        </small>
      </div>

      <nav aria-label="Hoofdnavigatie" className="flex flex-wrap gap-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full border px-4 py-2 text-[11.5px] font-semibold uppercase tracking-wide transition ${FOCUS_RING} ${
                active
                  ? 'border-blue bg-blue text-white'
                  : 'border-blue/20 text-[#525b85] hover:border-blue-light hover:text-blue-dark'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleEdit}
          aria-pressed={editMode}
          title="Zet aan om alle vaste teksten op deze pagina aan te kunnen passen."
          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide ${FOCUS_RING} ${
            editMode
              ? 'border-navy bg-navy text-white'
              : 'border-blue/20 bg-surface text-muted'
          }`}
        >
          <i
            aria-hidden="true"
            className={`block h-[7px] w-[7px] rounded-full ${
              editMode ? 'bg-blue-light' : 'bg-faint'
            }`}
          />
          {editMode ? 'Klaar met bewerken' : 'Tekst bewerken'}
        </button>
        <div
          role="status"
          title={connMessage || 'Gedeelde opslag'}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border border-blue/20 bg-surface px-3.5 py-2 text-[11px] font-semibold text-muted"
        >
          <i
            aria-hidden="true"
            className={`block h-[7px] w-[7px] rounded-full ${
              connStatus === 'poll'
                ? 'bg-blue'
                : connStatus === 'err'
                  ? 'bg-accent'
                  : 'bg-faint'
            }`}
          />
          {CONN_LABEL[connStatus]}
        </div>
        <button
          type="button"
          onClick={logout}
          className={`rounded-full border border-blue/20 bg-surface px-3.5 py-2 text-[11px] font-semibold text-muted hover:text-ink ${FOCUS_RING}`}
        >
          Uitloggen
        </button>
      </div>
    </header>
  );
}

export function CmTag({ cityId }: { cityId: string }) {
  return (
    <span className="mb-2 inline-block rounded-full border border-blue-lightest bg-navy-lightest px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-navy">
      City manager ·{' '}
      <Editable
        as="span"
        storeKey={`cmnaam_${cityId}`}
        fallback={CMNAMEN[cityId] ?? ''}
        placeholder="naam"
      />
    </span>
  );
}
