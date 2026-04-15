export interface Forecast<DateType extends string | Date> {
  daily: {
    time: Array<DateType>;
    temperature: Array<number>;
    apparent_temperature: Array<number>;
    precipitation: Array<number>;
    precipitation_probability: Array<number>;
    weather_code: Array<number>;
    uv_index: Array<number>;
    sunrise: Array<DateType>;
    sunset: Array<DateType>;
  };
  hourly: {
    time: Array<DateType>;
    temperature: Array<number>;
    apparent_temperature: Array<number>;
    precipitation: Array<number>;
    precipitation_probability: Array<number>;
    weather_code: Array<number>;
    cloud_cover: Array<number>;
    wind_speed: Array<number>;
    relative_humidity: Array<number>;
    visibility: Array<number>;
  };
}
