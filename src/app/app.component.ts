import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="main">
      <div class="content">
        <router-outlet />
      </div>
    </main>
  `,
  styles: ``
})
export class AppComponent {
}
