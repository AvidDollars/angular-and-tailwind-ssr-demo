import { Component, inject } from '@angular/core';
import { CartItem, ShoppingCartService } from '../shopping-cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { ExchangeRatesService } from '../exchange-rates.service';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, ReactiveFormsModule, AsyncPipe],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {

  #cart = inject(ShoppingCartService);
  exchangeRates = inject(ExchangeRatesService);
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
