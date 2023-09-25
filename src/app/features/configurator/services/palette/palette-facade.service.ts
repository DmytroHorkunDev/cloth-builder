import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cache } from '../../../../shared/utils/cache.decorator';
import { TPaletteColor } from '../../types/palette-color.type';
import { PaletteService } from './palette-service.model';

@Injectable({
  providedIn: 'root'
})
export class PaletteFacadeService {
  readonly #paletteService: PaletteService = inject(PaletteService);

  @Cache({
    resolver: () => 'palette',
    clearCacheTime: 1000 * 60 * 60
  })
  public getPalette(): Observable<Array<TPaletteColor>> {
    return this.#paletteService.getPalette();
  }
}
