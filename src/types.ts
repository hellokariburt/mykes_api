export const ALL_BOROUGHS = [
  "manhattan",
  "queens",
  "staten-island",
  "bronx",
  "brooklyn",
] as const;

export const ALL_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export interface MicQueryParams {
  day: string[];
  borough: string[];
  limit: number;
  offset: number;
  start_time: string;
  cost: string;
}
