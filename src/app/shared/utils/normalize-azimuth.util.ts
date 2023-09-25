import { clamp } from './clamp-util';

export const normalizeAzimuth = (azimuth: number, min: number, max: number): number => {
  const isFiniteValues = isFinite(min) && isFinite(max);

  if (!isFiniteValues) return azimuth;

  const twoPI = Math.PI * 2;
  let result = azimuth;
  if (min < -Math.PI) min += twoPI; else if (min > Math.PI) min -= twoPI;
  if (max < -Math.PI) max += twoPI; else if (max > Math.PI) max -= twoPI;

  if (min <= max) {
    result = clamp(result, min, max);
  } else {

    result = (result > (min + max) / 2) ?
      Math.max(min, result) :
      Math.min(max, result);
  }

  return result;
};
