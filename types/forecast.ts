import type {
  PRECIPITATION_PROBABILITY_SCALE,
  PRECIPITATION_SCALE,
  SNOWFALL_SCALE,
  TEMPERATURE_DELTA_SCALE,
  TEMPERATURE_SCALE,
  UV_INDEX_SCALE,
  WIND_SPEED_SCALE,
} from '@/lib/forecast';

export interface Forecast<DateType extends string | Date> {
  daily: Array<DailyForecast<DateType>>;
}

export interface DailyForecast<DateType extends string | Date> {
  time: DateType;
  temperature: number;
  apparent_temperature: number;
  precipitation: number;
  precipitation_probability: number;
  snowfall: number;
  weather_code: number;
  uv_index: number;
  sunrise: DateType;
  sunset: DateType;
  hourly: Array<HourlyForecast<DateType>>;
}

export interface HourlyForecast<DateType extends string | Date> {
  time: DateType;
  temperature: number;
  apparent_temperature: number;
  precipitation: number;
  precipitation_probability: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  wind_speed: number;
  relative_humidity: number;
  visibility: number;
}

export interface ComputedForecast<DateType extends string | Date> {
  time: DateType;
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
