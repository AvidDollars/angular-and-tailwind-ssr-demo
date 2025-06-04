import { Component, input } from '@angular/core';
import { Vehicle } from './models';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  host: {
    class: `
      h-[300px]
      bg-green-800
      p-2 rounded-md
    `
  }
})
export class ItemComponent {
  vehicle = input.required<Vehicle>();
}
