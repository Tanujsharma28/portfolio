import type { Metadata, Viewport } from 'next';
import { Syne, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { profile } from '@/data/profile';

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '800'],
  variable: '--font-syne',
  display: 'swap',
});
const sans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.name}, ${profile.role}. ${profile.qualified}.`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#070a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
