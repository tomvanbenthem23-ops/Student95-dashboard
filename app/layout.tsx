import type { Metadata } from 'next';
import { antonSC, inter } from '@/app/ui/fonts';
import { StoreProvider } from '@/app/lib/store';
import { Header } from '@/app/ui/header';
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
          <Header />
          <main className="mx-auto max-w-[1220px] px-8 pb-20 pt-9">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
