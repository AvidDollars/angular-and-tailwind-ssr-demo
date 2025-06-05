import { Component, inject, input, signal } from '@angular/core';
import { Vehicle } from './models';
import { ShoppingCartService } from '../../shopping-cart.service';
import { UtilsService } from '../../utils.service';
import { ItemsAvailableService } from '../items-available.service';
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
export class ItemComponent {
  vehicle = input.required<Vehicle>();
  shoppingCart = inject(ShoppingCartService);
  range = inject(UtilsService).range;
  itemIsInCart = signal(false);

  rows = inject(ItemsAvailableService).paramCount;
  grid_rows_count = `grid-rows-${this.rows + 1}`; // +1 -> includes header

  toggleShoppingCard() {
    const vehicle = this.vehicle()
    this.shoppingCart.toggleItemCount(vehicle.name, vehicle.costInCredits);
    this.itemIsInCart.update(value => !value);
  }
}
