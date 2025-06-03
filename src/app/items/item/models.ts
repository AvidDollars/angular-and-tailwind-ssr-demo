/**
 * Represents raw response from the API
 */
type NextUrl = string;
export interface ResponseRaw {
  count: number;
  next: NextUrl | null;
  results: VehicleRaw[];
}

/**
 * Represents the shape of vehicle fetched from the URL
 */
export interface VehicleRaw {
  const_in_credits: string;
  name: string;
  manufacturer: string;
  length: string;
}

/**
 * Represents parsed raw vehicle
 */
export interface VehicleParsed {
  const_in_credits: number;
  name: string;
  manufacturer: string;
  length: number;
}
