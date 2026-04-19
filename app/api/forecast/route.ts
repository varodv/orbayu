import type { VariableWithValues } from '@openmeteo/sdk/variable-with-values';
import type { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import type { NextRequest } from 'next/server';
import type { DailyWeather, Forecast, HourlyWeather } from '@/types/forecast';
import { Variable } from '@openmeteo/sdk/variable';
import { cacheLife } from 'next/cache';
import { NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';
import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const queryParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().optional(),
  start_date: z.string().regex(DATE_REGEX),
  end_date: z.string().regex(DATE_REGEX),
  timezone: z.string().optional(),
});

async function getCachedForecast({
  latitude,
  longitude,
  altitude,
  start_date,
  end_date,
  timezone,
}: z.infer<typeof queryParamsSchema>) {
  'use cache';
  cacheLife('hours');

  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude,
    longitude,
    ...(altitude && { elevation: altitude }),
    start_date,
    end_date,
    start_hour: `${start_date}T00:00`,
    end_hour: `${end_date}T23:00`,
    ...(timezone && { timezone }),
    daily: [
      'temperature_2m_mean',
      'apparent_temperature_mean',
      'precipitation_sum',
      'precipitation_probability_mean',
      'snowfall_sum',
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
      'snowfall',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'relative_humidity_2m',
      'visibility',
    ],
  };
  const [response] = await fetchWeatherApi(url, params);

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const dailyResult = processVariablesWithTime(
    response.daily()!,
    utcOffsetSeconds,
  ) as unknown as Array<Omit<DailyWeather<string>, 'hourly'>>;
  const hourlyResult = processVariablesWithTime(
    response.hourly()!,
    utcOffsetSeconds,
  ) as unknown as Array<HourlyWeather<string>>;
  const result: Forecast<string> = {
    daily: dailyResult.map((dailyItem) => {
      const itemDate = dailyItem.time.split('T')[0];
      return {
        ...dailyItem,
        hourly: hourlyResult.filter(hourlyItem => hourlyItem.time.startsWith(itemDate)),
      };
    }),
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

function processVariablesWithTime(variables: VariablesWithTime, utcOffsetSeconds: number) {
  const times = Array.from(
    { length: (Number(variables.timeEnd()) - Number(variables.time())) / variables.interval() },
    (_, index) => {
      const time = new Date(
        (Number(variables.time()) + index * variables.interval() + utcOffsetSeconds) * 1000,
      );
      return toISOTimezoneString(time, utcOffsetSeconds);
    },
  );

  const columns = Array.from({ length: variables.variablesLength() }).map((_, index) => {
    const variable = variables.variables(index)!;
    const name = Variable[variable.variable()];
    return {
      name,
      values: processVariableWithValues(variable, utcOffsetSeconds),
    };
  });

  return times.reduce<Array<Record<string, number | string>>>(
    (result, time, index) => [
      ...result,
      {
        time,
        ...columns.reduce(
          (currentResult, column) => ({
            ...currentResult,
            [column.name]: column.values[index],
          }),
          {},
        ),
      },
    ],
    [],
  );
}

function toISOTimezoneString(date: Date, utcOffsetSeconds: number) {
  const utcOffsetHours = Math.floor(utcOffsetSeconds / 3600);
  const utcOffsetMinutes = Math.floor((utcOffsetSeconds % 3600) / 60);
  const utcOffsetHoursString = utcOffsetHours.toString().padStart(2, '0');
  const utcOffsetMinutesString = utcOffsetMinutes.toString().padStart(2, '0');
  const utcOffsetSign = utcOffsetSeconds >= 0 ? '+' : '-';
  const utcOffsetString = `${utcOffsetSign}${utcOffsetHoursString}:${utcOffsetMinutesString}`;
  return date.toISOString().replace('Z', utcOffsetString);
}

function processVariableWithValues(variable: VariableWithValues, utcOffsetSeconds: number) {
  const name = Variable[variable.variable()];
  if (name === 'sunrise' || name === 'sunset') {
    return Array.from({ length: variable.valuesInt64Length() }, (_, index) => {
      const time = new Date((Number(variable.valuesInt64(index)) + utcOffsetSeconds) * 1000);
      return toISOTimezoneString(time, utcOffsetSeconds);
    });
  }
  return Array.from(variable.valuesArray()!);
}
