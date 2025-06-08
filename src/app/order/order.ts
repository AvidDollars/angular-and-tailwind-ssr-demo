import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { CartItem, ShoppingCartService } from '../shopping-cart.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExchangeRatesService } from '../exchange-rates.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { concatMap, map } from 'rxjs';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe, ReactiveFormsModule, LoadingSpinnerComponent, FormsModule, AsyncPipe],
  templateUrl: './order.component.html',
})
export class PaymentComponent implements OnDestroy {

  tax = 0.21;

  // CART
  #cart = inject(ShoppingCartService);
  cartItems = this.#cart.cartItems;
  totalPrice = this.#cart.totalPrice; // includes tax
  noTaxPrice = computed(() => this.totalPrice() / (1 + this.tax));
  itemsCount = this.#cart.distinctItemsCount;

  // FORM STATE
  #text = "create order"
  formText = signal(this.#text);
  timeout?: NodeJS.Timeout; // error message in the submit button
  formStatus = this.#cart.orderFormStatus;

  // EXHCHANGE RATE
  exchangeRates = inject(ExchangeRatesService);
  allCurrencies$ = this.exchangeRates.allCurrencies$;
  selectedCurrency = signal("");
  valueInSelectedCurrency$ = toObservable(this.selectedCurrency).pipe(
    concatMap(value => this.exchangeRates.getExchangeRate$(value)),
    map(value => this.totalPrice() / value),
  );

  // FORM OBJECT
  orderForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    street: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    postal_code: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(6),
      Validators.pattern("[0-9]*"),
    ]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern("^[- +()0-9]+$"),
    ]),
  })

  // If the form is not submitted, it changes the count of an items in the cart.
  changeCount(item: CartItem, action: "minus" | "plus" | "delete") {
    if (this.formStatus() === "submitted") return;
    this.#cart.changeCount(item[0], item[1][1], action);
  }

  // simulates form submission
  submitForm() {
    if (this.orderForm.invalid) {
      this.formText.set("some of the fields are invalid");
      this.formStatus.set("invalid");

      this.timeout = setTimeout(() => {
        this.formText.set(this.#text);
        this.formStatus.set("initial");
      }, 1000);
      return;
    }

    else {
      this.formStatus.set("submitting");

      this.timeout = setTimeout(() => {
        this.formText.set(this.#text);
        this.formStatus.set("submitted");
        localStorage.setItem("order-status", "submitted");
      }, 1000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timeout);
  }
}
