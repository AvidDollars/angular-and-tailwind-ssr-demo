import { Component, inject } from '@angular/core';
import { CartItems, ShoppingCartService } from '../shopping-cart.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [JsonPipe],
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
