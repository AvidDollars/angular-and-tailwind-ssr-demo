import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: {
    class: `
      m-auto rounded-lg mb-4
      max-w-[1200px]
      sm:w-[100vw]
      md:w-[80vw] md:mt-4 md:border-2
      lg:w-[70vw] md:mt-8 md:border-2
    `
  }
})
export class AppComponent {
  title = 'form_demo';
}
