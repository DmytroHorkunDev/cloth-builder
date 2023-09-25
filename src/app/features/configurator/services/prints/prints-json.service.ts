import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TPrintSource } from '../../types/print-source.type';

@Injectable()
export class PrintsJsonService {
  readonly #http: HttpClient = inject(HttpClient);

  public getPrints(): Observable<Array<TPrintSource>> {
    return this.#http.get<Array<TPrintSource>>('assets/mock-server/prints.json');
  }
}
