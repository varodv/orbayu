import type { NextRequest } from 'next/server';
import type { Location } from '@/types/geocoding';
import { NextResponse } from 'next/server';
import { z } from 'zod';

interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
    feature_code: string;
    country_code: string;
    country: string;
    country_id: number;
    population: number;
    postcodes: Array<string>;
    admin1: string;
    admin2: string;
    admin3: string;
    admin4: string;
    admin1_id: number;
    admin2_id: number;
    admin3_id: number;
    admin4_id: number;
  }>;
}

const queryParamsSchema = z.object({
  q: z.string().min(1),
  lang: z.string().optional().default('en'),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export async function GET(request: NextRequest) {
  try {
    const queryParams = Object.fromEntries(request.nextUrl.searchParams.entries());
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

    const { q: query, lang, limit } = parsedQueryParams.data;

    const urlParams = new URLSearchParams({
      name: query,
      language: lang,
      count: limit.toString(),
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${urlParams.toString()}`;

    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });

    if (!response.ok) {
      throw new Error('Open-Meteo API error', { cause: await response.json() });
    }

    const data = (await response.json()) as OpenMeteoGeocodingResponse;

    const locations
      = data.results?.map<Location>(result => ({
        id: result.id.toString(),
        name: result.name,
        region: result.admin1,
        country: result.country,
        countryCode: result.country_code,
        latitude: result.latitude,
        longitude: result.longitude,
        altitude: result.elevation,
        timezone: result.timezone,
      })) ?? [];

    return NextResponse.json(locations);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get geocoding data' }, { status: 500 });
  }
}
