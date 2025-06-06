import { ItemContainerComponent } from './items/item-container/item-container.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    component: ItemContainerComponent,
  },
  { // lazy loading
    path: "payment",
    loadComponent: () => import('./payment/payment.component').then(module => module.PaymentComponent),
  }
];
