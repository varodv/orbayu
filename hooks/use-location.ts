'use client';

import type { Location } from '@/types/geocoding';
import { use } from 'react';
import { LocationContext } from '@/context/location-context';

export function useLocation() {
  const [{ current: location }, setContextValue] = use(LocationContext);

  function setLocation(location: Location | undefined) {
    setContextValue({ current: location });
  }

  return {
    location,
    setLocation,
  };
}
