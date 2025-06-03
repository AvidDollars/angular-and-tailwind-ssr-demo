import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    class: `
      m-auto mt-8 rounded-lg border-2 h-[90vh]
      max-w-[1200px]
      sm:w-[100vw]
      md:w-[80vw]
      lg:w-[70vw]
    `
  }
})
export class AppComponent {
  title = 'form_demo';
}
