/**
 * Represents raw response from the API.
 */
type NextUrl = string;
export interface ResponseRaw {
  count: number;
  next: NextUrl | null;
  results: VehicleRaw[];
}

/**
 * Represents the shape of vehicle fetched from the URL.
 */
export interface VehicleRaw {
  cost_in_credits: string; // to be parsed to number
  name: string;
  manufacturer: string;
  length: string; // to be parsed to number
}

/**
 * Represents the result of parsing raw vehicle
 */
export class Vehicle {
  costInCredits: number;
  name: string;
  manufacturer: string;
  length: number;

  constructor(vehicle: VehicleRaw) {
    this.costInCredits = Number(vehicle.cost_in_credits);
    this.name = vehicle.name;
    this.manufacturer = vehicle.manufacturer;
    this.length = parseFloat(vehicle.length);
  }

  get isProperlyParsed(): boolean {
    return !isNaN(this.costInCredits) && !isNaN(this.length);
  }
}
