import { computed, Injectable, signal } from '@angular/core';

export type Price = number;
export type Count = number;
export type VehicleName = string;
export type CartItem = [VehicleName, [Count, Price]];

class ShoppintCartInternal {

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
    // clear content from localStorage if order was submitted
    const orderStatus = localStorage.getItem("order-status");
    if (orderStatus === "submitted") {
      localStorage.removeItem("order-status");
      localStorage.removeItem(this.localStorageKey);
      return;
    }

    const cartString = localStorage.getItem(this.localStorageKey);
    if (cartString == null) return;

    try {
      const parsedCart: Array<[string, [Count, Price]]> = JSON.parse(cartString);
      this.items.set(new Map(parsedCart));
    }

    catch (error) {
      console.error("Cannot parse cart object:");
      console.error(error);
    }
  }
}

/**
 * Represents cart's public API.
 */
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends ShoppintCartInternal {

  orderFormStatus = signal<"initial" | "invalid" | "submitting" | "submitted">("initial");

  // counts number of distinct vehicles in the cart
  distinctItemsCount = computed(() => {
    return [...this.items().values()]
      .filter(val => val[0] > 0)
      .reduce((prev, _curr) => prev + 1, 0);
  });

  // returns vehicles where condition "count > 0" is truthy
  cartItems = computed<CartItem[]>(() =>
    [...this.items()].filter(([_name, [count, _price]]) => count > 0)
  );

  // total price of all vehicles in the cart
  totalPrice = computed(() =>
    this.cartItems()
      .map(([_name, [count, price]]) => count * price)
      .reduce((prev, curr) => prev + curr, 0)
  )

  /**
   * It changes number of item count in the cart based on picked action.
   * Default action: "toggle"
   */
  changeCount(
    vehicleName: string,
    vehiclePrice: number,
    action: "toggle" | "plus" | "minus" | "delete"
  ) {

    this.items.update(cart => {
      const [currentCount, price] = cart.get(vehicleName) ?? [0, vehiclePrice];

      // setting new count
      let newCount;
      if (action === "toggle") newCount = (currentCount === 0) ? 1 : 0;
      else if (action === "plus") newCount = currentCount + 1;
      else if (action === "delete") newCount = 0;
      else if (action === "minus") newCount = (currentCount === 0) ? 0 : currentCount - 1;
      else newCount = currentCount; // redundant, but otherwise it won't compile

      cart.set(vehicleName, [newCount, price]);
      this.items.set(cart);
      this.saveCart(cart); // saves current cart's state into localStorage
      return new Map([...cart.entries()]);
    });
  }

  // Checks whether item is in the cart.
  isInCart(name: string): boolean {
    const vehicle = this.items().get(name);
    const itemsCountIdx = 0;
    if (!vehicle) return false;
    return vehicle[itemsCountIdx] > 0;
  }

  clearCart() {
    this.items.set(new Map());
    this.orderFormStatus.set("initial");
  }
}
