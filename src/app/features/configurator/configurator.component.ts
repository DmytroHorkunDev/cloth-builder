import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, Input, NgZone, signal, Type, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgtCanvas } from 'angular-three';
import { Vector3 } from 'three';
import { EEvents, EventBusService, TEvent } from '../../core/services/event-bus.service';
import { slideOutLeft } from '../../shared/animations/slide-left-out.animation';
import { CONFIGURATOR_VIEW } from './constants/configurator-views.constant';
import { TConfiguratorView } from './types/configurator-view.type';

@Component({
  selector: 'app-configurator',
  standalone: true,
  template: `
    <div class="relative h-screen overflow-hidden  mx-auto">
      <div
        [ngClass]="{
          'flex max-w-screen-2xl mx-auto p-8 lg:p-12 items-center': !isFullScreen()
        }"
        class="pointer-events-none absolute z-10 inset-0"
        [@routeAnimations]="prepareRoute(outlet)"
      >
        <router-outlet #outlet="outlet"/>
      </div>

      <ngt-canvas
        *ngIf="environment && model && scene"
        (created)="updateCamera()"
        [shadows]="true"
        [sceneGraph]="scene"
        [sceneGraphInputs]="{
          environment: environment,
          model: model
        }"
        [camera]="camera"
        class="!h-screen"
      >
      </ngt-canvas>
    </div>
  `,
  imports: [
    NgtCanvas,
    RouterOutlet,
    NgClass,
    NgIf
  ],
  animations: [
    slideOutLeft,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ConfiguratorComponent {
  readonly #eventBus: EventBusService = inject(EventBusService);
  readonly #ngZone: NgZone = inject(NgZone);

  public readonly isFullScreen: WritableSignal<boolean> = signal(false);

  public camera: NgtCanvas['camera'] = {
    position: new Vector3(
      0,
      0, 0),
    fov: 25,
  };

  @Input()
  public scene?: Type<unknown>;

  @Input() set path(path: TConfiguratorView) {
    const fullScreenView: Array<TConfiguratorView> = [CONFIGURATOR_VIEW.CONTROLLERS];

    this.isFullScreen.set(fullScreenView.includes(path));
  }

  @Input()
  public environment?: string;

  @Input()
  public model?: string;

  constructor() {
    effect(() => {
      const isFullScreen = this.isFullScreen();
      this.changeView(isFullScreen);
    }, {
      allowSignalWrites: true
    });
  }

  public updateCamera(): void {
    this.#ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.isFullScreen()) return;

        this.changeView(false);
      }, 0);
    });
  }


  public changeView(isFullScreen: boolean): void {
    const viewData: TEvent<boolean> = {
      name: EEvents.IsFullScreenConfig,
      value: isFullScreen
    };

    this.#eventBus.emit(viewData);
  }

  public prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['view'];
  }
}
