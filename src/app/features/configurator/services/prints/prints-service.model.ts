import { Observable } from 'rxjs';
import { TPrintSource } from '../../types/print-source.type';

export abstract class PrintsService {
  public abstract getPrints(): Observable<Array<TPrintSource>>;
}
