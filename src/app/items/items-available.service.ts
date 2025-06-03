import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { ResponseRaw } from './item/models';
import { catchError, map, of } from 'rxjs';
import { toSignal} from '@angular/core/rxjs-interop';


class ItemsAvailableInternal {
  #http = inject(HttpClient);
  #url = "https://swapi.py4e.com/api/vehicles";
  #vehicleCount$ = this.#http.get<ResponseRaw>(this.#url).pipe(
    map(result => result.count),
    catchError((error: HttpErrorResponse) => {
      console.error("Error occured!");
      console.error(error);
      return of(-1);
    })
  );

  protected vehicleCount = toSignal(this.#vehicleCount$);

  /**
   * Constructs an array of URLs.
   * Each URL represents one item.
   * To be used for parallel fetching.
   */
  protected createUrls(vehicleCount: number): string[] {
    return [...Array(vehicleCount).keys()]
      .map(id => `https://swapi.py4e.com/api/vehicles/${id}/`);
  }
}

/**
 * Represents public API.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemsAvailableService extends ItemsAvailableInternal {

  urlsToFetch = computed(() => this.createUrls(this.vehicleCount() || -1)); // -1 -> error

}
