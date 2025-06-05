import { Component, inject } from '@angular/core';
import { ItemComponent } from "../item/item.component";
import { ItemsAvailableService } from '../items-available.service';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";


@Component({
  selector: 'app-item-container',
  imports: [ItemComponent, AsyncPipe, LoadingSpinnerComponent],
  templateUrl: './item-container.component.html',
  styleUrl: './item-container.component.css',
  host: {
    class: `
      relative
      h-[79vh]
      grid grid-cols-3 gap-2
      overflow-scroll
      p-2
    `
  }
})
export class ItemContainerComponent {
  itemsService = inject(ItemsAvailableService);
}
