import { Component, inject } from '@angular/core';
import { CartItem, ShoppingCartService } from '../shopping-cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  #cart = inject(ShoppingCartService);
  cartItems = this.#cart.cartItems;
  totalPrice = this.#cart.totalPrice;

  changeCount(item: CartItem, action: "minus" | "plus" | "delete") {
    this.#cart.changeCount(item[0], item[1][1], action);
  }
}
