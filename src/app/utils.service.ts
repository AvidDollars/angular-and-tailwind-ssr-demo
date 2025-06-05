import { Injectable } from '@angular/core';

/**
 * Provides injectable utilities.
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /**
   * Simulates Pythons "range" function.
   *
   * To be used in templates (service must be injected first):
   *
   *    @for (num of range({stop: 5}); track num) {
   *        <content>
   *    }
   */
  *range(config: { start?: number, step?: number, stop: number }): Generator<number> {
    let { start, step, stop } = config;
    start = start ?? 0;

    if (step == undefined) {
      step = (start < stop) ? 1 : -1;
    }

    if (step === 0) throw Error("step === 0... wtf, really?");

    const predicate = (step > 0)
      ? (num: number) => num < config.stop
      : (num: number) => num > config.stop;

    while (predicate(start)) {
      yield start;
      start += step;
    }
  }
}
