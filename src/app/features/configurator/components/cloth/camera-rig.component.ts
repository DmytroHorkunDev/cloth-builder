import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgtBeforeRenderEvent } from 'angular-three';
import { Camera, Group } from 'three';
import { damp } from 'three/src/math/MathUtils.js';
import { clamp } from '../../../../shared/utils/clamp-util';
import { normalizeAzimuth } from '../../../../shared/utils/normalize-azimuth.util';

@Component({
  selector: 'app-camera-rig',
  standalone: true,
  template: `
    <ngt-group (beforeRender)="onBeforeRender($event)">
      <ng-content/>
    </ngt-group>
  `,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraRigComponent {

  @Input() lambda: number = 0.25;
  @Input() divider: number = 5;
  @Input() minDistance: number = 2.5;
  @Input() maxDistance: number = 1.3;

  @Input() minPolarAngle: number = 0;
  @Input() maxPolarAngle: number = Math.PI / 2;

  @Input() minAzimuthAngle: number = -Infinity;
  @Input() maxAzimuthAngle: number = Infinity;

  @Input({
    required: true
  }) isFullScreen!: boolean;

  public onBeforeRender(
    {
      state: { camera, delta, ...state },
      object
    }:
      NgtBeforeRenderEvent<Group>
  ): void {
    const { x: currentX, y: currentY } = state.pointer;
    const { y: targetY } = object.rotation;

    const xAxisShift = this.#getXAxisNonFullScreenShift(state.size.width);
    const yAxisShift = this.#getYAxisNonFullScreenShift(state.size.width);

    this.#updateCameraPosition(
      camera,
      xAxisShift,
      yAxisShift,
      delta
    );

    const [minAzimuth, maxAzimuth] = [this.minAzimuthAngle, this.maxAzimuthAngle];
    const xAxisNormalizer = this.isFullScreen ? 0 : xAxisShift;
    let targetXPosition = normalizeAzimuth(targetY + xAxisNormalizer, minAzimuth, maxAzimuth);

    const currentYPosition = clamp(-currentY, this.minPolarAngle, this.maxPolarAngle);
    const targetYPosition = clamp(targetXPosition, this.minPolarAngle, this.maxPolarAngle);
    object.rotation.x = this.#updateObjectAxisPosition(
      currentYPosition,
      targetYPosition,
      this.lambda,
      delta
    );

    const currentXPosition = clamp(currentX + xAxisNormalizer, minAzimuth, maxAzimuth);
    object.rotation.y = this.#updateObjectAxisPosition(
      currentXPosition,
      targetXPosition,
      this.lambda,
      delta
    );
  }

  #getXAxisNonFullScreenShift(viewportWidth: number): number {
    return viewportWidth <= 768 ? 0 : -(viewportWidth / (1000 * 11));
  }

  #getYAxisNonFullScreenShift(viewportWidth: number): number {
    return viewportWidth <= 768 ? -0.275 : 0;
  }

  #updateCameraPosition(camera: Camera, xShift: number, yShift: number, delta: number): void {
    camera.position.x = damp(camera.position.x, this.isFullScreen ? 0 : xShift, this.lambda * this.divider, delta);
    camera.position.y = damp(camera.position.y, this.isFullScreen ? 0 : yShift, this.lambda * this.divider, delta);
    camera.position.z = damp(camera.position.z, this.isFullScreen ? this.maxDistance : this.minDistance, this.lambda * this.divider, delta);
  }

  #updateObjectAxisPosition(
    currentPoint: number,
    targetPoint: number,
    lambda: number,
    delta: number
  ): number {
    return damp(
      currentPoint,
      targetPoint,
      lambda,
      delta
    );
  }
}
