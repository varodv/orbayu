export interface Location {
  id?: string;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  timezone?: string;
}
