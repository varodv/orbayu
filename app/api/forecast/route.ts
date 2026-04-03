import type { VariableWithValues } from '@openmeteo/sdk/variable-with-values';
import type { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { Unit } from '@openmeteo/sdk/unit';
import { Variable } from '@openmeteo/sdk/variable';
import { NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';
import { z } from 'zod';

const queryParamsSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  altitude: z.coerce.number().optional(),
  timezone: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedQueryParams = queryParamsSchema.safeParse(queryParams);

    if (!parsedQueryParams.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: z.flattenError(parsedQueryParams.error) },
        { status: 400 },
      );
    }

    const { latitude, longitude, altitude, timezone } = parsedQueryParams.data;

    const url = 'https://api.open-meteo.com/v1/forecast';
    const params = {
      latitude,
      longitude,
      ...(altitude && { elevation: altitude }),
      ...(timezone && { timezone }),
      minutely_15: [
        'temperature_2m',
        'apparent_temperature',
        'precipitation',
        'wind_speed_10m',
        'weather_code',
        'relative_humidity_2m',
      ],
      hourly: ['precipitation_probability', 'cloud_cover'],
      daily: ['uv_index_max', 'sunrise', 'sunset'],
      forecast_days: '1',
    };
    const [response] = await fetchWeatherApi(url, params);

    const result = {
      minutely_15: processVariablesWithTime(response.minutely15()!),
      hourly: processVariablesWithTime(response.hourly()!),
      daily: processVariablesWithTime(response.daily()!),
    };

    return NextResponse.json(result);
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
      (_, index) => new Date((Number(variables.time()) + index * variables.interval()) * 1000),
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
    return Array.from(
      { length: variable.valuesInt64Length() },
      (_, index) => new Date(Number(variable.valuesInt64(index)) * 1000),
    );
  }
  return {
    unit: Unit[variable.unit()],
    values: [...variable.valuesArray()!],
  };
}
