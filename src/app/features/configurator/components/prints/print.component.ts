import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TPrintSource } from '../../types/print-source.type';

@Component({
  selector: 'app-print',
  standalone: true,
  host: {
    class: 'm-1'
  },
  template: `
    <img
      [ngSrc]="print"
      alt="print"
      class="saturate-50 hover:saturate-100 max-w-[50px] max-h-[50px] cursor-pointer focus:ring hover:scale-105 focus:scale-105 transition"
      [width]="50"
      [height]="50"
      (click)="printChange.emit(print)"
    >
  `,
  imports: [
    NgOptimizedImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent {
  @Input({
    required: true
  })
  public print!: TPrintSource;

  @Output()
  public readonly printChange: EventEmitter<TPrintSource> = new EventEmitter();
}
