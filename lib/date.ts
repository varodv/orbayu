import { getTimezoneOffset } from 'date-fns-tz';

export function convertToLocalDate(date: string | Date, timezone: string) {
  const result = new Date(date);
  const timezoneOffset = getTimezoneOffset(timezone, result);
  const localOffset = result.getTimezoneOffset() * 60 * 1000 * -1;
  result.setMilliseconds(result.getMilliseconds() + timezoneOffset - localOffset);
  return result;
}
