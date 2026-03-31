'use client';

import type { PropsWithChildren } from 'react';
import type { Location } from '@/types/geocoding';
import { createContext } from 'react';
import { useStorage } from '@/hooks/use-storage';

interface LocationContextValue {
  current: Location | undefined;
}

export const LocationContext = createContext<ReturnType<typeof useStorage<LocationContextValue>>>([
  {
    current: undefined,
  },
  () => {},
]);

export function LocationContextProvider({ children }: PropsWithChildren) {
  const value = useStorage<LocationContextValue>('orbayu:location', {
    current: undefined,
  });

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
