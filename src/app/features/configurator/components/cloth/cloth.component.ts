import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, Injector, Input, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgtArgs, NgtBeforeRenderEvent } from 'angular-three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import { injectNgtsGLTFLoader, injectNgtsTextureLoader } from 'angular-three-soba/loaders';
import { NgtsDecal } from 'angular-three-soba/misc';
import { NgtsAdaptiveDpr } from 'angular-three-soba/performances';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { filter, switchMap } from 'rxjs';
import { Color, Mesh, Object3D, Texture } from 'three';
import { ShadowMesh } from 'three-stdlib';
import { EEvents, EventBusService } from '../../../../core/services/event-bus.service';
import { dampColor } from '../../../../shared/utils/damp-color.util';
import { viewport$ } from '../../../../shared/utils/viewport.util';
import { TPaletteColor } from '../../types/palette-color.type';
import { TPrintSource } from '../../types/print-source.type';
import { BackdropComponent } from './backdrop.component';
import { CameraRigComponent } from './camera-rig.component';

@Component({
  selector: 'app-cloth',
  standalone: true,
  imports: [
    NgtArgs,
    NgtsOrbitControls,
    NgIf,
    AsyncPipe,
    NgtsEnvironment,
    BackdropComponent,
    NgtsAdaptiveDpr,
    CameraRigComponent,
    NgtsDecal
  ],

  template: `
    <ng-container *ngIf="vm() as model">
      <app-camera-rig
        [minAzimuthAngle]="-angleRestriction"
        [maxAzimuthAngle]="angleRestriction"
        [minPolarAngle]="-angleRestriction"
        [maxPolarAngle]="angleRestriction"
        [isFullScreen]="isFullScreen()"
        [minDistance]="minDistance()"
        [maxDistance]="maxDistance()"
      >
        <ngts-center>
          <ngt-mesh
            (beforeRender)="onBeforeRender($event)"
            #mesh
            [scale]="scale"
            [castShadow]="true"
            [geometry]="model.geometry"
          >
            <ngt-mesh-standard-material
              *args="[model.material]"
            />
            <ngts-decal
              *ngIf="texture() as texture"
              [map]="texture"
              [rotation]="[0, 0, 0]"
              [polygonOffsetFactor]="-4"
              [position]="[0.0825, 0.1, 0.125]"
              [scale]="0.05"
            />
          </ngt-mesh>
          <app-backdrop/>
        </ngts-center>
      </app-camera-rig>
    </ng-container>

    <ngt-ambient-light
      [intensity]="0.5"
    ></ngt-ambient-light>
    <ngts-environment [files]="environment"></ngts-environment>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClothComponent {
  readonly #injector: Injector = inject(Injector);
  readonly #eventBus: EventBusService = inject(EventBusService);

  @Input({
    required: true
  })
  public scale = 0.55;

  @Input({
    required: true
  })
  public angleRestriction: number = Math.PI / 6;

  @Input({
    required: true
  })
  public model!: string;

  @Input({
    required: true
  })
  public environment!: string;

  readonly gltf = injectNgtsGLTFLoader(() => this.model);

  readonly viewport: Signal<number> = toSignal(viewport$, {
    initialValue: window.innerWidth
  });

  readonly maxDistance = computed(() => {
    const viewport = this.viewport();
    const isFullScreen = this.isFullScreen();

    return Math.max(((isFullScreen ? 0.4 : 0.6) + this.scale) * 1000 / viewport, 1.2);
  });

  readonly minDistance = computed(() => {
    const viewport = this.viewport();
    const isFullScreen = this.isFullScreen();

    return Math.max(((isFullScreen ? 1.5 : 0.65) + this.scale) * 1000 / viewport, 1.2);
  });

  public readonly isFullScreen = toSignal(this.#eventBus.on<boolean>(EEvents.IsFullScreenConfig), {
    initialValue: true
  });

  public readonly color: Signal<TPaletteColor | undefined> = toSignal(this.#eventBus.on<TPaletteColor>(EEvents.ChangeColor));

  readonly texture: Signal<Texture | undefined> = toSignal(this.#eventBus.on<TPrintSource>(EEvents.ChangeTexture)
                                                               .pipe(
                                                                 switchMap((print: TPrintSource) => toObservable(injectNgtsTextureLoader(() => print, {
                                                                   injector: this.#injector
                                                                 }), {
                                                                   injector: this.#injector
                                                                 })),
                                                                 filter((value): value is Texture => value !== null),
                                                               ));

  readonly vm = computed(() => {
    const model = this.gltf();

    if (!model) return null;

    const {
      materials,
      nodes,
    } = model;

    const config = {
      material: materials['lambert1'],
      geometry: (nodes['T_Shirt_male'] as unknown as {
        geometry: Object3D<Event>
      })['geometry']
    };

    (config.material as any).roughness = 1.0;

    return config;
  });

  public onBeforeRender({ object }: NgtBeforeRenderEvent<Mesh | Mesh[]>): void {
    const targetColor = new Color(this.color());

    const mesh = object as ShadowMesh;
    const color = mesh.material.color;

    dampColor(color, targetColor);
  }
}
