import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cache } from '../../../../shared/utils/cache.decorator';
import { TPrintSource } from '../../types/print-source.type';
import { PrintsService } from './prints-service.model';

@Injectable({
  providedIn: 'root'
})
export class PrintsFacadeService {
  readonly #printsService: PrintsService = inject(PrintsService);

  @Cache({
    resolver: () => 'prints',
    clearCacheTime: 1000 * 60 * 60
  })
  public getPalette(): Observable<Array<TPrintSource>> {
    return this.#printsService.getPrints();
  }
}
