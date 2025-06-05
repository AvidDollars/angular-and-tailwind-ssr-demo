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
  crew: string;
  cargo_capacity: string;
  vehicle_class: string;
}

/**
 * Represents the result of parsing raw vehicle
 */
export class Vehicle {
  costInCredits: number;
  name: string;

  // table's <td> elements:
  manufacturer: string;
  length: number;
  crew: string;
  cargoCapacity: string;
  vehicleClass: string;

  constructor(vehicle: VehicleRaw) {
    this.costInCredits = Number(vehicle.cost_in_credits);
    this.name = vehicle.name;
    this.manufacturer = vehicle.manufacturer;
    this.length = parseFloat(vehicle.length);
    this.crew = vehicle.crew;
    this.cargoCapacity = vehicle.cargo_capacity;
    this.vehicleClass = vehicle.vehicle_class;
  }

  get isProperlyParsed(): boolean {
    return !isNaN(this.costInCredits) && !isNaN(this.length);
  }

  trimIfLong(text: string, maxLength: number = 20) {
    const length = text.length;
    return (length > maxLength) ? `${text.slice(0, maxLength - 3)}...` : text;
  }

  // To be used for table construction in a template.
  // Each yielded tuple represents <td> HTML tag.
  *paramRow(): Generator<[string, string | number]> {
    yield ["manufacturer", this.trimIfLong(this.manufacturer)];
    yield ["length (m)", this.length];
    yield ["crew", this.crew];
    yield ["cargo capacity", this.cargoCapacity];
    yield ["class", this.vehicleClass];
  }
}
