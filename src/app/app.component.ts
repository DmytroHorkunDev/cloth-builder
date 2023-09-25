import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  host: {
    class: 'overflow-hidden select-none'
  },
  imports: [RouterOutlet],
  template: `
    <div class="relative">
      <router-outlet/>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
