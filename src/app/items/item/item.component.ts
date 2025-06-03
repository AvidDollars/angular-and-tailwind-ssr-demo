import { Component, input } from '@angular/core';

@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
  host: {
    class: `
      h-[300px]
      bg-green-800
      p-2
    `
  }
})
export class ItemComponent {
  url = input.required<string>();
}
