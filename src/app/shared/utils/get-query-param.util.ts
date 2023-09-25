import { assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';

export const getQueryParam = (
  param: string,
  defaultParam?: string,
  route?: ActivatedRoute): Observable<string> => {
  if (!route) {
    assertInInjectionContext(getQueryParam);
    route = inject(ActivatedRoute);
  }

  return route.queryParamMap.pipe(
    map((queryParamMap) => queryParamMap.get(param)),
    filter((value): value is string => typeof value === 'string'),
    distinctUntilChanged(),
    startWith(defaultParam ?? '')
  );
};
