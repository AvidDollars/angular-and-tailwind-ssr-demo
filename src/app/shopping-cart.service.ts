import { Injectable, signal } from '@angular/core';

type Price = number;
type Count = number;

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  #items = signal(new Map<string, [Count, Price]>());

  // "computed" couldn't be used since "#items" is a reference
  distinctItemsCount = signal(0); // count number of distinct vehicles

  /**
   * If an item present in cart -> new_count = 0.
   * If an item not present in cart -> new_count = 1.
   */
  toggleItemCount(vehicleName: string, vehiclePrice: number) {
    const cart = this.#items();
    const [currentCount, price] = cart.get(vehicleName) ?? [0, vehiclePrice];
    const newCount = (currentCount === 0) ? 1 : 0;

    cart.set(vehicleName, [newCount, price]);
    this.#items.set(cart);

    const distinctItems = [...this.#items().values()]
      .filter(val => val[0] > 0)
      .reduce((prev, _curr) => prev + 1, 0);

    this.distinctItemsCount.set(distinctItems);
  }

  // 1st yields cart content (filter: itemsCount > 0),
  // then final price is yielded for the filtered items.
  *finalResults() {
    const items = [...this.#items()].filter(([_name, [count, _price]]) => count > 0);
    yield items;
    yield items
      .map(([_name, [count, price]]) => count * price)
      .reduce((prev, curr) => prev + curr, 0);
  }
}
