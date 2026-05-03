'use client';

import type { PropsWithChildren } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { MESSAGES_EN, MESSAGES_ES } from '@/i18n';

interface Props extends PropsWithChildren {
  locale: 'en' | 'es';
}

export function IntlProvider({ locale, children }: Props) {
  const messages = locale === 'es' ? MESSAGES_ES : MESSAGES_EN;

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
}
