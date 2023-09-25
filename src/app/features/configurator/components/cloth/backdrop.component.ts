import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgtBeforeRenderEvent } from 'angular-three';
import { NgtsAccumulativeShadows, NgtsRandomizedLights } from 'angular-three-soba/staging';
import { Color, Group } from 'three';
import { ShadowMesh } from 'three-stdlib';
import { EEvents, EventBusService } from '../../../../core/services/event-bus.service';
import { dampColor } from '../../../../shared/utils/damp-color.util';
import { TPaletteColor } from '../../types/palette-color.type';

@Component({
  selector: 'app-backdrop',
  standalone: true,
  template: `
    <ngts-accumulative-shadows
      (beforeRender)="onBeforeRender($event)"
      [frames]="80"
      [temporal]="isTemporal()"
      [alphaTest]="0.85"
      [scale]="3"
      [rotation]="[Math.PI / 2, 0, 0]"
      [position]="[0, 0, -0.12]"
    >
      <ngts-randomized-lights
        [amount]="4"
        [radius]="9"
        [intensity]="0.60"
        [ambient]="0.75"
        [position]="[5, 5, -6]"
      />
    </ngts-accumulative-shadows>
  `,
  imports: [
    NgtsAccumulativeShadows,
    NgtsRandomizedLights
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BackdropComponent {
  readonly #eventBus: EventBusService = inject(EventBusService);

  public readonly Math = Math;

  public isTemporal = signal(true);

  constructor() {
    effect(() => {
      const color = this.color();

      if (color && this.isTemporal()) this.isTemporal.set(false);
    }, {
      allowSignalWrites: true
    });
  }

  public readonly color: Signal<TPaletteColor | undefined> = toSignal(this.#eventBus.on<TPaletteColor>(EEvents.ChangeColor));

  public onBeforeRender({ object }: NgtBeforeRenderEvent<Group>): void {
    if (!this.color()) return;

    const targetColor = new Color(this.color());
    const mesh = object.children[1] as ShadowMesh;
    let color = mesh.material.color;

    dampColor(color, targetColor);
  }
}
