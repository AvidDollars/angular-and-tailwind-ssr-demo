import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, retry } from 'rxjs';

// Not full representation
export interface ExchangeRate {
  dev_stred: number;
  jednotka: number;
  nazev: string;
}

// Not full representation
export interface RawResponse {
  kurzy: {
    EUR: ExchangeRate;
    USD: ExchangeRate;
  }
};

/**
 * Provides exchange rates functionality.
 */
@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  #url = "https://data.kurzy.cz/json/meny/b[6]den[20211111]cb[volat].js";
  #http = inject(HttpClient);

  errored = false;

  rawValues$: Observable<RawResponse> = this.#http.get(
    this.#url,
    { responseType: "text" }
  ).pipe(
    map(rawResponse => {
      const raw = rawResponse.slice(6).slice(0, -2) // extracts <content> from "volat(<content>)" string
      return JSON.parse(raw);
    }),
    retry(2),
    catchError((error: HttpErrorResponse) => {
      console.error("Exchange rates cannot be loaded:");
      console.error(error);
      this.errored = true;
      return EMPTY;
    }),
  );

  // represents "Dollar / Euro" ratio
  dollarToEuro$ = this.rawValues$.pipe(map(
    response => {
      const exchanges = response.kurzy;
      return (exchanges.USD.dev_stred / exchanges.EUR.dev_stred);
    }
  ))
}
