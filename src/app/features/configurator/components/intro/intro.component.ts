import { NgForOf, NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TActionButton } from '../../../../core/types/action-button.type';
import { INTRO_ACTIONS, INTRO_CONFIG } from './constants/intro-configuration.constant';
import { TIntro } from './types/intro.type';

@Component({
  selector: 'app-configurator-intro',
  standalone: true,
  host: {
    class: 'flex items-center'
  },
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    UpperCasePipe
  ],
  styles: [`
    .shimmer {
      background: linear-gradient(-45deg, theme('colors.brand') 35%, theme('colors.white') 50%, theme('colors.brand') 60%), theme('colors.brand');
      @apply text-transparent bg-no-repeat bg-clip-text animate-textShimmer;
    }
  `],
  template: `
    <div class="grid max-w-3xl grid-cols-1 lg:grid-cols-2">
      <h1 class="min-w-min text-6xl sm:text-[13vw] xl:text-[152px] font-nunito leading-none tracking-wide font-bold uppercase italic
                 shimmer">
        {{ intro.title }}
      </h1>

      <div class="place-self-end flex gap-4 flex-col lg:-translate-x-1/3 max-w-xs lg:max-w-md">
        <p [innerHTML]="intro.subtitle"></p>

        <div *ngIf="actions.length > 0" class="grid lg:grid-cols-2">
          <ng-container *ngFor="let action of actions">
            <a class="pointer-events-auto" [routerLink]="action.link">
              {{ action.label | uppercase }}
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export default class ConfiguratorIntroComponent {
  public readonly intro: TIntro = inject(INTRO_CONFIG);
  public readonly actions: Array<TActionButton> = inject(INTRO_ACTIONS);
}
