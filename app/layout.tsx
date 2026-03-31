import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import { Footer } from '@/components/footer';
import { LocationContextProvider } from '@/context/location-context';
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
    <html lang="en" className={cn('h-full font-sans antialiased', geist.variable)}>
      <body className="h-full">
        <div className="flex flex-col gap-4 max-w-xl min-h-full p-4 mx-auto">
          <IntlProvider>
            <QueryClientProvider>
              <LocationContextProvider>
                <main className="flex-1">{children}</main>
                <Footer />
              </LocationContextProvider>
            </QueryClientProvider>
          </IntlProvider>
        </div>
      </body>
    </html>
  );
}
