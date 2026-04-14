import type { VariableWithValues } from '@openmeteo/sdk/variable-with-values';
import type { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import type { NextRequest } from 'next/server';
import type { Forecast } from '@/types/forecast';
import { Variable } from '@openmeteo/sdk/variable';
import { cacheLife } from 'next/cache';
import { NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';
import { z } from 'zod';

const queryParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().optional(),
  timezone: z.string().optional(),
});

async function getCachedForecast({
  latitude,
  longitude,
  altitude,
  timezone,
}: z.infer<typeof queryParamsSchema>) {
  'use cache';
  cacheLife('hours');

  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude,
    longitude,
    ...(altitude && { elevation: altitude }),
    ...(timezone && { timezone }),
    forecast_days: 1,
    daily: [
      'temperature_2m_mean',
      'apparent_temperature_mean',
      'precipitation_sum',
      'precipitation_probability_mean',
      'weather_code',
      'uv_index_max',
      'sunrise',
      'sunset',
    ],
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'precipitation_probability',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'relative_humidity_2m',
      'visibility',
    ],
  };
  const [response] = await fetchWeatherApi(url, params);

  const result: Forecast = {
    daily: processVariablesWithTime(response.daily()!) as Forecast['daily'],
    hourly: processVariablesWithTime(response.hourly()!) as Forecast['hourly'],
  };

  return result;
}

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

    const forecast = await getCachedForecast(parsedQueryParams.data);

    return NextResponse.json(forecast);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get forecast data' }, { status: 500 });
  }
}

function processVariablesWithTime(variables: VariablesWithTime) {
  return {
    time: Array.from(
      { length: (Number(variables.timeEnd()) - Number(variables.time())) / variables.interval() },
      (_, index) =>
        new Date((Number(variables.time()) + index * variables.interval()) * 1000).toISOString(),
    ),
    ...Array.from({ length: variables.variablesLength() }).reduce<Record<string, any>>(
      (result, _, index) => {
        const variable = variables.variables(index)!;
        const name = Variable[variable.variable()];
        return {
          ...result,
          [name]: processVariableWithValues(variable),
        };
      },
      {},
    ),
  };
}

function processVariableWithValues(variable: VariableWithValues) {
  const name = Variable[variable.variable()];
  if (name === 'sunrise' || name === 'sunset') {
    return Array.from({ length: variable.valuesInt64Length() }, (_, index) =>
      new Date(Number(variable.valuesInt64(index)) * 1000).toISOString());
  }
  return [...variable.valuesArray()!];
}
