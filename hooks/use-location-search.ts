'use client';

import type { Location } from '@/types/geocoding';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

interface Props {
  limit?: number;
  debounce?: number;
}

export function useLocationSearch({ limit, debounce = 0 }: Props = {}) {
  const { locale } = useIntl();

  const [query, setQuery] = useState('');

  const { status, data, error, refetch } = useQuery({
    queryKey: ['location-search', query],
    queryFn: async ({ signal }) => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length < 2) {
        return [];
      }
      const urlParams = new URLSearchParams({
        q: trimmedQuery,
        lang: locale,
        ...(limit && { limit: limit.toString() }),
      });
      const url = `/api/geocoding/search?${urlParams.toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Failed to search for locations');
      }
      return (await response.json()) as Array<Location>;
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      void refetch();
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  return {
    query,
    status,
    data,
    error,
    setQuery,
  };
}
