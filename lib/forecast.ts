import type { DailyForecast } from '@/types/forecast';

export interface ComputedForecast {
  temperature: {
    value: number;
    range: keyof typeof TEMPERATURE_SCALE;
  };
  temperature_delta: {
    value: number;
    range: keyof typeof TEMPERATURE_DELTA_SCALE;
  };
  precipitation: {
    value: number;
    range: keyof typeof PRECIPITATION_SCALE;
  };
  precipitation_probability: {
    value: number;
    range: keyof typeof PRECIPITATION_PROBABILITY_SCALE;
  };
  snowfall: {
    value: number;
    range: keyof typeof SNOWFALL_SCALE;
  };
  wind_speed: {
    value: number;
    range: keyof typeof WIND_SPEED_SCALE;
  };
  uv_index: {
    value: number;
    range: keyof typeof UV_INDEX_SCALE;
  };
}

type Scale = Record<string, [number, number]>;

export const TEMPERATURE_SCALE = {
  EXTREME_COLD: [-Infinity, -10],
  VERY_COLD: [-10, 0],
  COLD: [0, 7],
  COOL: [7, 13],
  MILD: [13, 18],
  COMFORTABLE: [18, 24],
  WARM: [24, 28],
  HOT: [28, 32],
  VERY_HOT: [32, 38],
  EXTREME_HEAT: [38, Infinity],
} satisfies Scale;

export const TEMPERATURE_DELTA_SCALE = {
  STABLE: [0, 3],
  SLIGHT: [3, 6],
  MILD: [6, 10],
  LARGE: [10, 15],
  EXTREME: [15, Infinity],
} satisfies Scale;

export const PRECIPITATION_SCALE = {
  NONE: [0, 0.1],
  LIGHT: [0.1, 4],
  MODERATE: [4, 10],
  HEAVY: [10, 20],
  EXTREME: [20, Infinity],
} satisfies Scale;

export const PRECIPITATION_PROBABILITY_SCALE = {
  NONE: [0, 20],
  LOW: [20, 40],
  MEDIUM: [40, 60],
  HIGH: [60, 80],
  ABSOLUTE: [80, Infinity],
} satisfies Scale;

export const SNOWFALL_SCALE = {
  NONE: [0, 0.1],
  LIGHT: [0.1, 0.5],
  MODERATE: [0.5, 2],
  HEAVY: [2, 5],
  EXTREME: [5, Infinity],
} satisfies Scale;

export const WIND_SPEED_SCALE = {
  NONE: [0, 5],
  LIGHT: [5, 30],
  MODERATE: [30, 50],
  HEAVY: [50, 75],
  EXTREME: [75, Infinity],
} satisfies Scale;

export const UV_INDEX_SCALE = {
  LOW: [0, 3],
  MEDIUM: [3, 6],
  HIGH: [6, 8],
  VERY_HIGH: [8, 11],
  EXTREME: [11, Infinity],
} satisfies Scale;

export function computeForecast(data: DailyForecast<string | Date>): ComputedForecast {
  return {
    temperature: computeTemperature(data),
    temperature_delta: computeTemperatureDelta(data),
    precipitation: computePrecipitation(data),
    precipitation_probability: computePrecipitationProbability(data),
    snowfall: computeSnowfall(data),
    wind_speed: computeWindSpeed(data),
    uv_index: computeUVIndex(data),
  };
}

function computeTemperature(data: DailyForecast<string | Date>): ComputedForecast['temperature'] {
  const meanTemperature
    = data.hourly.reduce((result, item) => result + item.apparent_temperature, 0)
      / data.hourly.length;
  return {
    value: meanTemperature,
    range: getRange(meanTemperature, TEMPERATURE_SCALE),
  };
}

function getRange<ScaleType extends Scale>(value: number, scale: ScaleType) {
  return Object.entries(scale).find(
    ([_, domain]) => domain[0] <= value && domain[1] > value,
  )?.[0] as keyof ScaleType;
}

function computeTemperatureDelta(
  data: DailyForecast<string | Date>,
): ComputedForecast['temperature_delta'] {
  const minTemperature = Math.min(...data.hourly.map(item => item.apparent_temperature));
  const maxTemperature = Math.max(...data.hourly.map(item => item.apparent_temperature));
  const temperatureDelta = maxTemperature - minTemperature;
  return {
    value: temperatureDelta,
    range: getRange(temperatureDelta, TEMPERATURE_DELTA_SCALE),
  };
}

function computePrecipitation(
  data: DailyForecast<string | Date>,
): ComputedForecast['precipitation'] {
  const maxPrecipitation = Math.max(...data.hourly.map(item => item.precipitation));
  return {
    value: maxPrecipitation,
    range: getRange(maxPrecipitation, PRECIPITATION_SCALE),
  };
}

function computePrecipitationProbability(
  data: DailyForecast<string | Date>,
): ComputedForecast['precipitation_probability'] {
  const maxPrecipitationProbability = Math.max(
    ...data.hourly.map(item => item.precipitation_probability),
  );
  return {
    value: maxPrecipitationProbability,
    range: getRange(maxPrecipitationProbability, PRECIPITATION_PROBABILITY_SCALE),
  };
}

function computeSnowfall(data: DailyForecast<string | Date>): ComputedForecast['snowfall'] {
  const maxSnowfall = Math.max(...data.hourly.map(item => item.snowfall));
  return {
    value: maxSnowfall,
    range: getRange(maxSnowfall, SNOWFALL_SCALE),
  };
}

function computeWindSpeed(data: DailyForecast<string | Date>): ComputedForecast['wind_speed'] {
  const maxWindSpeed = Math.max(...data.hourly.map(item => item.wind_speed));
  return {
    value: maxWindSpeed,
    range: getRange(maxWindSpeed, WIND_SPEED_SCALE),
  };
}

function computeUVIndex(data: DailyForecast<string | Date>): ComputedForecast['uv_index'] {
  return {
    value: data.uv_index,
    range: getRange(data.uv_index, UV_INDEX_SCALE),
  };
}
