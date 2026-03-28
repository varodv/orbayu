import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { IntlProvider } from '@/providers/intl-provider';
import { QueryClientProvider } from '@/providers/query-client-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'orbayu',
  icons: {
    icon: '/favicon.svg',
  },
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={cn('overflow-auto h-full font-sans antialiased', geist.variable)}>
      <body className="flex flex-col gap-4 min-h-full max-w-xl p-4 mx-auto">
        <main className="flex-1">
          <IntlProvider>
            <QueryClientProvider>{children}</QueryClientProvider>
          </IntlProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
