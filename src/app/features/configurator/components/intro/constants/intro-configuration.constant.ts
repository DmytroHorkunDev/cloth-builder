import { InjectionToken } from '@angular/core';
import { TActionButton } from '../../../../../core/types/action-button.type';
import { TIntro } from '../types/intro.type';

export const INTRO_CONFIG: InjectionToken<TIntro> = new InjectionToken<TIntro>('INTRO_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    title: 'let’s do it.',
    subtitle: 'Create your unique and exclusive shirt with our brand-new 3D customization tool. <b>Unleash your imagination</b> and define your own style'
  })
});

export const INTRO_ACTIONS: InjectionToken<Array<TActionButton>> = new InjectionToken<Array<TActionButton>>('INTRO_ACTIONS', {
  providedIn: 'root',
  factory: () => ([
    {
      label: 'customize it',
      link: '/configurator/controllers'
    }
  ])
});
