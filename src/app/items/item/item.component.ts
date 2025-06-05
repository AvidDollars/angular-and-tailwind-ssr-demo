import { Component, inject, input, signal } from '@angular/core';
import { Vehicle } from './models';
import { ShoppingCartService } from '../../shopping-cart.service';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  host: {
    class: `
      h-[300px]
      bg-green-800
      p-3 rounded-md border-1
      grid grid-columns-6 grid-rows-6
    `
  }
})
export class ItemComponent {
  vehicle = input.required<Vehicle>();
  shoppingCart = inject(ShoppingCartService);
  itemIsInCart = signal(false);

  toggleShoppingCard() {
    const vehicle = this.vehicle()
    this.shoppingCart.toggleItemCount(vehicle.name, vehicle.costInCredits);
    this.itemIsInCart.update(value => !value);
  }
}
