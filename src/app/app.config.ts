import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ClothComponent } from './features/configurator/components/cloth/cloth.component';
import { CLOTHES_MODEL } from './features/configurator/constants/clothes-model.constant';
import { CONFIGURATOR_VIEW } from './features/configurator/constants/configurator-views.constant';
import { CLOTHES_ENVIRONMENT } from './features/configurator/constants/environment.constant';
import { CONFIGURATOR_LOGO } from './features/configurator/constants/logo.constant';
import { PaletteFacadeService } from './features/configurator/services/palette/palette-facade.service';
import { PaletteJsonService } from './features/configurator/services/palette/palette-json.service';
import { PaletteService } from './features/configurator/services/palette/palette-service.model';
import { PrintsJsonService } from './features/configurator/services/prints/prints-json.service';
import { PrintsService } from './features/configurator/services/prints/prints-service.model';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: PaletteService,
      useClass: PaletteJsonService
    },
    {
      provide: PrintsService,
      useClass: PrintsJsonService
    },
    provideAnimations(),
    provideHttpClient(),
    provideRouter([
        {
          path: '',
          redirectTo: 'configurator',
          pathMatch: 'full'
        },
        {
          path: 'configurator',
          runGuardsAndResolvers: 'always',
          data: {
            environment: CLOTHES_ENVIRONMENT,
            scene: ClothComponent
          },
          resolve: {
            model: () => inject(CLOTHES_MODEL),
            path: (route: any) => {
              const selectedChild = route.children.find((child: any) => child.outlet === 'primary');
              return selectedChild?.data?.view ?? CONFIGURATOR_VIEW.INTRO;
            }
          },
          loadComponent: () => import('./features/configurator/configurator.component'),
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'intro',
            },
            {
              path: 'intro',
              data: {
                view: CONFIGURATOR_VIEW.INTRO
              },
              loadComponent: () => import('./features/configurator/components/intro/intro.component')
            },
            {
              path: 'controllers',
              data: {
                view: CONFIGURATOR_VIEW.CONTROLLERS
              },
              resolve: {
                logo: () => inject(CONFIGURATOR_LOGO),
                palette: () => {
                  const paletteService: PaletteFacadeService = inject(PaletteFacadeService);

                  return paletteService.getPalette();
                },
                prints: () => {
                  const printsService: PrintsService = inject(PrintsService);

                  return printsService.getPrints();
                }
              },
              loadComponent: () => import('./features/configurator/components/controllers/controllers.component')
            }
          ]
        }
      ],
      withComponentInputBinding()
    )
  ]
};
