'use client';

import type { Location } from '@/types/geocoding';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

export function useUserLocation() {
  const { locale } = useIntl();

  const [permission, setPermission] = useState<PermissionState>();

  const [position, setPosition] = useState<GeolocationPosition>();

  const { status, data, error, refetch } = useQuery({
    queryKey: ['user-location'],
    queryFn: async () => {
      if (!position) {
        return null;
      }
      const { latitude, longitude } = position.coords;
      const urlParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        lang: locale,
      });
      const url = `/api/geocoding/reverse?${urlParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to get user location');
      }
      return (await response.json()) as Location;
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    void checkPermission();
  }, []);

  useEffect(() => {
    if (permission === 'granted') {
      void checkPosition();
    }
  }, [permission]);

  useEffect(() => {
    void refetch();
  }, [position]);

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

  async function checkPosition() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setPosition(undefined);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      setPosition,
      () => {
        setPosition(undefined);
      },
    );
  }

  async function check() {
    await checkPosition();
  }

  return {
    permission,
    status,
    data,
    error,
    check,
  };
}
