import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

export enum EEvents {
  IsFullScreenConfig = 'IS_FULL_SCREEN_CONFIG',
  ChangeColor = 'CHANGE_COLOR',
  ChangePalette = 'CHANGE_PALETTE',
  ChangeTexture = 'CHANGE_TEXTURE'
}

export type TEvent<T> = {
  name: string;
  value: T;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  readonly #storage: Subject<TEvent<unknown>> = new Subject();

  public emit<T>(event: TEvent<T>): void {
    this.#storage.next(event);
  }

  public on<T>(event: TEvent<T>['name']): Observable<T> {
    return this.#storage
               .pipe(
                 filter((e: TEvent<unknown>): e is TEvent<T> => e.name === event),
                 map(({ value }) => value)
               );
  }
}
