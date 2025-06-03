import { Component, inject } from '@angular/core';
import { ItemComponent } from "../item/item.component";
import { ItemsAvailableService } from '../items-available.service';

@Component({
  selector: 'app-item-container',
  imports: [ItemComponent],
  templateUrl: './item-container.component.html',
  styleUrl: './item-container.component.css',
  host: {
    class: `
      h-[79vh]
      grid grid-cols-4 gap-2
      overflow-scroll
      p-2
    `
  }
})
export class ItemContainerComponent {

  itemsService = inject(ItemsAvailableService);

}
