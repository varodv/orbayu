import type { VariableWithValues } from '@openmeteo/sdk/variable-with-values';
import type { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import type { NextRequest } from 'next/server';
import type { Forecast } from '@/types/forecast';
import { Variable } from '@openmeteo/sdk/variable';
import { cacheLife } from 'next/cache';
import { NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';
import { z } from 'zod';

const DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const queryParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().optional(),
  start_date: z.string().regex(DATE_TIME_REGEX),
  end_date: z.string().regex(DATE_TIME_REGEX),
});

async function getCachedForecast({
  latitude,
  longitude,
  altitude,
  start_date,
  end_date,
}: z.infer<typeof queryParamsSchema>) {
  'use cache';
  cacheLife('hours');

  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude,
    longitude,
    ...(altitude && { elevation: altitude }),
    start_date: start_date.split('T')[0],
    end_date: end_date.split('T')[0],
    start_hour: start_date,
    end_hour: end_date,
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

  const result: Forecast<string> = {
    daily: processVariablesWithTime(response.daily()!) as Forecast<string>['daily'],
    hourly: processVariablesWithTime(response.hourly()!) as Forecast<string>['hourly'],
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
