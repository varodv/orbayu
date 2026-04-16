'use client';

import type { Location } from '@/types/geocoding';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export function useUserLocation() {
  const { locale } = useIntl();

  const position = useRef<GeolocationPosition>(undefined);

  const [permission, setPermission] = useState<PermissionState>();

  const { status, fetchStatus, data, error, refetch } = useQuery({
    queryKey: ['user-location'],
    queryFn: async ({ signal }) => {
      if (!position.current) {
        return null;
      }
      const { latitude, longitude, altitude } = position.current.coords;
      const urlParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        lang: locale,
      });
      const url = `/api/geocoding/reverse?${urlParams.toString()}`;
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Failed to get user location');
      }
      const result: Location = {
        ...((await response.json()) as Omit<Location, 'timezone'>),
        ...(altitude && { altitude }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      return result;
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    void checkPermission();
    void refetch();
  }, []);

  async function checkPermission() {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      setPermission('denied');
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermission(result.state);
      result.onchange = () => {
        setPermission(result.state);
      };
    }
    catch {
      setPermission('denied');
    }
  }

  async function check() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      position.current = undefined;
      return undefined;
    }

    return new Promise<typeof data>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (newPosition) => {
          position.current = newPosition;
          refetch({ throwOnError: true })
            .then(result => resolve(result.data))
            .catch(reject);
        },
        () => {
          position.current = undefined;
          resolve(undefined);
        },
      );
    });
  }

  return {
    permission,
    status: fetchStatus === 'fetching' ? 'pending' : status,
    data,
    error,
    check,
  };
}
