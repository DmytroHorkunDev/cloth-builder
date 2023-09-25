import { Location, NgOptimizedImage } from '@angular/common';
import { AfterContentInit, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EEvents, EventBusService } from '../../../../core/services/event-bus.service';
import { TPaletteColor } from '../../types/palette-color.type';
import { TPrintSource } from '../../types/print-source.type';
import { PaletteDirective } from '../palette/palette.directive';
import { PrintsDirective } from '../prints/prints.directive';

@Component({
  selector: 'app-configurator-controllers',
  standalone: true,
  host: {
    class: 'block p-8 lg:p-12 h-full w-full'
  },
  imports: [
    PaletteDirective,
    RouterLink,
    PrintsDirective,
    NgOptimizedImage
  ],
  styles: [`
    .top-layer {
      @apply pointer-events-auto;
    }
  `],
  template: `
    <div class="grid 
                h-full
                grid-cols-2
                lg:grid-cols-3
                grid-rows-3
                gap-4
                lg:gap-10
    ">
      <div class="top-layer logo">
        <img class="max-w-[64px] max-h-[64px]" [ngSrc]="logo" [width]="100" [height]="100" alt="logo">
      </div>

      <div class="top-layer col-start-1 row-start-2 flex flex-col
                  md:row-start-3 md:flex-row md:self-end"
      >
        <ng-template
          prints
          [items]="prints"
          (itemChange)="changePrint($event)"
        />
      </div>

      <div class="top-layer col-start-2 row-start-2 flex justify-self-end flex-col
                  md:row-start-3 md:col-start-2 md:justify-self-center md:flex-row md:self-end"

      >
        <ng-template
          palette
          [items]="palette"
          (itemChange)="changeColor($event)"
        />
      </div>

      <div class="top-layer justify-self-end self-end col-start-1 row-start-3
                  md:col-start-3 md:row-start-1 md:self-start"
      >
        <a class="uppercase" (click)="goBack()"> go back </a>
      </div>

      <div class="top-layer self-end col-start-2 row-start-3
                  md:col-start-3 md:justify-self-end"
      >
        <a disabled class="uppercase"> download </a>
      </div>

    </div>
  `
})
export default class ConfiguratorControllersComponent implements AfterContentInit {
  readonly #location: Location = inject(Location);
  readonly #eventBus: EventBusService = inject(EventBusService);

  #palette: Array<TPaletteColor> = [];

  @Input()
  public get palette(): Array<TPaletteColor> {
    return this.#palette;
  }

  public set palette(value: Array<TPaletteColor>) {
    this.#palette = value;
  }

  @Input()
  public prints: Array<TPrintSource> = [];

  @Input()
  public logo!: string;

  public goBack(): void {
    this.#location.back();
  }

  public ngAfterContentInit(): void {
    this.#setRandomColor();
  }

  public changeColor(color: TPaletteColor): void {
    this.#eventBus.emit({
      name: EEvents.ChangeColor,
      value: color
    });
  };


  public changePrint(print: TPrintSource): void {
    this.#eventBus.emit({
      name: EEvents.ChangeTexture,
      value: print
    });
  };

  public download(): void {

  }

  #setRandomColor(): void {
    const index = Math.floor(Math.random() * this.palette.length);
    const color = this.palette[index];

    this.changeColor(color);
  }
}
