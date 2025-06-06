import { Component, inject } from '@angular/core';
import { CartItems, ShoppingCartService } from '../shopping-cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [CurrencyPipe],
  templateUrl: './payment.component.html',
  styles: ``
})
export class PaymentComponent {
  #cartContent = inject(ShoppingCartService).finalResults();
  items!: CartItems[];
  price!: number;

  ngOnInit() {
    const [items, price] = this.#cartContent;
    this.items = items;
    this.price = price;
  }
}
