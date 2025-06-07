import { Component, inject } from '@angular/core';
import { ItemComponent } from "../item/item.component";
import { ItemsAvailableService } from '../items-available.service';
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-item-container',
  imports: [ItemComponent, LoadingSpinnerComponent],
  templateUrl: './item-container.component.html',
  styles: '',
  host: {
    class: `
      relative
      h-[79vh]
      grid gap-2
      lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1
      overflow-scroll
      p-2
    `
  }
})
export class ItemContainerComponent {
  itemsService = inject(ItemsAvailableService);
}
