export interface Forecast<DateType extends string | Date> {
  daily: Array<{
    time: DateType;
    temperature: number;
    apparent_temperature: number;
    precipitation: number;
    precipitation_probability: number;
    weather_code: number;
    uv_index: number;
    sunrise: DateType;
    sunset: DateType;
    hourly: Array<{
      time: DateType;
      temperature: number;
      apparent_temperature: number;
      precipitation: number;
      precipitation_probability: number;
      weather_code: number;
      cloud_cover: number;
      wind_speed: number;
      relative_humidity: number;
      visibility: number;
    }>;
  }>;
}
