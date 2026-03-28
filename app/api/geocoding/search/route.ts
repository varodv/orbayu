import type { Location } from '@/types/geocoding';
import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') ?? 'en';
    const limitParam = searchParams.get('limit');

    if (!query) {
      return NextResponse.json({ error: 'Missing required parameter: q' }, { status: 400 });
    }

    let limit = 10;
    if (limitParam) {
      const parsedLimitParam = Number.parseInt(limitParam, 10);
      if (!Number.isNaN(parsedLimitParam) && parsedLimitParam > 0 && parsedLimitParam <= 100) {
        limit = parsedLimitParam;
      }
    }

    const urlParams = new URLSearchParams({
      name: query,
      language: lang,
      count: limit.toString(),
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${urlParams.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }

    const data = (await response.json()) as OpenMeteoGeocodingResponse;

    const result
      = data.results?.map<Location>(currentResult => ({
        id: currentResult.id.toString(),
        name: currentResult.name,
        region: currentResult.admin1,
        country: currentResult.country,
        countryCode: currentResult.country_code,
        latitude: currentResult.latitude,
        longitude: currentResult.longitude,
        altitude: currentResult.elevation,
        timezone: currentResult.timezone,
      })) ?? [];

    return NextResponse.json(result);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get geocoding data' }, { status: 500 });
  }
}
