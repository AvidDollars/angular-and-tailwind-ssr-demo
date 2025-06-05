import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ResponseRaw, VehicleRaw } from './item/models';
import { catchError, Observable, expand, EMPTY, reduce, finalize, map } from 'rxjs';
import { Vehicle } from './item/models';
import { toSignal } from '@angular/core/rxjs-interop';

class ItemsAvailableInternal {
  #http = inject(HttpClient);
  protected url = "https://swapi.py4e.com/api/vehicles";

  // status of items fetching from the API:
  fetchingStatus = signal<"active" | "inactive" | "fetched" | "errored">("inactive");

  /**
   * Fetches single page of vehicles.
   */
  protected getRawResponse$(url: string): Observable<ResponseRaw> {
    return this.#http.get<ResponseRaw>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error furing fetching "${url}" occurred:`);
        console.error(error);
        return EMPTY;
      })
    );
  }

  /**
   * Recursively fetches paginated API until '"next": null' is reached.
   */
  protected get fetchAllVehicles$(): Observable<VehicleRaw[]> {
    this.fetchingStatus.set("active");

    return this.getRawResponse$(this.url).pipe(
      expand(response => (response.next) ? this.getRawResponse$(response.next!) : EMPTY),
      reduce((previous, current) => [...previous, ...current.results], [] as VehicleRaw[]),
      finalize(() => this.fetchingStatus.set("fetched")),
    )
  }

  /**
   * Only properly pared vehicles will be rendered.
   */
  protected parsedVehicles$ = this.fetchAllVehicles$.pipe(
    map(rawVehicles => rawVehicles
      .map(rawVehicle => new Vehicle(rawVehicle))
      .filter(vehicle => {
        if (!vehicle.isProperlyParsed) {
          console.warn("Improperly parsed vehicle (will be discarded):");
          console.warn(vehicle);
        }
        return vehicle.isProperlyParsed;
      })
    ),
  );
}

/**
 * Represents public API.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemsAvailableService extends ItemsAvailableInternal {

  allVehicles = toSignal(this.parsedVehicles$);

}
