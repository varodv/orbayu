import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'orbayu',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="overflow-auto h-full antialiased">
      <body className="flex flex-col gap-4 min-h-full max-w-xl p-4 mx-auto">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
