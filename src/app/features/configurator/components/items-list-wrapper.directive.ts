import { ComponentRef, DestroyRef, Directive, EventEmitter, inject, Input, Output, Type, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
})
export abstract class ItemsListWrapper<TItem, TComponent> {
  protected viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  @Input('items')
  set items(value: Array<TItem>) {
    if (!Array.isArray(value)) return;

    this.updateItems(value);
  }

  @Output('itemChange')
  public readonly itemChange: EventEmitter<TItem> = new EventEmitter();

  abstract updateItems(items: Array<TItem>): void;

  protected listenItemChange(
    itemRefs: Array<ComponentRef<TComponent>>,
    getChangeEmitter: (itemRef: ComponentRef<TComponent>) => EventEmitter<TItem>
  ): void {
    itemRefs.forEach((itemRef) => {

      getChangeEmitter(itemRef)
        .pipe(
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe((item) => {
          this.itemChange.emit(item);
        });
    });
  }

  protected generateItemsRefs(
    items: Array<TItem>,
    getComponent: () => Type<TComponent>
  ): Array<ComponentRef<TComponent>> {
    return items.map(() => this.viewContainerRef.createComponent(getComponent()));
  }
}
