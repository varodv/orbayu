import type { VariableWithValues } from '@openmeteo/sdk/variable-with-values';
import type { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { Unit } from '@openmeteo/sdk/unit';
import { Variable } from '@openmeteo/sdk/variable';
import { NextResponse } from 'next/server';
import { fetchWeatherApi } from 'openmeteo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitudeParam = searchParams.get('latitude');
    const longitudeParam = searchParams.get('longitude');
    const altitudeParam = searchParams.get('altitude');
    const timezone = searchParams.get('timezone');

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

    let altitude: number | undefined;
    if (altitudeParam) {
      const parsedAltitudeParam = Number.parseFloat(altitudeParam);
      if (!Number.isNaN(parsedAltitudeParam)) {
        altitude = parsedAltitudeParam;
      }
    }

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
