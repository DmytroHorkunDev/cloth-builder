import { Directive } from '@angular/core';
import { TPrintSource } from '../../types/print-source.type';
import { ItemsListWrapper } from '../items-list-wrapper.directive';
import { PrintComponent } from './print.component';

@Directive({
  selector: '[prints]',
  standalone: true,
})
export class PrintsDirective extends ItemsListWrapper<TPrintSource, PrintComponent> {
  updateItems(prints: Array<TPrintSource>): void {
    this.viewContainerRef.clear();

    const refs = this.generateItemsRefs(prints, () => PrintComponent);

    refs.forEach((printRef, index) => {
      const print = prints[index];
      printRef.setInput('print', print);

    });

    this.listenItemChange(refs, (colorRef) => colorRef.instance.printChange);
  }
}
