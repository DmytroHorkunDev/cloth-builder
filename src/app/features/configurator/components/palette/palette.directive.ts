import { Directive } from '@angular/core';
import { TPaletteColor } from '../../types/palette-color.type';
import { ItemsListWrapper } from '../items-list-wrapper.directive';
import PaletteColorComponent from './palette-color.component';

@Directive({
  selector: '[palette]',
  standalone: true,
})
export class PaletteDirective extends ItemsListWrapper<TPaletteColor, PaletteColorComponent> {
  public updateItems(colors: Array<TPaletteColor>): void {
    this.viewContainerRef.clear();

    const refs = this.generateItemsRefs(colors, () => PaletteColorComponent);

    refs.forEach((colorRef, index) => {
      const color = colors[index];
      colorRef.setInput('color', color);

    });

    this.listenItemChange(refs, (colorRef) => colorRef.instance.colorChange);
  }
}
