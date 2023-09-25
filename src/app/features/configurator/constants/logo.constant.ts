import { InjectionToken } from '@angular/core';

const logoPath: string = 'assets/images/logo.png';

export const CONFIGURATOR_LOGO: InjectionToken<string> = new InjectionToken<string>('CONFIGURATOR_LOGO', {
  providedIn: 'root',
  factory: () => logoPath
});
