'use client';

import type { Location } from '@/types/geocoding';
import { useState } from 'react';
import { LocationPicker } from '@/components/location-picker';

export default function Home() {
  const [location, setLocation] = useState<Location>();

  return (
    <div className="flex flex-col gap-4">
      <LocationPicker className="self-center" value={location} onChange={setLocation} />
    </div>
  );
}
