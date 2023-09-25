import { distinctUntilChanged, fromEvent, map, Observable, throttleTime } from 'rxjs';

export const viewport$: Observable<number> = fromEvent(window, 'resize')
  .pipe(
    throttleTime(600),
    distinctUntilChanged(),
    map(() => window.innerWidth)
  );
