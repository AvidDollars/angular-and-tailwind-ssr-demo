import { Component, inject } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.component.html',
  styles: '',
  host: {
    class: `
      flex
      h-[100px]
      border-b-2
      `
  }
})
export class HeaderComponent {
  shoppingCart = inject(ShoppingCartService);
  router = inject(Router);

  // conditionally renders content if user is on "/payment" endpoint
  paymentUrl$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map(event => event.url === "/payment" ? true : false),
  )
}
