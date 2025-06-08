import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, retry, shareReplay } from 'rxjs';

// Not full representation
export interface ExchangeRate {
  dev_stred: number;
  jednotka: number;
  nazev: string;
}

// Not full representation
export interface RawResponse {
  kurzy: {
    [currency: string]: ExchangeRate;
  }
};

/**
 * Provides exchange rates functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  #http = inject(HttpClient);
  errored = false;

  // constructs URL based on current date
  get #url() {
    const dateObj = new Date();
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    return `https://data.kurzy.cz/json/meny/b[6]den[${year}${month}${day}]cb[volat].js`
  }

  rawValues$: Observable<RawResponse> = this.#http.get(
    this.#url,
    { responseType: "text" }
  ).pipe(
    map(rawResponse => {
      const raw = rawResponse.slice(6).slice(0, -2) // extracts <content> from "volat(<content>)" string
      return JSON.parse(raw);
    }),
    retry(2),
    shareReplay(1), // caches HTTP response
    catchError((error: HttpErrorResponse) => {
      console.error("Exchange rates cannot be loaded:");
      console.error(error);
      this.errored = true;
      return EMPTY;
    }),
  );

  // retuns an array of all supported currencies
  allCurrencies$ = this.rawValues$.pipe(map(response => Object.keys(response.kurzy)));

  // Returns exchange rate between CZK and other specified currency.
  // If a symbol of currency is not in the list, "0" will be returned.
  getExchangeRate$(currency: string): Observable<number> {
    return this.rawValues$.pipe(
      map(response => {

        try {
          const { dev_stred, jednotka } = response.kurzy[currency];
          return dev_stred / jednotka;
        }

        catch (error) {
          if (error instanceof TypeError) return 0; // symbol is not in the list
          throw error;
        }
      }),
    )
  }
}
