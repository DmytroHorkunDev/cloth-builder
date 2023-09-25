import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TPaletteColor } from '../../types/palette-color.type';

@Injectable()
export class PaletteJsonService {
  readonly #http: HttpClient = inject(HttpClient);

  public getPalette(): Observable<Array<TPaletteColor>> {
    return this.#http.get<Array<TPaletteColor>>('assets/mock-server/palette.json');
  }
}
