import { Color } from 'three';
import { damp } from 'three/src/math/MathUtils.js';

export const dampColor = (currentColor: Color, targetColor: Color, lambda: number = 0.7, delta: number = 0.25): void => {

  const color = new Color(currentColor);

  currentColor.r = damp(color.r, targetColor.r, lambda, delta);
  currentColor.g = damp(color.g, targetColor.g, lambda, delta);
  currentColor.b = damp(color.b, targetColor.b, lambda, delta);
};
