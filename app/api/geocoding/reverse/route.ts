import type { Location } from '@/types/geocoding';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

const queryParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  lang: z.string().optional().default('en'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedQueryParams = queryParamsSchema.safeParse(queryParams);

    if (!parsedQueryParams.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          details: z.flattenError(parsedQueryParams.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const { latitude, longitude, lang } = parsedQueryParams.data;

    const urlParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      localityLanguage: lang,
    });
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${urlParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('BigDataCloud API error', { cause: await response.json() });
    }

    const data = (await response.json()) as BigDataCloudReverseGeocodeResponse;

    const location: Location = {
      name: data.city || data.locality,
      region: data.principalSubdivision,
      country: data.countryName,
      countryCode: data.countryCode,
      latitude,
      longitude,
    };

    return NextResponse.json(location);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get geocoding data' }, { status: 500 });
  }
}
