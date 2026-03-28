import type { Location } from '@/types/geocoding';
import { NextResponse } from 'next/server';

interface BigDataCloudReverseGeocodeResponse {
  latitude: number;
  lookupSource: string;
  longitude: number;
  localityLanguageRequested: string;
  continent: string;
  continentCode: string;
  countryName: string;
  countryCode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
  city: string;
  locality: string;
  postcode: string;
  plusCode: string;
  fips?: {
    state: string;
    county: string;
    countySubdivision: string;
    place?: string;
  };
  csdCode?: string;
  localityInfo: Record<
    'administrative' | 'informative',
    {
      name: string;
      description: string;
      isoName: string;
      order: number;
      adminLevel: number;
      isoCode: string;
      wikidataId: string;
      geonameId: number;
      chinaAdminCode?: string;
    }
  >;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitudeParam = searchParams.get('latitude');
    const longitudeParam = searchParams.get('longitude');
    const lang = searchParams.get('lang') ?? 'en';

    if (!latitudeParam || !longitudeParam) {
      return NextResponse.json(
        { error: 'Missing required parameters: latitude, longitude' },
        { status: 400 },
      );
    }

    const latitude = Number.parseFloat(latitudeParam);
    const longitude = Number.parseFloat(longitudeParam);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid parameters: latitude, longitude must be numbers' },
        { status: 400 },
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          error:
            'Invalid parameters: latitude must be in [-90, 90] range, '
            + 'longitude must be in [-180, 180] range',
        },
        { status: 400 },
      );
    }

    const urlParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      localityLanguage: lang,
    });
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${urlParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`BigDataCloud API error: ${response.statusText}`);
    }

    const data = (await response.json()) as BigDataCloudReverseGeocodeResponse;

    const location = {
      name: data.city || data.locality,
      region: data.principalSubdivision,
      country: data.countryName,
      countryCode: data.countryCode,
      latitude,
      longitude,
    } as Location;

    return NextResponse.json(location);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get geocoding data' }, { status: 500 });
  }
}
