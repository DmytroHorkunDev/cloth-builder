import { Observable } from 'rxjs';
import { TPaletteColor } from '../../types/palette-color.type';

export abstract class PaletteService {
  public abstract getPalette(): Observable<Array<TPaletteColor>>;
}
