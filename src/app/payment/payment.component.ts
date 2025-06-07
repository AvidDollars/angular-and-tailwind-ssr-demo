import { Component, inject } from '@angular/core';
import { CartItem, ShoppingCartService } from '../shopping-cart.service';
import { CurrencyPipe } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {

  #cart = inject(ShoppingCartService);
  cartItems = this.#cart.cartItems;
  totalPrice = this.#cart.totalPrice;
  itemsCount = this.#cart.distinctItemsCount;

  orderForm = new FormGroup({
    name: new FormControl(""),
    street: new FormControl(""),
    city: new FormControl(""),
    postal_code: new FormControl(""),
    email: new FormControl(""),
    phone: new FormControl(""),
  })

  changeCount(item: CartItem, action: "minus" | "plus" | "delete") {
    this.#cart.changeCount(item[0], item[1][1], action);
  }
}
