import { Anton_SC, Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const antonSC = Anton_SC({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
});
