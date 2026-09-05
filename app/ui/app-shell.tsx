'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/login') return <>{children}</>;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1220px] px-8 pb-20 pt-9">{children}</main>
    </>
  );
}
