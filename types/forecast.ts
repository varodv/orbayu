export interface Forecast {
  daily: {
    time: Array<string>;
    temperature: Array<number>;
    apparent_temperature: Array<number>;
    precipitation: Array<number>;
    precipitation_probability: Array<number>;
    weather_code: Array<number>;
    uv_index: Array<number>;
    sunrise: Array<string>;
    sunset: Array<string>;
  };
  hourly: {
    time: Array<string>;
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
