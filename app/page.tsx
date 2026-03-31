'use client';

import { LocationPicker } from '@/components/location-picker';
import { useLocation } from '@/hooks/use-location';

export default function Home() {
  const { location, setLocation } = useLocation();

  return (
    <div className="flex flex-col gap-4">
      <LocationPicker className="self-center" value={location} onChange={setLocation} />
    </div>
  );
}
