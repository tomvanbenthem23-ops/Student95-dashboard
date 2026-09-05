import type { Metadata } from 'next';
import { antonSC, inter } from '@/app/ui/fonts';
import { StoreProvider } from '@/app/lib/store';
import { AppShell } from '@/app/ui/app-shell';
import './ui/global.css';

export const metadata: Metadata = {
  title: 'Student95 — Salesplan Verenigingen NL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${inter.variable} ${antonSC.variable}`}>
      <body className="font-sans text-[15px] leading-[1.55] text-ink">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
