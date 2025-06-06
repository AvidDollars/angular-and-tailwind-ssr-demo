import { ItemContainerComponent } from './items/item-container/item-container.component';
import { Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  {
    path: "",
    component: ItemContainerComponent,
  },
  {
    path: "payment",
    component: PaymentComponent,
  }
];
