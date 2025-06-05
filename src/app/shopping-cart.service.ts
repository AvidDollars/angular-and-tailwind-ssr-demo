import { Injectable, signal } from '@angular/core';

type Price = number;
type Count = number;

class ShoppintCartInternal {

  // "computed" couldn't be used since "#items" is a reference
  distinctItemsCount = signal(0); // count number of distinct vehicles
  protected items = signal(new Map<string, [Count, Price]>());
  protected localStorageKey = "sw-shop-cart";

  protected constructor() {
    this.tryLoadCart();
  }

  /**
   * Stringifies cart's content. To be used in localStorage for creating persistent cart.
   */
  protected saveCart(map: Map<any, any>): void {
    const cartString = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(this.localStorageKey, cartString);
  }

  /**
   * Attempts to load cart's content from localStorage.
   */
  protected tryLoadCart(): void {
    const cartString = localStorage.getItem(this.localStorageKey);
    if (cartString == null) return;

    try {
      const parsedCart: Array<[string, [Count, Price]]> = JSON.parse(cartString);
      this.items.set(new Map(parsedCart));
      this.distinctItemsCount.set(this.countDistinctItems());
    }

    catch (error) {
      console.error("Cannot parse cart object:");
      console.error(error);
    }
  }

  // Counts number of disctinct items stored in the cart.
  protected countDistinctItems(): number {
    return [...this.items().values()]
      .filter(val => val[0] > 0)
      .reduce((prev, _curr) => prev + 1, 0);
  }
}

/**
 * Represents cart's public API.
 */
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends ShoppintCartInternal {

  /**
   * If an item present in cart -> new_count = 0.
   * If an item not present in cart -> new_count = 1.
   */
  toggleItemCount(vehicleName: string, vehiclePrice: number) {
    const cart = this.items();
    const [currentCount, price] = cart.get(vehicleName) ?? [0, vehiclePrice];
    const newCount = (currentCount === 0) ? 1 : 0;

    cart.set(vehicleName, [newCount, price]);
    this.items.set(cart);

    this.distinctItemsCount.set(this.countDistinctItems());
    this.saveCart(cart); // saves current cart's state into localStorage
  }

  // 1st yields cart content (filter: itemsCount > 0),
  // then final price is yielded for the filtered items.
  *finalResults() {
    const items = [...this.items()].filter(([_name, [count, _price]]) => count > 0);
    yield items;
    yield items
      .map(([_name, [count, price]]) => count * price)
      .reduce((prev, curr) => prev + curr, 0);
  }

  // Checks whether item is in the cart.
  isInCart(name: string): boolean {
    const vehicle = this.items().get(name);
    const itemsCountIdx = 0;
    if (!vehicle) return false;
    return vehicle[itemsCountIdx] > 0;
  }
}
