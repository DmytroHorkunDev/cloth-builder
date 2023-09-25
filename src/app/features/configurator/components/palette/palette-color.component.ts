import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TPaletteColor } from '../../types/palette-color.type';

@Component({
  selector: 'app-palette-color',
  standalone: true,
  host: {
    class: 'm-1'
  },
  template: `
    <div
      [ngStyle]="{
        'background-color': color
      }"
      (click)="colorChange.emit(color)"
      class="w-8 h-8 rounded-full border-2 cursor-pointer border-white focus:ring hover:scale-105 focus:scale-105 transition"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgStyle
  ]
})
export default class PaletteColorComponent {
  @Input({
    required: true
  })
  public color!: TPaletteColor;


  @Output()
  public readonly colorChange: EventEmitter<TPaletteColor> = new EventEmitter();
}
