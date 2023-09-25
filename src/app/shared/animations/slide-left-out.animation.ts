import { animate, group, query, style, transition, trigger } from '@angular/animations';

const slideTo = (direction: 'left' | 'right') => {
  const optional = { optional: true };
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        bottom: 0,
        [direction]: 0,
        width: '100%',
        opacity: 1
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '100%' })
    ]),
    group([
      query(':leave', [
        animate('600ms ease', style({ [direction]: '-100%', opacity: 0 }))
      ], optional),
      query(':enter', [
        animate('600ms ease', style({ [direction]: '0%', opacity: 1 }))
      ])
    ]),
  ];
};

export const slideOutLeft = trigger('routeAnimations', [
  transition('intro => controllers', slideTo('left')),
  transition('controllers => intro', slideTo('right'))
]);

