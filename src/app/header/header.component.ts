import { Component, inject } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  host: {
    class: `
      h-[100px]
      border-b-2
    `
  }
})
export class HeaderComponent {
  shoppingCart = inject(ShoppingCartService);
}
