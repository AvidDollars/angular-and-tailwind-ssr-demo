import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Vehicle } from './models';
import { ShoppingCartService } from '../../shopping-cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-item',
  imports: [CurrencyPipe],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  host: {
    class: `
      h-[300px]
      bg-green-800
      p-3 rounded-md border-1
      flex flex-col
    `
  }
})
export class ItemComponent implements OnInit {
  vehicle = input.required<Vehicle>();
  shoppingCart = inject(ShoppingCartService);
  itemIsInCart = signal(false);

  ngOnInit(): void {
    if (this.shoppingCart.isInCart(this.vehicle().name)) {
      this.itemIsInCart.set(true);
    }
  }

  toggleShoppingCard() {
    const vehicle = this.vehicle()
    this.shoppingCart.changeCount(vehicle.name, vehicle.costInCredits);
    this.itemIsInCart.update(value => !value);
  }
}
