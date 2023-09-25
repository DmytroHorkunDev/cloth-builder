import { InjectionToken } from '@angular/core';

const tShirtModel: string = 'assets/models/shirt1.glb';

export const CLOTHES_MODEL: InjectionToken<string> = new InjectionToken<string>('CLOTHES_MODEL', {
  providedIn: 'root',
  factory: () => tShirtModel
});
