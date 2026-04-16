'use client';

import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import type { Location } from '@/types/geocoding';
import { createContext } from 'react';
import { useStorage } from '@/hooks/use-storage';

interface LocationContextValue {
  current: Location | undefined;
}

export const LocationContext = createContext<
  [LocationContextValue, Dispatch<SetStateAction<LocationContextValue>>]
>([
  {
    current: undefined,
  },
  () => {},
]);

export function LocationContextProvider({ children }: PropsWithChildren) {
  const [value, setValue, initialized] = useStorage<LocationContextValue>('orbayu:location', {
    current: undefined,
  });

  if (initialized) {
    return (
      <LocationContext.Provider value={[value, setValue]}>{children}</LocationContext.Provider>
    );
  }
}
